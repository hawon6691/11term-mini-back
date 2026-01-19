"use strict";

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const indexRouter = require("./src/routes");

app.use("/", indexRouter);

module.exports = app;
