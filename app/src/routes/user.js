"use strict";

const express = require("express");
const UserController = require("../users/user.controller");
const UserService = require("../users/user.service");
const UserRepository = require("../users/user.repository");
const authGuard = require("../auth/guard/auth.guard");
const { updateNicknameValidator } = require("../validators/user.validator");
const validate = require("../middleware/validate");

const router = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.patch(
  "/nickname",
  authGuard(),
  updateNicknameValidator,
  validate,
  userController.updateNickname
);
router.get("/:id", userController.getUserInfo);

module.exports = router;
