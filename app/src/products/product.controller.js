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

  editProduct = async (req, res, next) => {
    try {
      const productId = req.params.id;
      const productData = req.body;
      const userId = req.user.id;

      await this.productService.editProduct(productId, productData, userId);

      res.status(200).json({ message: "상품 정보 수정에 성공하였습니다." });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const productId = req.params.id;
      const userId = req.user.id;

      await this.productService.deleteProduct(productId, userId);

      res.status(200).json({ message: "상품 삭제에 성공하였습니다." });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  editProductStatus = async (req, res, next) => {
    try {
      const productId = req.params.id;
      const userId = req.user.id;
      const status = req.body.status;

      await this.productService.editProductStatus(productId, Number(status), userId);

      res.status(200).json({ message: "상품 상태 변경에 성공하였습니다." });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  findTrendingProducts = async (req, res, next) => {
    try {
      const data = await this.productService.findTrendingProducts();
      const products = data?.products || [];

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
