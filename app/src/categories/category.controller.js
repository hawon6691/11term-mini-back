"use strict";

class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  findCategories = async (req, res, next) => {
    try {
      const categories = await this.categoryService.findCategories();

      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

module.exports = CategoryController;
