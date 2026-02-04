"use strict";

const path = require("path");
const fs = require("fs").promises;
const CustomError = require("./customError");

const UPLOAD_URL = "/uploads/products/";
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "products");

async function validateImagesExist(imageUrls) {
  if (!Array.isArray(imageUrls)) {
    throw new CustomError("images는 배열이어야 합니다.", 400);
  }

  if (imageUrls.length > 15) {
    throw new CustomError("이미지는 최대 15개까지 업로드가 가능합니다.", 400);
  }

  const uniqueUrls = [...new Set(imageUrls)];

  await Promise.all(
    uniqueUrls.map(async (url) => {
      if (typeof url !== "string") {
        throw new CustomError("이미지 URL 형식이 올바르지 않습니다.", 400);
      }

      if (!url.startsWith(UPLOAD_URL)) {
        throw new CustomError("올바르지 않은 이미지 경로입니다.", 400);
      }

      const filename = path.basename(url);
      const filePath = path.join(UPLOAD_DIR, filename);

      try {
        await fs.access(filePath);
      } catch (error) {
        throw new CustomError(`존재하지 않는 이미지입니다.(${filename})`, 400);
      }
    })
  );
}

module.exports = validateImagesExist;
