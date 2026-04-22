const Cart = require("../models/cart");
const Product = require("../models/product");

const resolveUserId = req => {
  return req.user?.id || req.body.userId || req.query.userId;
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = resolveUserId(req);

    if (!userId) {
      return res.status(400).json({ message: "userId wajib diisi" });
    }

    if (!productId) {
      return res.status(400).json({ message: "productId wajib diisi" });
    }

    const parsedQuantity = Number(quantity);
    if (parsedQuantity <= 0) {
      return res.status(400).json({ message: "quantity harus lebih dari 0" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    if (product.stock < parsedQuantity) {
      return res.status(400).json({ message: "Stok produk tidak mencukupi" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: parsedQuantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex >= 0) {
        const newQuantity = cart.items[itemIndex].quantity + parsedQuantity;
        if (product.stock < newQuantity) {
          return res.status(400).json({ message: "Jumlah melebihi stok produk" });
        }

        cart.items[itemIndex].quantity = newQuantity;
      } else {
        cart.items.push({ product: productId, quantity: parsedQuantity });
      }

      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json({
      message: "Produk berhasil ditambahkan ke keranjang",
      data: populatedCart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = resolveUserId(req);

    if (!userId) {
      return res.status(400).json({ message: "userId wajib diisi" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    res.json({
      message: "Keranjang berhasil diambil",
      data: cart || { user: userId, items: [] }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = resolveUserId(req);

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId dan productId wajib diisi" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Keranjang tidak ditemukan" });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json({
      message: "Produk berhasil dihapus dari keranjang",
      data: populatedCart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = resolveUserId(req);

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        message: "userId, productId, dan quantity wajib diisi"
      });
    }

    const parsedQuantity = Number(quantity);
    if (parsedQuantity <= 0) {
      return res.status(400).json({ message: "quantity harus lebih dari 0" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    if (product.stock < parsedQuantity) {
      return res.status(400).json({ message: "Stok produk tidak mencukupi" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Keranjang tidak ditemukan" });
    }

    const item = cart.items.find(
      currentItem => currentItem.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Produk tidak ada di keranjang" });
    }

    item.quantity = parsedQuantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    res.json({
      message: "Jumlah produk di keranjang berhasil diperbarui",
      data: populatedCart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
