"use strict";

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async findUserById(id) {
    const user = await this.userRepository.findUserById(id);

    return user;
  }

  async findUserByEmail(email) {
    const user = await this.userRepository.findUserByEmail(email);

    return user;
  }

  async findUserByNickname(nickname) {
    const user = await this.userRepository.findUserByEmail(nickname);

    return user;
  }
}

module.exports = UserService;
