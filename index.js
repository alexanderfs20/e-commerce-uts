
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const route = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

let dbStatus = "disconnected";

// middleware
app.use(cors());
app.use(express.json());
app.use("/api", route);

// route test
app.get("/", (req, res) => {
  res.send("API jalan 🚀");
});

const connectDatabase = async () => {
  try {
    dbStatus = "connecting";
    console.log("Mencoba koneksi ke MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // biar ga lama nunggu
    });

    dbStatus = "connected";
    console.log("MongoDB connected");

    // 🔥 WAJIB: start server di sini
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });

  } catch (error) {
    dbStatus = "disconnected";
    console.error("Koneksi MongoDB gagal:", error.message);
  }
};

// 🔥 WAJIB BANGET: panggil function
connectDatabase();
