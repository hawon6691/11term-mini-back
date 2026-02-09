"use strict";

const { body, param } = require("express-validator");

exports.createChatRoomValidator = [
  body("productId")
    .notEmpty()
    .withMessage("상품 ID는 필수입니다.")
    .isInt({ min: 1 })
    .withMessage("유효한 상품 ID가 아닙니다.")
    .toInt(),
];

exports.getMessagesValidator = [
  param("roomId")
    .notEmpty()
    .withMessage("채팅방 ID는 필수입니다.")
    .isInt({ min: 1 })
    .withMessage("유효한 채팅방 ID가 아닙니다.")
    .toInt(),
];
