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

  async getUserInfo(userId) {
    const [user, followData] = await Promise.all([
      this.userRepository.findUserById(userId),
      this.userRepository.getFollowInfo(userId),
    ]);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      address: user.address,
      visitCount: user.visitCount,
      createdAt: user.createdAt,
      imageUrl: user.imageUrl,
      follow: {
        followingList: followData.followingList,
        followerList: followData.followerList,
        followingCnt: followData.followingCnt,
        followerCnt: followData.followerCnt,
      },
    };
  }
}

module.exports = UserService;
