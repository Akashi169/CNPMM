const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Route lấy danh sách sản phẩm (có hỗ trợ filter, sort, pagination qua query params)
router.get('/', productController.getProducts);

// Route lấy chi tiết 1 sản phẩm
router.get('/:id', productController.getProductById);

module.exports = router;
