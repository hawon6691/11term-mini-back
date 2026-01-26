"use strict";

const transaction = require("../config/transaction");
const CustomError = require("../utils/customError");
const buildImagePath = require("../utils/file.util");

class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async create({ files, ...productData }) {
    return transaction(async (connection) => {
      const product = await this.productRepository.create(productData, connection);

      if (!product || product.affectedRows !== 1) {
        throw new CustomError("상품 생성 실패");
      }

      const productId = product.insertId;

      if (files?.length) {
        const images = files.map((file) => ({
          productId,
          imageUrl: buildImagePath(file.filename),
        }));

        const result = await this.productRepository.saveProductImage(images, connection);

        if (!result || result.affectedRows !== images.length) {
          throw new CustomError("상품 이미지 저장 실패");
        }
      }

      return productId;
    });
  }
}

module.exports = ProductService;
