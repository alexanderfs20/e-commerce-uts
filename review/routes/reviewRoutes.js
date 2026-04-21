const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviewController");

// Endpoint review
router.get("/reviews", ReviewController.getAllReviews);
router.post("/reviews", ReviewController.createReview);
router.get("/reviews/:id", ReviewController.getReviewById);
router.get("/products/:productId/reviews", ReviewController.getReviewsByProduct);
router.put("/reviews/:id", ReviewController.updateReview);
router.delete("/reviews/:id", ReviewController.deleteReview);

module.exports = router;
