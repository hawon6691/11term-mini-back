"use strict";

const { execute } = require("../config/db");

class TalksRepository {
  async createChatRoom(productId, buyerId, sellerId, connection) {
    const query = `
      INSERT INTO chat_rooms (product_id, buyer_id, seller_id)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
    `;

    const [result] = await connection.query(query, [productId, buyerId, sellerId]);

    if (result.insertId) {
      return result.insertId;
    }

    const selectQuery = `
      SELECT id FROM chat_rooms
      WHERE product_id = ? AND buyer_id = ? AND seller_id = ?
    `;
    const [rows] = await connection.query(selectQuery, [productId, buyerId, sellerId]);
    return rows[0]?.id;
  }

  async findChatRoomById(roomId) {
    const query = `
      SELECT id, product_id AS productId, buyer_id AS buyerId, seller_id AS sellerId
      FROM chat_rooms
      WHERE id = ?
    `;

    const rows = await execute(query, [roomId]);
    return rows[0] || null;
  }

  async findChatRoomsByUserId(userId) {
    const query = `
      SELECT
        cr.id,
        cr.product_id AS productId,
        cr.buyer_id AS buyerId,
        cr.seller_id AS sellerId,
        cr.updated_at AS updatedAt,
        p.title AS productTitle,
        p.price AS productPrice,
        (SELECT content FROM chat_messages
         WHERE room_id = cr.id
         ORDER BY created_at DESC LIMIT 1) AS lastMessage,
        (SELECT COUNT(*) FROM chat_messages
         WHERE room_id = cr.id
         AND sender_id != ?
         AND is_read = 0) AS unreadCount
      FROM chat_rooms cr
      JOIN products p ON cr.product_id = p.id
      WHERE cr.buyer_id = ? OR cr.seller_id = ?
      ORDER BY cr.updated_at DESC
    `;

    const rows = await execute(query, [userId, userId, userId]);
    return rows || [];
  }

  async createMessage(messageData, connection) {
    const query = `
      INSERT INTO chat_messages
      (id, room_id, sender_id, content, message_type, extra, visibility, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(query, [
      messageData.id,
      messageData.roomId,
      messageData.senderId,
      messageData.content,
      messageData.messageType,
      messageData.extra,
      messageData.visibility,
      messageData.createdAt,
    ]);

    return result;
  }

  async findMessagesByRoomId(roomId, cursor, limit = 50) {
    let query = `
      SELECT
        id,
        sender_id AS uid,
        content,
        extra,
        message_type AS messageType,
        NULL AS additionalInfo,
        created_at AS createdAt,
        visibility
      FROM chat_messages
      WHERE room_id = ?
    `;

    const params = [roomId];

    if (cursor) {
      query += ` AND created_at < ?`;
      params.push(cursor);
    }

    query += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(limit);

    const rows = await execute(query, params);
    return rows || [];
  }

  async updateMessagesAsRead(roomId, userId, connection) {
    const query = `
      UPDATE chat_messages
      SET is_read = 1
      WHERE room_id = ? AND sender_id != ? AND is_read = 0
    `;

    const [result] = await connection.query(query, [roomId, userId]);
    return result;
  }

  async updateChatRoomTimestamp(roomId, connection) {
    const query = `
      UPDATE chat_rooms
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [result] = await connection.query(query, [roomId]);
    return result;
  }
}

module.exports = TalksRepository;
