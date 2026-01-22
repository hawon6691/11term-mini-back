"use strict";

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async findUserById(id) {
    return await this.userRepository.findUserById(id);
  }

  async findUserByEmail(email) {
    return await this.userRepository.findUserByEmail(email);
  }

  async findUserByNickname(nickname) {
    return await this.userRepository.findUserByNickname(nickname);
  }

  async signUp(userInfo) {
    return await this.userRepository.create(userInfo);
  }

  async saveRefreshToken(userId, token) {
    return await this.userRepository.saveRefreshToken(userId, token);
  }

  async removeRefreshToken(token) {
    return await this.userRepository.removeRefreshToken(token);
  }

  async findRefreshToken(id) {
    return await this.userRepository.findRefreshToken(id);
  }
}

module.exports = UserService;
