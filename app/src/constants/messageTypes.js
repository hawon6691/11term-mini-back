"use strict";

const MESSAGE_TYPES = {
  TEXT: 1,
  EMOTICON: 15,
  PRODUCT_INFO: 100,
};

const VISIBILITY = {
  ALL: "ALL",
  SENDER_ONLY: "SENDER_ONLY",
};

function createProductInfoExtra(productId, title, price) {
  const data = {
    type: "product",
    productId,
    title,
    price,
  };

  if (!productId || !title || typeof price !== "number") {
    throw new Error("Invalid product info data structure");
  }

  return JSON.stringify(data);
}

function createInitialMessageContent(product) {
  return `${product.title}에 대한 이야기를 시작해보세요.`;
}

module.exports = {
  MESSAGE_TYPES,
  VISIBILITY,
  createProductInfoExtra,
  createInitialMessageContent,
};
