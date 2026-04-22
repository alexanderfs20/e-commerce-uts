const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

router.post("/register", userController.register);
router.get("/verify-email", userController.verifyEmail);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
router.get("/profile", authenticate, userController.getProfile);

module.exports = router;
