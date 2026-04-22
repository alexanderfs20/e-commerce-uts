const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const reviewRoutes = require("./review/route/reviewRoutes");

app.use(cors());
app.use(express.json());
app.use("/", reviewRoutes);

app.get('/', (req, res) => {
  res.send('API jalan');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Terjadi error" });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
