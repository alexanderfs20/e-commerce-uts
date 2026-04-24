const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.patch("/update", cartController.updateCartItem);
router.post("/remove", cartController.removeItem);

module.exports = router;
