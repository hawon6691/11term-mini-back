"use strict";

const transaction = require("../config/transaction");
const CustomError = require("../utils/customError");
const buildImagePath = require("../utils/file.util");

class ProductService {
  constructor(productRepository, tagService, productTagService) {
    this.productRepository = productRepository;
    this.tagService = tagService;
    this.productTagService = productTagService;
  }

  async create({ files, ...productData }) {
    return transaction(async (connection) => {
      const newProduct = await this.productRepository.create(productData, connection);

      if (!newProduct || newProduct.affectedRows !== 1) {
        throw new CustomError("상품 생성 실패");
      }

      const productId = newProduct.insertId;

      if (files?.length > 0) {
        const images = files.map((file) => ({
          productId,
          imageUrl: buildImagePath(file.filename),
        }));

        const result = await this.productRepository.saveProductImage(images, connection);

        if (!result || result.affectedRows !== images.length)
          throw new CustomError("상품 이미지 저장 실패");
      }

      const tags = [...new Set(this.#splitTag(productData.tags))];

      if (tags.length > 0) {
        const createdTagsId = await this.tagService.createOrFindTags(tags, connection);

        const productTags = await this.productTagService.create(
          productId,
          createdTagsId,
          connection
        );

        if (productTags.affectedRows !== createdTagsId.length) {
          throw new CustomError("상품 태그 연결 실패");
        }
      }

      return productId;
    });
  }

  #splitTag(strTag) {
    if (!strTag) return [];

    return strTag
      .trim()
      .split(" ")
      .filter((tag) => tag);
  }
}

module.exports = ProductService;
