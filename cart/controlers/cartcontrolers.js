const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // validasi
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const qty = parseInt(quantity);

    // cek produk
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // cek item sudah ada
    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({
        productId,
        quantity: qty
      });
    }

    await cart.save();

    const result = await Cart.findOne({ userId })
      .populate("items.productId");

    res.json({
      message: "Berhasil tambah ke cart",
      data: result
    });

  } catch (err) {
    res.status(500).json({ message: "Error server" });
  }
};