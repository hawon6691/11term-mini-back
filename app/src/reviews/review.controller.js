"use strict";

class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  createReview = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { sellerId, rating, content, tags, productId } = req.body;
      const files = req.files || [];

      let parsedTags = [];
      if (tags) {
        try {
          parsedTags = JSON.parse(tags);
        } catch (error) {
          const CustomError = require("../utils/customError");
          throw new CustomError("태그 형식이 올바르지 않습니다.", 400);
        }
      }

      const reviewId = await this.reviewService.createReview({
        userId,
        sellerId: Number(sellerId),
        productId: Number(productId),
        rating: Number(rating),
        content,
        tags: parsedTags,
        files,
      });

      res.status(201).json({
        message: "후기가 작성되었습니다.",
        reviewId,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getSellerReviews = async (req, res, next) => {
    try {
      const sellerId = Number(req.query.sellerId);
      const limit = Number(req.query.limit) || 50;

      const reviews = await this.reviewService.getSellerReviews(sellerId, limit);

      res.status(200).json({
        data: reviews,
        totalCnt: reviews.length,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  updateReview = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const reviewId = Number(req.params.reviewId);
      const { rating, content, tags } = req.body;
      const files = req.files || [];

      let parsedTags = [];
      if (tags) {
        try {
          parsedTags = JSON.parse(tags);
        } catch (error) {
          const CustomError = require("../utils/customError");
          throw new CustomError("태그 형식이 올바르지 않습니다.", 400);
        }
      }

      await this.reviewService.updateReview(userId, reviewId, {
        rating: Number(rating),
        content,
        tags: parsedTags,
        files,
      });

      res.status(200).json({
        message: "후기가 수정되었습니다.",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  deleteReview = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const reviewId = Number(req.params.reviewId);

      await this.reviewService.deleteReview(userId, reviewId);

      res.status(200).json({
        message: "후기가 삭제되었습니다.",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}

module.exports = ReviewController;
