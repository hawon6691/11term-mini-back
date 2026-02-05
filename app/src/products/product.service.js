"use strict";

const transaction = require("../config/transaction");
const CustomError = require("../utils/customError");
const buildImagePath = require("../utils/file.util");

class ProductService {
  constructor(productRepository, tagService, productTagService, categoryService, searchService) {
    this.productRepository = productRepository;
    this.tagService = tagService;
    this.productTagService = productTagService;
    this.categoryService = categoryService;
    this.searchService = searchService;
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

  async findProducts({ userId, searchType, value, limit, cursor, cursorId }) {
    // 검색어가 있으면 검색 로그 저장 (상점별 조회가 아닌 경우에만)
    if (value && !userId && this.searchService) {
      this.searchService
        .saveSearchLog(value, null)
        .catch((err) => console.error("검색 로그 저장 실패:", err));
    }

    if (userId || searchType) {
      if (searchType && searchType !== "tag" && searchType !== "title")
        throw new CustomError("잘못된 검색 형식입니다.", 400);

      return await this.productRepository.findProducts(
        userId,
        searchType,
        value,
        limit,
        cursor,
        cursorId
      );
    }

    return await this.productRepository.findAllProducts(limit, cursor, cursorId);
  }

  async findProductById(productId) {
    const rawProduct = await this.productRepository.findProductById(productId);

    if (!rawProduct) {
      throw new CustomError("존재하지 않은 상품입니다.", 404);
    }

    const { categoryId, ...product } = rawProduct;

    const [rawImages, rawCategory, rawProductTags] = await Promise.all([
      this.productRepository.findProductImages(productId),
      this.categoryService.findCategoryById(categoryId),
      this.productTagService.findProductTags(productId),
    ]);

    const tagIds = rawProductTags.map((tag) => tag.tagId);

    const tags = tagIds.length > 0 ? await this.tagService.findTagsByIds(tagIds) : [];

    const { parentId, ...categoryData } = rawCategory;

    const category = {
      category1: categoryData,
    };

    if (parentId) {
      const rawParentCategory = await this.categoryService.findCategoryById(parentId);

      const { parentId: _, ...parentCategory } = rawParentCategory;

      category.category1 = parentCategory;
      category.category2 = categoryData;
    }

    return {
      ...product,
      images: rawImages.map((image) => image.imageUrl),
      tags: tags.map((tag) => tag.name).join(" "),
      category,
    };
  }

  async findTrendingProducts() {
    const products = await this.productRepository.findTrendingProducts();

    // popularityScore를 그대로 유지하여 프론트엔드에서 활용 가능
    return { products };
  }
}

module.exports = ProductService;
