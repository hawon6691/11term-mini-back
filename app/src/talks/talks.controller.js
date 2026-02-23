"use strict";

class TalksController {
  constructor(talksService) {
    this.talksService = talksService;
  }

  createChatRoom = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { productId } = req.body;

      const result = await this.talksService.createChatRoom(userId, productId);

      res.status(201).json({
        message: "채팅방이 생성되었습니다.",
        roomId: result.roomId,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getChatRooms = async (req, res, next) => {
    try {
      const userId = req.user.id;

      const rooms = await this.talksService.getChatRooms(userId);

      res.status(200).json(rooms);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getMessages = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { roomId } = req.params;
      const { cursor } = req.query;

      const messages = await this.talksService.getMessages(userId, Number(roomId), cursor);

      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  uploadChatImage = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "이미지 파일이 필요합니다." });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

module.exports = TalksController;
