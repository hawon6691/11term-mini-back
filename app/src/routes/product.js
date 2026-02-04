"use strict";

const express = require("express");

const { createProductValidator } = require("../validators/product.validator");
const validate = require("../middleware/validate");
const { upload, MAX_IMAGE_COUNT } = require("../middleware/upload.middleware");
const authGuard = require("./../auth/guard/auth.guard");

const ProductController = require("./../products/product.controller");
const ProductService = require("./../products/product.service");
const ProductRepository = require("./../products/product.repository");

const TagService = require("./../tags/tag.service");
const TagRepository = require("./../tags/tag.repository");

const CategoryService = require("./../categories/category.service");
const CategoryRepository = require("./../categories/category.repository");

const ProductTagService = require("./../productTags/productTag.service");
const ProductTagRepository = require("./../productTags/productTag.repoitory");

const SearchRepository = require("./../search/search.repository");

const router = express.Router();

const tagRepository = new TagRepository();
const tagService = new TagService(tagRepository);

const productTagRepository = new ProductTagRepository();
const productTagService = new ProductTagService(productTagRepository);

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);

const searchRepository = new SearchRepository();

const productRepository = new ProductRepository();
const productService = new ProductService(
  productRepository,
  tagService,
  productTagService,
  categoryService,
  searchRepository
);
const productController = new ProductController(productService);

router.post(
  "/",
  authGuard(),
  upload.array("images", MAX_IMAGE_COUNT),
  createProductValidator,
  validate,
  productController.create
);
router.get("/", productController.findProducts);
router.get("/:id", productController.findProductById);

module.exports = router;
