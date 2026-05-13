import React, { useState, useEffect, useCallback } from 'react';
import ProductFilter from '../components/product/ProductFilter';
import ProductCard from '../components/product/ProductCard';
import { getProducts } from '../services/product.service';
import { AppstoreOutlined, SortAscendingOutlined, LoadingOutlined } from '@ant-design/icons';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
    page: 1,
    limit: 12
  });

  // Tách hàm fetch ra để dùng chung
  const fetchProductsData = useCallback(async (currentFilters) => {
    setIsLoading(true);
    try {
      const response = await getProducts(currentFilters);
      setProducts(response.data || []);
      if (response.meta) {
        setTotalPages(response.meta.totalPages);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect xử lý Search (có Debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProductsData(filters);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.minPrice, filters.maxPrice, fetchProductsData]);

  // Effect xử lý Category, Sort, Page (không Debounce - phản hồi ngay)
  useEffect(() => {
    fetchProductsData(filters);
  }, [filters.category, filters.sort, filters.page, fetchProductsData]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setFilters(prev => ({ ...prev, sort: newSort, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Cửa Hàng</h1>
          <p className="text-gray-500 font-medium">Khám phá bộ sưu tập Sneaker phong cách nhất của chúng tôi.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cột trái: Sidebar Filter */}
          <aside className="w-full lg:w-1/4">
            <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          {/* Cột phải: Content */}
          <main className="w-full lg:w-3/4">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center">
                  <AppstoreOutlined />
                </div>
                <div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Trang</p>
                   <p className="text-sm font-bold text-gray-900">{filters.page} / {totalPages}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <SortAscendingOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <select 
                    className="w-full sm:w-64 pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer transition-all"
                    value={filters.sort}
                    onChange={handleSortChange}
                  >
                    <option value="newest">Mới nhất đầu tiên</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao xuống Thấp</option>
                    <option value="best_seller">Bán chạy nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 bg-white rounded-[3rem] border border-gray-100">
                <LoadingOutlined className="text-4xl text-primary-600 mb-4" spin />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Đang tải sản phẩm...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <AppstoreOutlined className="text-3xl text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500 mb-8">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                <button 
                  onClick={() => setFilters({ ...filters, search: '', category: '', minPrice: '', maxPrice: '' })}
                  className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Modern Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3">
                    <button 
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 hover:border-primary-600 hover:text-primary-600 disabled:opacity-30 disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-all"
                    >
                      ←
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-12 h-12 rounded-2xl font-bold transition-all ${
                          filters.page === i + 1 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === totalPages}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 hover:border-primary-600 hover:text-primary-600 disabled:opacity-30 disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-all"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
