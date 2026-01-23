"use strict";

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
}

module.exports = ProductController;
