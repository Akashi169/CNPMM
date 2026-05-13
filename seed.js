const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/product.model');
const Category = require('./src/models/category.model');

const sampleCategories = [
  { name: 'Giày Chạy Bộ', description: 'Giày chuyên dụng cho chạy bộ với đệm êm ái.' },
  { name: 'Giày Bóng Rổ', description: 'Giày hỗ trợ cổ chân và bật nhảy cao.' },
  { name: 'Giày Thời Trang', description: 'Phong cách và dễ phối đồ hằng ngày.' },
];

const sampleProducts = [
  {
    name: 'Nike Air Max 270 React',
    description: 'Kết hợp công nghệ Air Max với lớp đệm React cực kỳ êm ái. Thích hợp cho cả tập luyện thể thao lẫn đi chơi hàng ngày.',
    originalPrice: 3500000,
    salePrice: 2800000,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 15,
    soldQuantity: 120,
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Dòng giày chạy bộ huyền thoại với công nghệ Boost hoàn trả năng lượng tuyệt vời.',
    originalPrice: 4200000,
    salePrice: 3800000,
    images: ['https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 20,
    soldQuantity: 85,
    isNewProduct: true,
    isBestSeller: false,
  },
  {
    name: 'Jordan 1 Retro High OG',
    description: 'Biểu tượng của văn hóa Sneaker thế giới. Phối màu Chicago cổ điển.',
    originalPrice: 6500000,
    salePrice: 6500000,
    images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 5,
    soldQuantity: 300,
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Puma Cali Star',
    description: 'Đôi giày thời trang tối giản nhưng đầy tinh tế dành cho mọi dịp.',
    originalPrice: 2200000,
    salePrice: 1500000,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 50,
    soldQuantity: 45,
    isNewProduct: true,
    isBestSeller: false,
  },
  {
    name: 'Nike Zoom Fly 5',
    description: 'Giày chạy bộ chuyên dụng giúp bạn bứt phá tốc độ trên mọi cung đường.',
    originalPrice: 3800000,
    salePrice: 2900000,
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 12,
    soldQuantity: 60,
    isNewProduct: true,
    isBestSeller: false,
  },
  {
    name: 'Converse Chuck Taylor 70s',
    description: 'Mẫu giày canvas vượt thời gian, bền bỉ và cá tính.',
    originalPrice: 1800000,
    salePrice: 1600000,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 100,
    soldQuantity: 500,
    isNewProduct: false,
    isBestSeller: true,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('Connected to MongoDB for seeding...');

    // Xóa dữ liệu cũ
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data.');

    // Tạo Category
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log('Created Categories:', createdCategories.length);

    // Tạo Product và gán ngẫu nhiên Category
    const productsToInsert = sampleProducts.map((p, index) => ({
      ...p,
      category: createdCategories[index % createdCategories.length]._id,
    }));

    await Product.insertMany(productsToInsert);
    console.log('Created Products:', productsToInsert.length);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
