"use strict";

const { body } = require("express-validator");

exports.signupValidator = [
  body("email").isEmail().withMessage("이메일 형식이 올바르지 않습니다.").normalizeEmail(),

  body("nickname").isLength({ min: 2 }).withMessage("닉네임은 2자 이상 이여야 합니다.").trim(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("비밀번호는 최소 8자 이상이어야 합니다.")
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage("비밀번호는 영문과 숫자를 포함해야 합니다."),
];

exports.resetPasswordValidator = [
  body("email")
    .exists()
    .withMessage("이메일은 필수 항목입니다.")
    .isEmail()
    .withMessage("이메일 형식이 올바르지 않습니다.")
    .normalizeEmail(),

  body("password")
    .exists()
    .withMessage("비밀번호는 필수 항목입니다.")
    .isLength({ min: 8 })
    .withMessage("비밀번호는 최소 8자 이상이어야 합니다.")
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage("비밀번호는 영문과 숫자를 포함해야 합니다."),
];
