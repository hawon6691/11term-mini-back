"use strict";

const { execute } = require("./../config/db");
const { PRODUCT_STATUS, TRENDING_CONFIG } = require("./product.constants");

const QUERY = {
  FIND_ALL_PRODUCTS_QUERY: `SELECT p.id AS product_id, p.title, p.price, p.created_at, p.is_shipping_cost, p.sale_status, i.image_url
    FROM products p LEFT JOIN product_images i ON i.product_id = p.id AND i.is_thumbnail = 1 WHERE deleted_at IS NULL`,
  CURSOR_QUERY: "AND (p.created_at < ? OR (p.created_at = ? AND p.id < ?))",
  ORDER_BY_AND_LIMIT_QUERY: "ORDER BY p.created_at DESC, p.id DESC LIMIT ?",
};

class ProductRepository {
  async create(productInfo, connection) {
    const query = `INSERT INTO
      products(user_id, title, description, product_condition, price, is_shipping_cost, shipping_cost, is_direct_deal, direct_deal_location, category_id)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    const [rows] = await connection.query(query, [
      productInfo.userId,
      productInfo.title,
      productInfo.description,
      productInfo.productCondition,
      productInfo.price,
      productInfo.isShippingCost,
      productInfo.shippingCost || null,
      productInfo.isDirectDeal,
      productInfo.directDealLocation,
      productInfo.categoryId,
    ]);

    return rows || null;
  }

  async saveProductImage(productId, images, connection) {
    const query = "INSERT INTO product_images(product_id, image_url, is_thumbnail) VALUES ?;";

    const values = images.map((img, index) => [productId, img, index === 0]);

    const [rows] = await connection.query(query, [values]);

    return rows || null;
  }

  async deleteProductImage(productId, connection) {
    const query = "DELETE FROM product_images WHERE product_id = ?;";

    const [rows] = await connection.query(query, [productId]);

    return rows || null;
  }

  async findProductImages(productId) {
    const query = "SELECT * FROM product_images WHERE product_id = ?;";

    const rows = await execute(query, [productId]);

    return rows || [];
  }

  async findAllProducts(limit, cursor, cursorId) {
    const params = [];
    let query = QUERY.FIND_ALL_PRODUCTS_QUERY;

    if (cursor && cursorId) {
      query += ` ${QUERY.CURSOR_QUERY}`;

      params.push(cursor, cursor, cursorId);
    }

    query += ` ${QUERY.ORDER_BY_AND_LIMIT_QUERY}`;
    params.push(limit);

    const rows = await execute(query, params);

    return {
      products: rows,
      nextCursor: rows.length
        ? { cursor: rows[rows.length - 1].createdAt, cursorId: rows[rows.length - 1].productId }
        : null,
    };
  }

  async findProductById(productId) {
    const query = `SELECT * FROM products WHERE deleted_at IS NULL AND id = ?;`;

    const [rows] = await execute(query, [productId]);

    return rows || null;
  }

  async findProducts(userId, searchType, value, limit, cursor, cursorId) {
    const params = [];
    let query = QUERY.FIND_ALL_PRODUCTS_QUERY;

    if (userId) {
      query += ` AND p.user_id = ?`;
      params.push(userId);
    } else {
      if (searchType === "tag") {
        query += ` JOIN product_tags pt ON pt.product_id = p.id
        JOIN tags t ON t.id = pt.tag_id
        WHERE t.name = ?`;
        params.push(value);
      } else {
        query += ` AND p.title LIKE ?`;
        params.push(`%${value}%`);
      }
    }

    if (cursor && cursorId) {
      query += ` ${QUERY.CURSOR_QUERY}`;

      params.push(cursor, cursor, cursorId);
    }

    query += ` ${QUERY.ORDER_BY_AND_LIMIT_QUERY}`;
    params.push(limit);

    const rows = await execute(query, params);

    return {
      products: rows,
      nextCursor: rows.length
        ? { cursor: rows[rows.length - 1].createdAt, cursorId: rows[rows.length - 1].productId }
        : null,
    };
  }

  async editProduct(productId, setClause, values, connection) {
    const query = `UPDATE products SET ${setClause} WHERE id = ?;`;

    const [rows] = await connection.query(query, [...values, productId]);

    return rows || null;
  }

  async deleteProduct(productId) {
    const query = "UPDATE products SET deleted_at = now() WHERE id = ?;";

    const rows = await execute(query, [productId]);

    return rows || null;
  }

  async editProductStatus(productId, status) {
    const query = "UPDATE products SET sale_status = ? WHERE id = ?;";

    const rows = await execute(query, [status, productId]);

    return rows || null;
  }

  async findTrendingProducts() {
    const query = `
      SELECT
        p.id,
        p.title,
        p.price,
        p.view_cnt AS viewCnt,
        p.created_at AS createdAt,
        (
          SELECT pi.image_url
          FROM product_images pi
          WHERE pi.product_id = p.id AND pi.is_thumbnail = 1
          ORDER BY pi.id ASC
          LIMIT 1
        ) AS imageUrl,
        COALESCE(lc.cnt, 0) AS likedCnt,
        (p.view_cnt + COALESCE(lc.cnt, 0) * ?) AS popularityScore
      FROM products p
      LEFT JOIN (
        SELECT product_id, COUNT(*) AS cnt
        FROM liked_product
        GROUP BY product_id
      ) AS lc ON p.id = lc.product_id
      WHERE p.sale_status = ?
        AND p.deleted_at IS NULL
        AND p.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY popularityScore DESC
      LIMIT ?
    `;

    const params = [
      TRENDING_CONFIG.LIKE_WEIGHT,
      PRODUCT_STATUS.ON_SALE,
      TRENDING_CONFIG.DAYS_LIMIT,
      TRENDING_CONFIG.RESULT_LIMIT,
    ];

    const rows = await execute(query, params);
    return rows || [];
  }
}

module.exports = ProductRepository;
