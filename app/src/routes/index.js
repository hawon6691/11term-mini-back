"use strict";

const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const authRouter = require("./auth");

router.use("/users", userRouter);
router.use("/auth", authRouter);

module.exports = router;
