"use strict";

const express = require("express");

const ReviewController = require("../reviews/review.controller");
const ReviewService = require("../reviews/review.service");
const ReviewRepository = require("../reviews/review.repository");

const UserRepository = require("../users/user.repository");
const ProductRepository = require("../products/product.repository");

const {
  createReviewValidator,
  getSellerReviewsValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../validators/review.validator");
const validate = require("../middleware/validate");
const { upload, MAX_IMAGE_COUNT } = require("../middleware/upload.middleware");
const authGuard = require("../auth/guard/auth.guard");

const router = express.Router();

const reviewRepository = new ReviewRepository();
const userRepository = new UserRepository();
const productRepository = new ProductRepository();

const reviewService = new ReviewService(reviewRepository, userRepository, productRepository);
const reviewController = new ReviewController(reviewService);

router.get("/", getSellerReviewsValidator, validate, reviewController.getSellerReviews);

router.post(
  "/",
  authGuard(),
  upload.array("images", 3),
  createReviewValidator,
  validate,
  reviewController.createReview
);

router.patch(
  "/",
  authGuard(),
  upload.array("images", 3),
  updateReviewValidator,
  validate,
  reviewController.updateReview
);

router.delete("/", authGuard(), deleteReviewValidator, validate, reviewController.deleteReview);

module.exports = router;
