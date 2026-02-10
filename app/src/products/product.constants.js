"use strict";

const PRODUCT_STATUS = Object.freeze({
  ON_SALE: 0, // 판매 중
  RESERVED: 1, // 예약 중
  SOLD_OUT: 2, // 판매 완료
});

const PRODUCT_CONDITION = Object.freeze({
  NEW: 0, // 새 상품
  LIKE_NEW: 1, // 거의 새 것
  GOOD: 2, // 좋음
  FAIR: 3, // 보통
});

const TRENDING_CONFIG = Object.freeze({
  DAYS_LIMIT: 7, // 최근 몇 일 내 상품
  RESULT_LIMIT: 20, // 반환할 상품 수
  LIKE_WEIGHT: 2, // 좋아요 가중치 (인기도 점수 계산 시)
});

module.exports = {
  PRODUCT_STATUS,
  PRODUCT_CONDITION,
  TRENDING_CONFIG,
};
