"use strict";

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // 테스트
  async getUsers() {
    const users = await this.userRepository.getUsers();

    return users;
  }
}

module.exports = UserService;
