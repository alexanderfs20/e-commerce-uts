import express from "express";
import {
  addToCart,
  getCart,
  removeItem
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/", getCart);
router.delete("/remove", removeItem);

export default router;