const Product = require('../models/product.model');
const Category = require('../models/category.model'); // Cần import để mongoose đăng ký model cho việc populate

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  console.log('>>> GET /api/products called with query:', req.query);
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // 1. Khởi tạo query object rỗng
    let query = {};

    // 2. Tìm kiếm theo tên (sử dụng Regex để tìm kiếm một phần, không phân biệt hoa thường)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // 3. Lọc theo danh mục
    if (category) {
      query.category = category;
    }

    // 4. Lọc theo khoảng giá (áp dụng trên giá bán salePrice)
    if (minPrice || maxPrice) {
      query.salePrice = {};
      if (minPrice && minPrice !== '') query.salePrice.$gte = Number(minPrice);
      if (maxPrice && maxPrice !== '') query.salePrice.$lte = Number(maxPrice);
      
      // Nếu sau khi kiểm tra mà object rỗng (ví dụ cả 2 đều là ''), thì xóa luôn field salePrice
      if (Object.keys(query.salePrice).length === 0) {
        delete query.salePrice;
      }
    }

    // 5. Cấu hình Sắp xếp (Sorting)
    let sortConfig = {};
    if (sort === 'price_asc') {
      sortConfig = { salePrice: 1, _id: 1 };
    } else if (sort === 'price_desc') {
      sortConfig = { salePrice: -1, _id: 1 };
    } else if (sort === 'best_seller') {
      sortConfig = { soldQuantity: -1, _id: 1 };
    } else {
      // Mặc định hoặc 'newest'
      sortConfig = { createdAt: -1, _id: 1 };
    }

    // 6. Cấu hình Phân trang (Pagination)
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    const skip = (pageNumber - 1) * limitNumber;

    // 7. Thực thi truy vấn Database song song (lấy data & đếm tổng số)
    const [products, totalItems] = await Promise.all([
      Product.find(query)
        .populate('category', 'name') // Lấy thêm tên danh mục nếu cần
        .sort(sortConfig)
        .skip(skip)
        .limit(limitNumber),
      Product.countDocuments(query),
    ]);

    // 8. Tính toán tổng số trang
    const totalPages = Math.ceil(totalItems / limitNumber);

    // 9. Trả về Response
    res.status(200).json({
      status: 'success',
      message: 'Lấy danh sách sản phẩm thành công',
      data: products,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi lấy danh sách sản phẩm',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        details: error.message,
      },
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  console.log('>>> GET /api/products/:id called with ID:', req.params.id);
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi lấy chi tiết sản phẩm',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        details: error.message,
      },
    });
  }
};

/**
 * @desc    Get top 10 best selling products
 * @route   GET /api/products/best-sellers
 * @access  Public
 */
const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ soldQuantity: -1 })
      .limit(10);
    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Lỗi server' });
  }
};

/**
 * @desc    Get top 10 most viewed products
 * @route   GET /api/products/most-viewed
 * @access  Public
 */
const getMostViewed = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ views: -1 })
      .limit(10);
    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Lỗi server' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getBestSellers,
  getMostViewed,
};
