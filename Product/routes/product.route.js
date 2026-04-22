const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');

// GET ALL
router.get('/', productController.getAllProducts);

// CREATE
router.post('/', productController.createProduct);

// SEARCH
router.get('/search', productController.searchProducts);

// GET BY ID
router.get('/:id', productController.getProductById);

// UPDATE
router.put('/:id', productController.updateProduct);

// DELETE
router.delete('/:id', productController.deleteProduct);

module.exports = router;