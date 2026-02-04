"use strict";

const CustomError = require("../utils/customError");

class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  create = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const files = req.files ?? [];

      const productInfo = {
        ...req.body,
        files,
        userId,
      };

      const productId = await this.productService.create(productInfo);

      res.status(201).json({ message: "상품 등록을 성공했습니다.", productId });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  findProducts = async (req, res, next) => {
    try {
      const { userId, searchType, value, limit = 50, cursor, cursorId } = req.query;

      const data = await this.productService.findProducts({
        userId,
        searchType,
        value,
        limit: Number(limit),
        cursor,
        cursorId: cursorId ? Number(cursorId) : null,
      });

      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  findProductById = async (req, res, next) => {
    try {
      const productId = req.params.id;

      if (!productId) {
        throw new CustomError("상품 ID가 올바르지 않습니다.");
      }

      const productData = await this.productService.findProductById(productId);

      res.status(200).json({ data: productData });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getTrendingProducts = async (req, res, next) => {
    try {
      const products = await this.productService.getTrendingProducts();

      res.status(200).json({
        data: products,
        totalCnt: products.length,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

module.exports = ProductController;
