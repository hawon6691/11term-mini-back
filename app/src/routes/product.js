"use strict";

const express = require("express");

const { createProductValidator } = require("../validators/product.validator");
const validate = require("../middleware/validate");
const { upload, MAX_IMAGE_COUNT } = require("../middleware/upload.middleware");

const ProductService = require("./../products/product.service");
const ProductController = require("./../products/product.controller");
const ProductRepository = require("./../products/product.repository");

const authGuard = require("./../auth/guard/auth.guard");

const router = express.Router();

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.post(
  "/",
  authGuard(),
  upload.array("images", MAX_IMAGE_COUNT),
  createProductValidator,
  validate,
  productController.create
);

module.exports = router;
