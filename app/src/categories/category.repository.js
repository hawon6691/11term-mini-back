"use strict";

const { execute } = require("./../config/db");

class CategoryRepository {
  async findCategories() {
    const query = "SELECT * FROM categories";

    const rows = await execute(query);

    return rows || null;
  }

  async findCategoryById(id) {
    const query = "SELECT * FROM categories WHERE id = ?;";

    const [rows] = await execute(query, [id]);

    return rows || null;
  }

  async findCategoryByName(categoryName) {
    const query = "SELECT * FROM categories WHERE name = ?;";

    const [rows] = await execute(query, [categoryName]);

    return rows || null;
  }
}

module.exports = CategoryRepository;
