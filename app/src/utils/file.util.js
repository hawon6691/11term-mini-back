"use strict";

const buildImagePath = (filename) => {
  return `/uploads/products/${filename}`;
};

module.exports = buildImagePath;
