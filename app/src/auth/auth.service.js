"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

const CustomError = require("./../utils/customError");

class AuthService {
  constructor(userService) {
    this.userService = userService;
  }

  async signup(userInfo) {
    const existsUserEmail = await this.userService.findUserByEmail(userInfo.email);
    if (existsUserEmail) {
      throw new CustomError("이메일이 중복되었습니다.", 409);
    }

    const existsUserNickname = await this.userService.findUserByNickname(userInfo.nickname);
    if (existsUserNickname) {
      throw new CustomError("닉네임이 중복되었습니다", 409);
    }

    const hashedPassword = await bcrypt.hash(userInfo.password, 10);

    return await this.userService.signUp({
      ...userInfo,
      password: hashedPassword,
    });
  }

  async generateToken(user, type) {
    const payload = {
      id: user.id,
    };

    const jwtOption = {
      secret: type === "access" ? jwtConfig.accessSecret : jwtConfig.refreshSecret,
      expiresIn: type === "access" ? jwtConfig.accessExpiresIn : jwtConfig.refreshExpiresIn,
    };

    const token = jwt.sign(payload, jwtOption.secret, {
      expiresIn: jwtOption.expiresIn,
    });

    if (type === "refresh") {
      await this.userService.saveRefreshToken(user.id, token);
    }

    return token;
  }

  async refresh(token) {
    try {
      const payload = jwt.verify(token, jwtConfig.refreshSecret);
      const user = await this.userService.findUserById(payload.id);
      const userToken = await this.userService.findRefreshToken(payload.id);

      if (!user || userToken?.token !== token) {
        throw new CustomError("유효하지 않은 토큰입니다.", 401);
      }

      const accessToken = await this.generateToken(user, "access");

      return accessToken;
    } catch (error) {
      console.error(error);
      throw new CustomError("유효하지 않은 토큰입니다.", 401);
    }
  }

  async logout(token) {
    return await this.userService.removeRefreshToken(token);
  }
}

module.exports = AuthService;
