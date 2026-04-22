const Product = require("../models/product");

const buildSearchFilter = ({ name, category, sellerId, minPrice, maxPrice }) => {
  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  if (sellerId) {
    filter.sellerId = sellerId;
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  return filter;
};

exports.getAllProducts = async (req, res) => {
  try {
    const filter = buildSearchFilter(req.query);
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      message: "Daftar produk berhasil diambil",
      total: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Produk berhasil ditambahkan",
      data: product
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const filter = buildSearchFilter(req.query);
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      message: "Hasil pencarian produk",
      total: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({
      message: "Detail produk berhasil diambil",
      data: product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({
      message: "Produk berhasil diperbarui",
      data: product
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    res.json({
      message: "Produk berhasil dihapus",
      data: product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerCatalog = async (req, res) => {
  try {
    const sellerId = req.params.sellerId || req.query.sellerId;

    if (!sellerId) {
      return res.status(400).json({ message: "sellerId wajib diisi" });
    }

    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const totalValue = products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    );

    res.json({
      message: "Katalog seller berhasil diambil",
      sellerId,
      summary: {
        totalProducts: products.length,
        totalStock,
        totalInventoryValue: totalValue
      },
      data: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSellerStockSummary = async (req, res) => {
  try {
    const sellerId = req.params.sellerId || req.query.sellerId;

    if (!sellerId) {
      return res.status(400).json({ message: "sellerId wajib diisi" });
    }

    const products = await Product.find({ sellerId }).sort({ stock: 1, name: 1 });
    const lowStockItems = products.filter(product => product.stock <= 5);
    const outOfStockItems = products.filter(product => product.stock === 0);

    res.json({
      message: "Ringkasan stok seller berhasil diambil",
      sellerId,
      summary: {
        totalProducts: products.length,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length
      },
      data: products,
      lowStockItems,
      outOfStockItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
