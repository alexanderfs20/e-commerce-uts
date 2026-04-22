const express = require('express');
const app = express();

require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());

// koneksi MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// TEST API
app.get('/', (req, res) => {
  res.send('API jalan');
});


// =======================
// SERVER
// =======================
app.listen(5000, () => {
  console.log('http://localhost:5000');
});