"use strict";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getUserInfo = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userData = await this.userService.getUserInfo(id);

      return res.status(200).json({
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  };

  updateNickname = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nickname } = req.body;

      await this.userService.updateNickname(id, nickname);

      return res.status(200).json({
        message: "상점명이 수정되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
