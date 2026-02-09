"use strict";

const express = require("express");
const SearchController = require("../search/search.controller");
const SearchService = require("../search/search.service");
const SearchRepository = require("../search/search.repository");

const { saveSearchLogValidator } = require("../validators/search.validator");
const validate = require("../middleware/validate");

const router = express.Router();

const searchRepository = new SearchRepository();
const searchService = new SearchService(searchRepository);
const searchController = new SearchController(searchService);

router.get("/popular", searchController.getPopularKeywords);
router.post("/log", saveSearchLogValidator, validate, searchController.saveSearchLog);

module.exports = router;
