"use strict";

const express = require("express");
const {
  signupValidator,
  forgotPasswordValidator,
  verifyResetTokenValidator,
  resetPasswordValidator,
} = require("../validators/auth.validator");
const validate = require("../middleware/validate");

const AuthService = require("./../auth/auth.service");
const AuthController = require("./../auth/auth.controller");
const UserService = require("./../users/user.service");
const UserRepository = require("./../users/user.repository");

const authGuard = require("./../auth/guard/auth.guard");

const router = express.Router();

const userService = new UserService(new UserRepository());
const authController = new AuthController(new AuthService(userService));

router.post("/signup", signupValidator, validate, authController.signup);
router.post("/login", authController.login);
router.post("/logout", authGuard(), authController.logout);
router.post("/refresh", authController.refresh);

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  authController.forgotPassword
);
router.get(
  "/reset-password/:token",
  verifyResetTokenValidator,
  validate,
  authController.verifyResetToken
);
router.patch(
  "/reset-password/:token",
  resetPasswordValidator,
  validate,
  authController.resetPassword
);

module.exports = router;
