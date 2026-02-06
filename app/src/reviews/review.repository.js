"use strict";

const { execute } = require("../config/db");

class ReviewRepository {
  async createReview(reviewData, connection) {
    const query = `
    INSERT INTO reviews (user_id, seller_id, product_id, rating, content)
    VALUES (?, ?, ?, ?, ?)`;

    const [result] = await connection.query(query, [
      reviewData.userId,
      reviewData.sellerId,
      reviewData.productId,
      reviewData.rating,
      reviewData.content,
    ]);

    return result;
  }

  async createReviewTags(reviewId, tags, connection) {
    if (!tags || tags.length === 0) {
      return null;
    }

    const query = `
    INSERT INTO review_tags (review_id, tag_name)
    VALUES ?`;

    const values = tags.map((tag) => [reviewId, tag]);
    const [result] = await connection.query(query, [values]);

    return result;
  }

  async saveReviewImages(reviewId, imageUrls, connection) {
    if (!imageUrls || imageUrls.length === 0) {
      return null;
    }

    const query = `
      INSERT INTO review_images (review_id, image_url)
      VALUES ?
    `;

    const values = imageUrls.map((url) => [reviewId, url]);
    const [result] = await connection.query(query, [values]);

    return result;
  }

  async findExistingReview(userId, sellerId, productId) {
    const query = `
      SELECT id
      FROM reviews
      WHERE user_id = ? AND seller_id = ? AND product_id = ?
    `;

    const [rows] = await execute(query, [userId, sellerId, productId]);
    return rows || null;
  }

  async findReviewsBySellerId(sellerId, limit = 50) {
    const query = `
      SELECT
        r.id,
        r.user_id AS userId,
        r.rating,
        r.content,
        r.created_at AS createdAt,
        u.nickname AS userName
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.seller_id = ?
      ORDER BY r.created_at DESC
      LIMIT ?
    `;

    const rows = await execute(query, [sellerId, limit]);
    return rows || [];
  }

  async findReviewTags(reviewId) {
    const query = `
      SELECT tag_name AS tagName
      FROM review_tags
      WHERE review_id = ?
    `;

    const rows = await execute(query, [reviewId]);
    return rows || [];
  }

  async findReviewImages(reviewId) {
    const query = `
      SELECT image_url AS imageUrl
      FROM review_images
      WHERE review_id = ?
    `;

    const rows = await execute(query, [reviewId]);
    return rows || [];
  }

  async findReviewById(reviewId) {
    const query = `
      SELECT id, user_id AS userId, seller_id AS sellerId, product_id AS productId
      FROM reviews
      WHERE id = ?
    `;

    const [rows] = await execute(query, [reviewId]);
    return rows || null;
  }

  async deleteReview(reviewId, connection) {
    const query = `
      DELETE FROM reviews
      WHERE id = ?
    `;

    const [result] = await connection.query(query, [reviewId]);
    return result;
  }
}

module.exports = ReviewRepository;
