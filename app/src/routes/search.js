"use strict";

const express = require("express");
const SearchController = require("../search/search.controller");
const SearchService = require("../search/search.service");
const SearchRepository = require("../search/search.repository");

const router = express.Router();

const searchRepository = new SearchRepository();
const searchService = new SearchService(searchRepository);
const searchController = new SearchController(searchService);

// 인기 검색어 조회 (비로그인 가능)
router.get("/popular", searchController.getPopularKeywords);

module.exports = router;
