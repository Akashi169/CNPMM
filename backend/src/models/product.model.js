const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true,
      index: true, // Đánh index để search tên nhanh hơn
    },
    description: {
      type: String,
      required: [true, 'Mô tả sản phẩm là bắt buộc'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Giá gốc là bắt buộc'],
      min: [0, 'Giá không thể âm'],
    },
    salePrice: {
      type: Number,
      default: function () {
        return this.originalPrice; // Mặc định giá bán bằng giá gốc nếu không nhập
      },
      min: [0, 'Giá bán không thể âm'],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Tham chiếu đến model Category (nếu có)
      required: [true, 'Danh mục là bắt buộc'],
      index: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Số lượng tồn kho là bắt buộc'],
      min: [0, 'Số lượng không thể âm'],
      default: 0,
    },
    soldQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    isNewProduct: {
      type: Boolean,
      default: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo text index cho trường name để phục vụ full-text search
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
