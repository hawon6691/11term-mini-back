"use strict";

const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const authRouter = require("./auth");
const productRouter = require("./product");
const categoryRouter = require("./category");
const searchRouter = require("./search");

const talkRouter = require("./talk");

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/search", searchRouter);

router.use("/talks", talkRouter);

module.exports = router;
