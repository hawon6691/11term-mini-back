"use strict";

const path = require("path");
const CustomError = require("./customError");
const s3 = require("../config/s3");
const { HeadObjectCommand } = require("@aws-sdk/client-s3");

const PREFIX = "products/";

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

      if (!url.startsWith(PREFIX)) {
        throw new CustomError("올바르지 않은 이미지 경로입니다.", 400);
      }

      try {
        await s3.send(
          new HeadObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: url,
          })
        );
      } catch (error) {
        throw new CustomError(`존재하지 않는 이미지입니다.(${url})`, 400);
      }
    })
  );
}

module.exports = validateImagesExist;
