const Review = require("../models/review");

exports.createReview = async (req, res) => {
  try {
    const { productId, userId, userName, rating, comment } = req.body;

    if (!productId || !userId || !rating || !comment) {
      return res.status(400).json({
        message: "productId, userId, rating, dan comment wajib diisi"
      });
    }

    const review = await Review.create({
      productId,
      userId,
      userName,
      rating,
      comment
    });

    res.status(201).json({
      message: "Review berhasil ditambahkan",
      data: review
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Gagal menambahkan review"
    });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json({
      message: "Daftar semua review",
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Gagal mengambil review"
    });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId
    }).sort({ createdAt: -1 });

    const totalReview = reviews.length;
    const averageRating =
      totalReview === 0
        ? 0
        : Number(
            (
              reviews.reduce((total, review) => total + review.rating, 0) /
              totalReview
            ).toFixed(1)
          );

    res.json({
      message: "Daftar review produk",
      data: reviews,
      meta: {
        productId: req.params.productId,
        totalReview,
        averageRating
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Gagal mengambil review produk"
    });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review tidak ditemukan"
      });
    }

    res.json({
      message: "Detail review",
      data: review
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Gagal mengambil detail review"
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        rating,
        comment,
        userName
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!review) {
      return res.status(404).json({
        message: "Review tidak ditemukan"
      });
    }

    res.json({
      message: "Review berhasil diupdate",
      data: review
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Gagal mengupdate review"
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review tidak ditemukan"
      });
    }

    res.json({
      message: "Review berhasil dihapus",
      data: review
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Gagal menghapus review"
    });
  }
};
