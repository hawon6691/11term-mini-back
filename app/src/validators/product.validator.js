"use strict";

const { body } = require("express-validator");

exports.createProductValidator = [
  body("title").trim().notEmpty().withMessage("상품명은 필수 입니다."),

  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("상품 설명은 2000자 이내여야 합니다."),

  body("price")
    .notEmpty()
    .withMessage("가격은 필수입니다.")
    .isInt({ min: 0 })
    .withMessage("가격은 0원 이상의 숫자여야 합니다.")
    .toInt(),

  body("productCondition")
    .notEmpty()
    .withMessage("상품 상태는 필수입니다.")
    .isIn([0, 1, 2, 3, 4])
    .withMessage("상품 상태 값이 올바르지 않습니다."),

  body("isShippingCost")
    .notEmpty()
    .withMessage("배송비 여부는 필수입니다.")
    .isBoolean()
    .withMessage("배송비 여부 값이 올바르지 않습니다.")
    .toBoolean(),

  body("shippingCost")
    .if(body("isShippingCost").equals("true"))
    .notEmpty()
    .withMessage("배송비를 입력해주세요.")
    .isInt({ min: 0 })
    .withMessage("배송비는 0원 이상의 숫자여야 합니다.")
    .toInt(),

  body("isDirectDeal")
    .notEmpty()
    .withMessage("직거래 여부는 필수입니다.")
    .isBoolean()
    .withMessage("직거래 여부 값이 올바르지 않습니다.")
    .toBoolean(),

  body("directDealLocation")
    .if(body("isDirectDeal").equals("true"))
    .trim()
    .notEmpty()
    .withMessage("직거래 장소를 입력해주세요."),

  body("categoryId")
    .notEmpty()
    .withMessage("카테고리는 필수입니다.")
    .isInt()
    .withMessage("카테고리 값이 올바르지 않습니다.")
    .toInt(),
];
