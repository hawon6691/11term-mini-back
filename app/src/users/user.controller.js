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
}

module.exports = UserController;
