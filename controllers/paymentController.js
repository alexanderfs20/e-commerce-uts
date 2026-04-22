const Payment = require("../models/payment");

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);

    res.status(201).json({
      message: "Pembayaran berhasil dibuat",
      data: payment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const filter = {};

    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const payments = await Payment.find(filter).sort({ createdAt: -1 });

    res.json({
      message: "Daftar pembayaran berhasil diambil",
      total: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    res.json({
      message: "Detail pembayaran berhasil diambil",
      data: payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    res.json({
      message: "Pembayaran berhasil diperbarui",
      data: payment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    res.json({
      message: "Pembayaran berhasil dihapus",
      data: payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
