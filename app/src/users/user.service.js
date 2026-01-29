"use strict";

const CustomError = require("../utils/customError");

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
      throw new CustomError("사용자를 찾을 수 없습니다.", 404);
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

  async updateNickname(userId, nickname) {
    if (!nickname || nickname.trim() === "") {
      throw new CustomError("상점명을 입력해주세요.", 400);
    }

    const trimmedNickname = nickname.trim();
    if (trimmedNickname.length < 2) {
      throw new CustomError("상점명은 최소 2자 이상이어야 합니다.");
    }
    if (trimmedNickname.length > 20) {
      throw new CustomError("상점명은 최대 20자 까지 가능합니다.");
    }

    const nicknamePattern = /^[가-힣a-zA-Z0-9]+$/;
    if (!nicknamePattern.test(trimmedNickname)) {
      throw new CustomError("상점명은 한글, 영문, 숫자만 사용 가능합니다.", 400);
    }

    const existingUser = await this.userRepository.findUserByNickname(trimmedNickname);

    if (existingUser && existingUser.id !== parseInt(userId)) {
      throw new CustomError("이미 사용 중인 상점명입니다.", 409);
    }

    await this.userRepository.updateNickname(userId, trimmedNickname);
  }
}

module.exports = UserService;
