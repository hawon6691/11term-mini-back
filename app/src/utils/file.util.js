"use strict";

const fs = require("fs");
const path = require("path");

const buildImagePath = (filename) => {
  return `/uploads/products/${filename}`;
};

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return true;
  } catch (error) {
    console.error(`파일 삭제 실패: ${filePath}`, error);
    return false;
  }
};

const ensureDirectoryExists = (dirPath) => {
  try {
    const normalizedPath = path.normalize(dirPath);

    if (normalizedPath.includes("..")) {
      throw new Error("경로 탐색 공격 시도가 감지되었습니다.");
    }

    if (!fs.existsSync(normalizedPath)) {
      fs.mkdirSync(normalizedPath, { recursive: true });
    }
  } catch (error) {
    console.error(`디렉토리 생성 실패: ${dirPath}`, error);
    throw error;
  }
};

module.exports = {
  buildImagePath,
  deleteFile,
  ensureDirectoryExists,
};
