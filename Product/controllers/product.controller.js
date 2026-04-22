const Product = require('../models/product.model');

// GET ALL
exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json({ data: products });
};

// CREATE
exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.json({ data: product });
};

// SEARCH
exports.searchProducts = async (req, res) => {
  const { name } = req.query;

  const products = await Product.find({
    name: { $regex: name, $options: 'i' }
  });

  res.json({ data: products });
};

// GET BY ID
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json({ data: product });
};

// UPDATE
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ data: product });
};

// DELETE
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};