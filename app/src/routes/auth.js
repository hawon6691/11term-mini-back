"use strict";

const express = require("express");
const { signupValidator } = require("../validators/auth.validator");
const validate = require("../middleware/validate");

const AuthService = require("./../auth/auth.service");
const AuthController = require("./../auth/auth.controller");
const UserRepository = require("./../users/user.repository");

const authGuard = require("./../auth/guard/auth.guard");

const router = express.Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post("/signup", signupValidator, validate, authController.signup);
router.post("/login", authController.login);
router.post("/logout", authGuard(), authController.logout);
router.post("/refresh", authController.refresh);

module.exports = router;
