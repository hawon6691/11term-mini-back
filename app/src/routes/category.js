"use strict";

const express = require("express");

const CategoryController = require("./../categories/category.controller");
const CategoryService = require("./../categories/category.service");
const CategoryRepository = require("./../categories/category.repository");

const router = express.Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.get("/", categoryController.findCategories);

module.exports = router;
