"use strict";

const { body } = require("express-validator");

exports.saveSearchLogValidator = [
  body("keyword")
    .notEmpty()
    .withMessage("검색어를 입력해주세요.")
    .isString()
    .withMessage("검색어는 문자열이어야 합니다.")
    .trim()
    .isLength({ min: 1 })
    .withMessage("검색어를 입력해주세요.")
    .isLength({ max: 100 })
    .withMessage("검색어는 100자 이하로 입력해주세요."),
];
