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
    salePrice: 2800000, // Khuyến mãi
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 15,
    soldQuantity: 120, // Bán chạy
    views: 800, // Xem nhiều
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
    views: 950, // Xem nhiều
    isNewProduct: true, // Mới nhất
    isBestSeller: false,
  },
  {
    name: 'Jordan 1 Retro High OG',
    description: 'Biểu tượng của văn hóa Sneaker thế giới. Phối màu Chicago cổ điển.',
    originalPrice: 6500000,
    salePrice: 6500000,
    images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 5,
    soldQuantity: 300, // Bán chạy
    views: 1200, // Xem nhiều nhất
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Puma Cali Star',
    description: 'Đôi giày thời trang tối giản nhưng đầy tinh tế dành cho mọi dịp.',
    originalPrice: 2200000,
    salePrice: 1500000, // Khuyến mãi cực sâu
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 50,
    soldQuantity: 45,
    views: 320,
    isNewProduct: true, // Mới nhất
    isBestSeller: false,
  },
  {
    name: 'Nike Zoom Fly 5',
    description: 'Giày chạy bộ chuyên dụng giúp bạn bứt phá tốc độ trên mọi cung đường.',
    originalPrice: 3800000,
    salePrice: 2900000, // Khuyến mãi
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 12,
    soldQuantity: 60,
    views: 450,
    isNewProduct: true, // Mới nhất
    isBestSeller: false,
  },
  {
    name: 'Converse Chuck Taylor 70s',
    description: 'Mẫu giày canvas vượt thời gian, bền bỉ và cá tính.',
    originalPrice: 1800000,
    salePrice: 1600000,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 100,
    soldQuantity: 500, // Bán chạy nhất
    views: 1500, // Xem nhiều nhất
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'New Balance 550 White Green',
    description: 'Mẫu giày bóng rổ thập niên 80 đang làm mưa làm gió trong cộng đồng thời trang.',
    originalPrice: 3200000,
    salePrice: 3200000,
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 30,
    soldQuantity: 210, // Bán chạy
    views: 1100, // Xem nhiều
    isNewProduct: true, // Mới nhất
    isBestSeller: true,
  },
  {
    name: 'Vans Old Skool Classic',
    description: 'Đôi giày trượt ván huyền thoại chưa bao giờ lỗi thời.',
    originalPrice: 1500000,
    salePrice: 1200000, // Khuyến mãi
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 80,
    soldQuantity: 420, // Bán chạy
    views: 980, // Xem nhiều
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Asics Gel-Kayano 29',
    description: 'Sự hỗ trợ tuyệt đối cho những bước chạy dài với công nghệ Gel tối tân.',
    originalPrice: 4500000,
    salePrice: 3900000, // Khuyến mãi
    images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 25,
    soldQuantity: 90,
    views: 520,
    isNewProduct: true, // Mới nhất
    isBestSeller: false,
  },
  {
    name: 'Nike Air Force 1 07',
    description: 'Huyền thoại đường phố với màu trắng tinh khôi không thể thiếu trong tủ đồ.',
    originalPrice: 2600000,
    salePrice: 2600000,
    images: ['https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 60,
    soldQuantity: 600, // Bán chạy cực khủng
    views: 2000, // Xem nhiều nhất
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Yeezy Boost 350 V2 Zebra',
    description: 'Thiết kế độc đáo từ Kanye West kết hợp cùng đệm Boost đỉnh cao.',
    originalPrice: 7500000,
    salePrice: 6800000, // Khuyến mãi
    images: ['https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 8,
    soldQuantity: 150, // Bán chạy
    views: 1800, // Xem nhiều
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Reebok Club C 85 Vintage',
    description: 'Phong cách retro tennis thập niên 80 đang trở lại mạnh mẽ.',
    originalPrice: 2100000,
    salePrice: 1800000, // Khuyến mãi
    images: ['https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 40,
    soldQuantity: 110, // Bán chạy
    views: 650,
    isNewProduct: true, // Mới nhất
    isBestSeller: false,
  },
  {
    name: 'Puma RS-X3 Puzzle',
    description: 'Thiết kế chunky sneaker đậm chất tương lai, với những mảng màu cực chất.',
    originalPrice: 2500000,
    salePrice: 1950000,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 35,
    soldQuantity: 80,
    views: 400,
    isNewProduct: true,
    isBestSeller: false,
  },
  {
    name: 'Nike Dunk Low Panda',
    description: 'Phối màu đen trắng quốc dân, dễ dàng mix&match với mọi trang phục.',
    originalPrice: 3200000,
    salePrice: 3200000,
    images: ['https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 200,
    soldQuantity: 950,
    views: 3500,
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Biti\'s Hunter Street Black Line',
    description: 'Tinh thần đường phố Việt Nam, bền bỉ và cực kỳ êm ái.',
    originalPrice: 899000,
    salePrice: 899000,
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 150,
    soldQuantity: 1200,
    views: 1800,
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Adidas Stan Smith Primegreen',
    description: 'Bảo vệ môi trường với chất liệu tái chế nhưng vẫn giữ nguyên vẻ đẹp cổ điển.',
    originalPrice: 2400000,
    salePrice: 2100000,
    images: ['https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 45,
    soldQuantity: 410,
    views: 950,
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Converse Run Star Hike',
    description: 'Đế chunky hầm hố, phá cách táo bạo từ phiên bản Chuck Taylor truyền thống.',
    originalPrice: 2800000,
    salePrice: 2500000,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 30,
    soldQuantity: 250,
    views: 1120,
    isNewProduct: true,
    isBestSeller: false,
  },
  {
    name: 'Vans Slip-On Checkerboard',
    description: 'Họa tiết caro đen trắng không dây tiện lợi, mang là đi.',
    originalPrice: 1400000,
    salePrice: 1400000,
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 120,
    soldQuantity: 670,
    views: 1600,
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Nike Blazer Mid 77 Vintage',
    description: 'Phong cách bóng rổ cổ điển với dấu Swoosh nổi bật.',
    originalPrice: 2600000,
    salePrice: 2200000,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 65,
    soldQuantity: 320,
    views: 890,
    isNewProduct: false,
    isBestSeller: false,
  },
  {
    name: 'Adidas NMD R1',
    description: 'Đệm Boost êm ái kết hợp thiết kế dành riêng cho những chuyến thám hiểm thành phố.',
    originalPrice: 3500000,
    salePrice: 2900000,
    images: ['https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 25,
    soldQuantity: 180,
    views: 740,
    isNewProduct: true,
    isBestSeller: false,
  },
  {
    name: 'New Balance 990v5 Core',
    description: 'Đẳng cấp dad-shoes, hoàn thiện thủ công tại Mỹ với chất lượng vượt trội.',
    originalPrice: 4800000,
    salePrice: 4800000,
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 10,
    soldQuantity: 95,
    views: 1300,
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Fila Disruptor II',
    description: 'Biểu tượng của trào lưu chunky sneaker, cá tính và cực kỳ tôn dáng.',
    originalPrice: 1800000,
    salePrice: 1200000,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 85,
    soldQuantity: 500,
    views: 990,
    isNewProduct: false,
    isBestSeller: true,
  },
  {
    name: 'Mizuno Wave Rider 26',
    description: 'Giày chạy bộ chuyên nghiệp từ Nhật Bản, đệm Wave hỗ trợ lực đẩy mạnh mẽ.',
    originalPrice: 3600000,
    salePrice: 3100000,
    images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 18,
    soldQuantity: 140,
    views: 450,
    isNewProduct: true,
    isBestSeller: false,
  },
  {
    name: 'Nike Pegasus 40',
    description: 'Dòng giày chạy bền bỉ nhất của Nike, phiên bản thứ 40 kỉ niệm sự nâng cấp vượt bậc.',
    originalPrice: 3800000,
    salePrice: 3800000,
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 50,
    soldQuantity: 720,
    views: 2200,
    isNewProduct: true,
    isBestSeller: true,
  },
  {
    name: 'Salomon XT-6',
    description: 'Từ đường mòn lên đường phố, thiết kế gorpcore đỉnh cao.',
    originalPrice: 5200000,
    salePrice: 4800000,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 12,
    soldQuantity: 210,
    views: 1950,
    isNewProduct: true,
    isBestSeller: true,
  },
  {
    name: 'Saucony Endorphin Speed 3',
    description: 'Đệm bọt PWRRUN PB siêu nhẹ kết hợp tấm nylon linh hoạt.',
    originalPrice: 4200000,
    salePrice: 3500000,
    images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800'],
    stockQuantity: 22,
    soldQuantity: 110,
    views: 600,
    isNewProduct: false,
    isBestSeller: false,
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
