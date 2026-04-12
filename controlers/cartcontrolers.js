const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  cart.items.push({ productId, quantity });
  await cart.save();

  res.json(cart);
};