"use strict";

const { execute } = require("./../config/db");
const camelcaseKeys = require("camelcase-keys").default;

class CategoryRepository {
  async findAllCategories() {
    const query = "SELECT * FROM categories";

    const rows = await execute(query);

    const result = camelcaseKeys(rows, { deep: true });

    return result || null;
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
