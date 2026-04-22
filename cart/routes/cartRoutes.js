const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");

// =======================
// CART ROUTES
// =======================

// ➕ Tambah ke cart
router.post("/add", cartController.addToCart);

// 📥 Ambil cart berdasarkan userId
router.get("/:userId", cartController.getCart);

// 🔄 Update quantity item di cart
router.put("/update", cartController.updateCart);

// ❌ Hapus item dari cart
router.delete("/remove", cartController.removeItem);

module.exports = router;