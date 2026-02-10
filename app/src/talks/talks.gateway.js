"use strict";

const jwt = require("jsonwebtoken");
const { accessSecret: JWT_SECRET } = require("../config/jwt");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

class TalksGateway {
  constructor(io, talksService) {
    this.io = io;
    this.talksService = talksService;
    this.setupRedisAdapter();
  }

  async setupRedisAdapter() {
    try {
      const pubClient = createClient({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
      });

      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.io.adapter(createAdapter(pubClient, subClient));

      console.log("Redis Adapter initialized for Socket.io");
    } catch (error) {
      console.error("Failed to setup Redis Adapter:", error);
    }
  }

  initialize() {
    this.io.use(this.authenticate.bind(this));

    this.io.on("connection", (socket) => {
      const userId = socket.userId;
      console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);

      this.connectedUsers.set(userId, socket.id);

      socket.on("join_room", (data) => this.handleJoinRoom(socket, data));
      socket.on("send_message", (data) => this.handleSendMessage(socket, data));
      socket.on("read_messages", (data) => this.handleReadMessages(socket, data));

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${userId}, Socket ID: ${socket.id}`);
        this.connectedUsers.delete(userId);
      });
    });
  }

  authenticate(socket, next) {
    try {
      const token =
        socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      socket.token = token;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication error"));
    }
  }

  verifyTokenAndGetUserId(socket) {
    try {
      if (!socket.token) {
        return null;
      }
      const decoded = jwt.verify(socket.token, JWT_SECRET);
      return decoded.id;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  async handleJoinRoom(socket, data) {
    try {
      const { roomId } = data;
      const userId = socket.userId;

      socket.join(`room_${roomId}`);
      console.log(`User ${userId} joined room ${roomId}`);

      await this.talksService.markMessagesAsRead(userId, roomId);

      this.io.to(`room_${roomId}`).emit("user_joined", {
        userId,
        roomId,
      });
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", {
        message: error.message || "채팅방 입장에 실패했습니다.",
      });
    }
  }

  async handleSendMessage(socket, data) {
    try {
      const userId = this.verifyTokenAndGetUserId(socket);
      if (!userId) {
        socket.emit("error", {
          message: "인증 토큰이 만료되었습니다. 다시 로그인해주세요.",
        });
        socket.disconnect();
        return;
      }

      const { roomId, content, messageType, extra } = data;

      const message = await this.talksService.sendMessage(userId, roomId, {
        content,
        messageType: messageType || 1,
        extra: extra || "{}",
        visibility: "ALL",
      });

      this.io.to(`room_${roomId}`).emit("new_message", message);

      console.log(`Message sent in room ${roomId} by user ${userId}`);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", {
        message: error.message || "메시지 전송에 실패했습니다.",
      });
    }
  }

  async handleReadMessages(socket, data) {
    try {
      const userId = this.verifyTokenAndGetUserId(socket);
      if (!userId) {
        socket.emit("error", {
          message: "인증 토큰이 만료되었습니다. 다시 로그인해주세요.",
        });
        socket.disconnect();
        return;
      }

      const { roomId } = data;

      await this.talksService.markMessagesAsRead(userId, roomId);

      this.io.to(`room_${roomId}`).emit("messages_read", {
        userId,
        roomId,
      });

      console.log(`Messages read in room ${roomId} by user ${userId}`);
    } catch (error) {
      console.error("Error marking messages as read:", error);
      socket.emit("error", {
        message: error.message || "메시지 읽음 처리에 실패했습니다.",
      });
    }
  }
}

module.exports = TalksGateway;
