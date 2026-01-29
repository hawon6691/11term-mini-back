"use strict";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getUserInfo = async (req, res) => {
    try {
      const { id } = req.params;
      const userData = await this.userService.getUserInfo(id);

      return res.status(200).json({
        data: userData,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message,
      });
    }
  };
}

module.exports = UserController;
