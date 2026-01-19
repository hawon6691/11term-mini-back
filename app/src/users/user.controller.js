"use strict";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // 테스트
  getUsers = async (req, res) => {
    try {
      const users = await this.userService.getUsers();

      res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  };
}

module.exports = UserController;
