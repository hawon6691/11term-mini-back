"use strict";

const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "요청 값이 올바르지 않습니다.",
      errors: errors.array().map((e) => e.msg),
    });
  }

  next();
};
