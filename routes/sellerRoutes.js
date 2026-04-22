const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

router.get("/:sellerId/catalog", productController.getSellerCatalog);
router.get("/:sellerId/stock", productController.getSellerStockSummary);

module.exports = router;
