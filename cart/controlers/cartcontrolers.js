import Cart from "../models/Cart.js";
import Product from "../../models/Product.js"; // sesuaikan path

// ➕ ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id || "dummyUser"; // sementara kalau belum ada auth

    // cek produk ada atau tidak
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const index = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();

    res.json({
      message: "Produk berhasil ditambahkan ke cart",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 GET CART
export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || "dummyUser";

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product"); // 🔥 ini ambil data produk

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ REMOVE ITEM
export const removeItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id || "dummyUser";

    const cart = await Cart.findOne({ user: userId });

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};