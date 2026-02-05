"use strict";

const { execute } = require("../config/db");

class ProductTagRepository {
  async create(productId, tags, connection) {
    const query = "INSERT INTO product_tags(product_id, tag_id) VALUES ?";

    const values = tags.map((tagId) => [productId, tagId]);

    const [rows] = await connection.query(query, [values]);

    return rows || null;
  }

  async findProductTags(productId) {
    const query = "SELECT * FROM product_tags WHERE product_id = ?;";

    const rows = await execute(query, [productId]);

    return rows || [];
  }
}

module.exports = ProductTagRepository;
