"use strict";

const transaction = require("../config/transaction");
const CustomError = require("../utils/customError");
const { nanoid } = require("nanoid");
const {
  MESSAGE_TYPES,
  VISIBILITY,
  createProductInfoExtra,
  createInitialMessageContent,
} = require("../constants/messageTypes");

class TalksService {
  constructor(talksRepository, productRepository) {
    this.talksRepository = talksRepository;
    this.productRepository = productRepository;
  }

  async createChatRoom(userId, productId) {
    return transaction(async (connection) => {
      const product = await this.productRepository.findProductById(productId);
      if (!product) {
        throw new CustomError("존재하지 않는 상품입니다.", 404);
      }

      const sellerId = product.userId;
      if (userId === sellerId) {
        throw new CustomError("본인의 상품에는 채팅을 시작할 수 없습니다.", 400);
      }

      const roomId = await this.talksRepository.createChatRoom(
        productId,
        userId,
        sellerId,
        connection
      );

      const initialMessageId = nanoid();
      const initialMessage = {
        id: initialMessageId,
        roomId: roomId,
        senderId: userId,
        content: createInitialMessageContent(product),
        messageType: MESSAGE_TYPES.PRODUCT_INFO,
        extra: createProductInfoExtra(productId, product.title, product.price),
        visibility: VISIBILITY.SENDER_ONLY,
        createdAt: new Date(),
      };

      await this.talksRepository.createMessage(initialMessage, connection);

      return { roomId };
    });
  }

  async getChatRooms(userId) {
    const rooms = await this.talksRepository.findChatRoomsByUserId(userId);
    return rooms;
  }

  async getMessages(userId, roomId, cursor) {
    const room = await this.talksRepository.findChatRoomById(roomId);
    if (!room) {
      throw new CustomError("존재하지 않는 채팅방입니다.", 404);
    }

    if (room.buyerId !== userId && room.sellerId !== userId) {
      throw new CustomError("해당 채팅방에 접근할 권한이 없습니다.", 403);
    }

    const messages = await this.talksRepository.findMessagesByRoomId(roomId, cursor, 50);

    const reversedMessages = messages.reverse();

    const nextCursor = messages.length === 50 ? messages[0].createdAt : null;

    return {
      readableStartAt: reversedMessages[0]?.createdAt || new Date().toISOString(),
      otherLastMsgCreatedAt: reversedMessages[reversedMessages.length - 1]?.createdAt || null,
      minMessageDateGuide: null,
      minMessageDate: reversedMessages[0]?.createdAt || new Date().toISOString(),
      data: reversedMessages,
      cursor: nextCursor,
    };
  }

  async markMessagesAsRead(userId, roomId) {
    return transaction(async (connection) => {
      const room = await this.talksRepository.findChatRoomById(roomId);
      if (!room) {
        throw new CustomError("존재하지 않는 채팅방입니다.", 404);
      }

      if (room.buyerId !== userId && room.sellerId !== userId) {
        throw new CustomError("해당 채팅방에 접근할 권한이 없습니다.", 403);
      }

      await this.talksRepository.updateMessagesAsRead(roomId, userId, connection);
    });
  }

  async sendMessage(userId, roomId, messageData) {
    return transaction(async (connection) => {
      const room = await this.talksRepository.findChatRoomById(roomId);
      if (!room) {
        throw new CustomError("존재하지 않는 채팅방입니다.", 404);
      }

      if (room.buyerId !== userId && room.sellerId !== userId) {
        throw new CustomError("해당 채팅방에 메시지를 보낼 권한이 없습니다.", 403);
      }

      const message = {
        id: nanoid(),
        roomId: roomId,
        senderId: userId,
        content: messageData.content,
        messageType: messageData.messageType || MESSAGE_TYPES.TEXT,
        extra: messageData.extra || "{}",
        visibility: messageData.visibility || VISIBILITY.ALL,
        createdAt: new Date(),
      };

      await this.talksRepository.createMessage(message, connection);

      await this.talksRepository.updateChatRoomTimestamp(roomId, connection);

      return {
        ...message,
        uid: message.senderId,
        additionalInfo: null,
      };
    });
  }
}

module.exports = TalksService;
