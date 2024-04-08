// Dependencies
const express = require("express");
const router = express.Router();

// Controller
const SearchController = require("../controllers/search");

router.get("/search", SearchController.search);

module.exports = router;
