"use strict";

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const IMAGE_PATH = path.join("src", "uploads", "products");
const MAX_IMAGE_COUNT = 12; // 12개 까지만 받음
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 이미지당 최대 5MB

if (!fs.existsSync(IMAGE_PATH)) {
  fs.mkdirSync(IMAGE_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGE_PATH);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}_${uuid()}_${req.user.id}${ext}`;
    cb(null, filename);
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
