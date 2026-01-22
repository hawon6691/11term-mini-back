"use strict";

const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
require("./src/passport")(passport);
app.use(passport.initialize());
app.use(morgan("dev"));

const indexRouter = require("./src/routes");
const errorMiddleware = require("./src/middleware/error.middleware");

app.use("/", indexRouter);

app.use(errorMiddleware);

module.exports = app;
