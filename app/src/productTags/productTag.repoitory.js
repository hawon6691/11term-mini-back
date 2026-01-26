"use strict";

class ProductTagRepository {
  async create(productId, tags, connection) {
    const query = "INSERT INTO product_tags(product_id, tag_id) VALUES ?";

    const values = tags.map((tagId) => [productId, tagId]);

    const [rows] = await connection.query(query, [values]);

    return rows || null;
  }
}

module.exports = ProductTagRepository;
