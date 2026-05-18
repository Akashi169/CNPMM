import React, { useState, useEffect, useCallback } from 'react';
import ProductFilter from '../components/product/ProductFilter';
import ProductCard from '../components/product/ProductCard';
import { getProducts } from '../services/product.service';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { AppstoreOutlined, SortAscendingOutlined, LoadingOutlined } from '@ant-design/icons';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
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
  const fetchProductsData = useCallback(async (currentFilters, isLoadMore = false) => {
    setIsLoading(true);
    try {
      const response = await getProducts(currentFilters);
      if (isLoadMore) {
        setProducts(prev => {
          // Tránh duplicate nếu fetch trùng
          const newProducts = response.data || [];
          const existingIds = new Set(prev.map(p => p._id));
          const filteredNew = newProducts.filter(p => !existingIds.has(p._id));
          return [...prev, ...filteredNew];
        });
      } else {
        setProducts(response.data || []);
      }
      if (response.meta) {
        setTotalPages(response.meta.totalPages);
        setTotalItems(response.meta.totalItems || 0);
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
      // Khi search thay đổi, luôn fetch lại từ trang 1
      fetchProductsData({ ...filters, page: 1 }, false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.minPrice, filters.maxPrice, fetchProductsData]);

  // Effect xử lý Category, Sort, Page (không Debounce - phản hồi ngay)
  useEffect(() => {
    // Chỉ xử lý fetch khi category, sort hoặc page thay đổi độc lập
    fetchProductsData(filters, filters.page > 1);
  }, [filters.category, filters.sort, filters.page, fetchProductsData]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setFilters(prev => ({ ...prev, sort: newSort, page: 1 }));
  };

  const loadMore = useCallback(() => {
    if (filters.page < totalPages) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [filters.page, totalPages]);

  const lastElementRef = useInfiniteScroll(filters.page < totalPages, isLoading, loadMore);

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
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sản Phẩm</p>
                   <p className="text-sm font-bold text-gray-900">Đang hiển thị {products.length} / {totalItems}</p>
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
            {isLoading && filters.page === 1 ? (
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
                  onClick={() => setFilters({ ...filters, search: '', category: '', minPrice: '', maxPrice: '', page: 1 })}
                  className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product, index) => {
                    if (index === products.length - 1) {
                      return <div ref={lastElementRef} key={product._id}><ProductCard product={product} /></div>;
                    } else {
                      return <ProductCard key={product._id} product={product} />;
                    }
                  })}
                </div>

                {/* Loading indicator for Infinite Scroll */}
                {isLoading && filters.page > 1 && (
                  <div className="flex justify-center items-center py-6">
                    <LoadingOutlined className="text-3xl text-primary-600" spin />
                  </div>
                )}
                
                {!isLoading && filters.page === totalPages && products.length > 0 && (
                  <div className="text-center py-6 text-gray-400 font-bold text-sm tracking-widest uppercase">
                    Bạn đã xem hết sản phẩm
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
