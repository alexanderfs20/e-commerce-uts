const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const port = Number(process.env.PORT) || 3000;
let dbStatus = "disconnected";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API e-commerce aktif",
    database: dbStatus,
    endpoints: {
      auth: "/api/users",
      products: "/api/products",
      seller: "/api/seller",
      reviews: "/api",
      cart: "/api/cart",
      payments: "/api/payments"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: dbStatus
  });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan"
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Terjadi kesalahan pada server"
  });
});

const connectDatabase = async () => {
  try {
    dbStatus = "connecting";
    console.log("Mencoba koneksi ke MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
    dbStatus = "connected";
    console.log("MongoDB connected");
  } catch (error) {
    dbStatus = "disconnected";
    console.error("Koneksi MongoDB gagal:", error.message);
  }
};

const startServer = async () => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });

  await connectDatabase();
};

startServer();
