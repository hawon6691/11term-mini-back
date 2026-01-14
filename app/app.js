const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const indexRouter = require("./src/routes");

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use("/", indexRouter);

module.exports = app;
