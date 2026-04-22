const express = require("express");

const productRoutes = require("./routes/productRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

module.exports = () => {
    const app = express.Router();

    productRoutes(app);
    sellerRoutes(app);
    reviewRoutes(app);
    cartRoutes(app);
    userRoutes(app);
    paymentRoutes(app);

    return app;
};