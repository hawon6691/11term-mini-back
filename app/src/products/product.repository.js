"use strict";

const CustomError = require("../utils/customError");
const { execute } = require("./../config/db");

const QUERY = {
  FIND_ALL_PRODUCTS_QUERY: `SELECT p.id AS product_id, p.title, p.price, p.created_at, i.image_url
    FROM products p LEFT JOIN product_images i ON i.product_id = p.id AND i.is_thumbnail = 1`,
  CURSOR_QUERY: "AND (p.created_at < ? OR (p.created_at = ? AND p.id < ?))",
  ORDER_BY_AND_LIMIT_QUERY: "order by p.created_at DESC, p.id DESC LIMIT ?",
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

  async saveProductImage(images, connection) {
    const query = "INSERT INTO product_images(product_id, image_url, is_thumbnail) VALUES ?;";

    const values = images.map((img, index) => [img.productId, img.imageUrl, index === 0]);

    const [rows] = await connection.query(query, [values]);

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
    const query = `SELECT * FROM products WHERE id = ?;`;

    const [rows] = await execute(query, [productId]);

    return rows || null;
  }

  async findProducts(userId, searchType, value, limit, cursor, cursorId) {
    const params = [];
    let query = QUERY.FIND_ALL_PRODUCTS_QUERY;

    if (userId) {
      query += ` WHERE p.user_id = ?`;
      params.push(userId);
    } else {
      if (searchType === "tag") {
        query += ` JOIN product_tags pt ON pt.product_id = p.id
        JOIN tags t ON t.id = pt.tag_id
        WHERE t.name = ?`;
        params.push(value);
      } else {
        query += ` WHERE p.title LIKE ?`;
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
}

module.exports = ProductRepository;
