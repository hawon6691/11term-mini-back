"use strict";

class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async findCategories() {
    const categories = await this.categoryRepository.findCategories();

    const result = [];
    for (const category of categories) {
      const { id, name, parentId } = category;
      const categoryObj = { id, name };

      if (parentId) {
        if (result[parentId].sub) {
          result[parentId].sub.push(categoryObj);
        } else {
          result[parentId].sub = [categoryObj];
        }

        continue;
      }

      result[id] = categoryObj;
    }

    return result.filter((category) => category);
  }

  async findCategoryById(id) {
    const result = await this.categoryRepository.findCategoryById(id);

    return result;
  }
}

module.exports = CategoryService;
