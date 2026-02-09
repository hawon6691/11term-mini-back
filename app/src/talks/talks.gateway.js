"use strict";

const jwt = require("jsonwebtoken");
const { accessSecret: JWT_SECRET } = require("../config/jwt");

class TalksGateway {
  constructor(io, talksService) {
    this.io = io;
    this.talksService = talksService;
    this.connectedUsers = new Map(); // userId -> socketId 매핑
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
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication error"));
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
      const userId = socket.userId;
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
      const userId = socket.userId;
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
