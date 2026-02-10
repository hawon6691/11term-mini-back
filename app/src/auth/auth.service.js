"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const jwtConfig = require("../config/jwt");
const { sendPasswordResetEmail, sendPasswordChangedEmail } = require("../utils/email.util");

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
      nickname: user.nickname,
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

  async forgotPassword(email) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return true;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + jwtConfig.resetPasswordTokenExpires);

    await this.userService.updateResetToken(user.id, resetToken, expiresAt);
    await sendPasswordResetEmail(email, resetToken);

    return true;
  }

  async verifyResetToken(token) {
    const user = await this.userService.findUserByResetToken(token);

    if (!user) {
      throw new CustomError("유효하지 않거나 만료된 토큰입니다.", 400);
    }

    return user;
  }

  async resetPassword(token, newPassword) {
    const user = await this.verifyResetToken(token);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const isUpdated = await this.userService.updatePasswordAndClearToken(
      user.id,
      hashedPassword
    );

    if (!isUpdated) {
      throw new CustomError("비밀번호 변경에 실패했습니다.", 500);
    }

    await this.userService.removeAllRefreshTokensByUserId(user.id);

    try {
      await sendPasswordChangedEmail(user.email);
    } catch (error) {
      console.error("비밀번호 변경 알림 이메일 발송 실패:", error);
    }

    return true;
  }
}

module.exports = AuthService;
