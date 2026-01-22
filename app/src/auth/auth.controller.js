"use strict";

const passport = require("passport");

const CustomError = require("./../utils/customError");

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  signup = async (req, res, next) => {
    try {
      const userInfo = req.body;

      const result = await this.authService.signup(userInfo);

      if (!result) {
        throw new CustomError("회원가입에 실패했습니다.", 400);
      }

      res.status(201).json({
        message: "회원가입에 성공했습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  login = (req, res, next) => {
    passport.authenticate("local", { session: false }, async (err, user, info) => {
      try {
        if (err) return next(err);

        if (!user) {
          throw new CustomError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);
        }

        const accessToken = await this.authService.generateToken(user, "access");
        const refreshToken = await this.authService.generateToken(user, "refresh");

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
        });

        return res.status(200).json({ accessToken: accessToken });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };

  refresh = async (req, res, next) => {
    try {
      const accessToken = await this.authService.refresh(req.cookies.refreshToken);

      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      if (!req.cookies.refreshToken) {
        return res.status(200).json({ message: "이미 로그아웃된 사용자입니다." });
      }

      const isLogout = await this.authService.logout(req.cookies.refreshToken);

      if (!isLogout) {
        return res.status(200).json({ message: "이미 로그아웃된 사용자입니다." });
      }

      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });

      res.status(200).json({ message: "로그아웃 성공" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
