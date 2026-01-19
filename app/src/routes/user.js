"use strict";

const express = require("express");
const UserController = require("../users/user.controller");
const UserService = require("../users/user.service");
const UserRepository = require("../users/user.repository");

const router = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/", userController.getUsers);

module.exports = router;
