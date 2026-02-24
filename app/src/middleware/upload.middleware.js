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

const uploadProfileImage = (req, res, next) => {
  const userProfileDir = path.join("uploads", "users", String(req.user.id), "profile");
  ensureDirectoryExists(userProfileDir);

  const multerSingle = profileUpload.single("image");

  multerSingle(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            error: "파일 크기는 5MB를 초과할 수 없습니다.",
          });
        }
        return res.status(400).json({
          error: "파일 업로드 중 오류가 발생했습니다.",
        });
      }

      return res.status(400).json({
        error: err.message,
      });
    }

    next();
  });
};

module.exports = {
  upload,
  MAX_IMAGE_COUNT,
  uploadProfileImage,
};
