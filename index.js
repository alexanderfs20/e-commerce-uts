const Product = require('./product.model');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());



app.get('/', (req, res) => {
  res.send('API jalan');
});


// GET ALL
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json({ data: products });
});

// BUAT NAMBAHIN DATA
app.post('/products', async (req, res) => {
  const product = await Product.create(req.body);
  res.json({ data: product });
});

// SEARCH (HARUS DI ATAS)
app.get('/products/search', async (req, res) => {
  const { name } = req.query;

  const products = await Product.find({
    name: { $regex: name, $options: 'i' }
  });

  res.json({ data: products });
});

// GET BY ID
app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json({ data: product });
});

// UPDATE
app.put('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ data: product });
});

// DELETE
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    app.listen(3000, () => {
      console.log('http://localhost:3000');
    });

  } catch (err) {
    console.log(err);
  }
};

start();
