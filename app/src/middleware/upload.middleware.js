"use strict";

const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const { v4: uuid } = require("uuid");
const s3 = require("./../config/s3");

const MAX_IMAGE_COUNT = 12; // 12개 까지만 받음
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 이미지당 최대 5MB
const S3_PRODUCTS = "products";

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}_${uuid()}_${req.user.id}${ext}`;
    cb(null, path.join(S3_PRODUCTS, filename));
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("이미지 파일만 업로드 가능합니다."));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE },
});

module.exports = {
  upload,
  MAX_IMAGE_COUNT,
};
