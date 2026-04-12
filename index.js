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


// =======================
// SCHEMA
// =======================

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});
const Product = mongoose.model('Product', productSchema);

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      quantity: Number
    }
  ]
});
const Cart = mongoose.model('Cart', cartSchema);


// =======================
// ROUTES
// =======================

// TEST API
app.get('/', (req, res) => {
  res.send('API jalan');
});


// ===== PRODUCT =====

// GET semua produk
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil produk' });
  }
});

// TAMBAH produk
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.json({
      message: 'Produk ditambahkan',
      data: product
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal tambah produk' });
  }
});


// ===== CART =====

// tambah ke cart
app.post('/cart/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: []
      });
    }

    cart.items.push({ productId, quantity });
    await cart.save();

    res.json({
      message: 'Item masuk ke cart',
      data: cart
    });

  } catch (err) {
    res.status(500).json({ message: 'Gagal tambah ke cart' });
  }
});

// lihat cart
app.get('/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil cart' });
  }
});


// =======================
// ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Terjadi error" });
});


// =======================
// SERVER
// =======================
app.listen(5000, () => {
  console.log('http://localhost:5000');
});