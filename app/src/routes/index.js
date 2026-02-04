"use strict";

const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const authRouter = require("./auth");
const productRouter = require("./product");
const categoryRouter = require("./category");

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);

module.exports = router;
