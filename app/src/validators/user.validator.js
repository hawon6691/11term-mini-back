"use strict";

const { body } = require("express-validator");

exports.updateNicknameValidator = [
  body("nickname")
    .trim()
    .notEmpty()
    .withMessage("상점명을 입력해주세요.")
    .isLength({ min: 2 })
    .withMessage("상점명은 최소 2자 이상이어야 합니다.")
    .isLength({ max: 20 })
    .withMessage("상점명은 최대 20자까지 가능합니다.")
    .matches(/^[가-힣a-zA-Z0-9]+$/)
    .withMessage("상점명은 한글, 영문, 숫자만 사용 가능합니다."),
];

exports.updateSummeryValidator = [
  body("summary")
    .optional({ nullable: true })
    .isLength({ max: 1000 })
    .withMessage("소개글은 1000자를 초과할 수 없습니다."),
];

exports.followValidator = [
  body("targetId")
    .notEmpty()
    .withMessage("팔로우 대상 ID는 필수입니다.")
    .isInt({ min: 1 })
    .withMessage("유효한 사용자 ID가 아닙니다.")
    .toInt(),
];
