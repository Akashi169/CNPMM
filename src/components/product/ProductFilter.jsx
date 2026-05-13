import React, { useState, useEffect } from 'react';
import { getCategories } from '../../services/product.service';

const ProductFilter = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [localMin, setLocalMin] = useState(filters.minPrice || '');
  const [localMax, setLocalMax] = useState(filters.maxPrice || '');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    onFilterChange({ ...filters, category: val, page: 1 });
  };

  const handlePriceApply = () => {
    onFilterChange({ 
      ...filters, 
      minPrice: localMin, 
      maxPrice: localMax, 
      page: 1 
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
      <h3 className="font-black text-xl mb-6 text-gray-900 tracking-tight">Bộ Lọc Phân Tìm</h3>

      {/* 1. Tìm kiếm theo tên */}
      <div className="mb-8">
        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Tìm kiếm</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Nhập tên giày..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <hr className="my-8 border-gray-50" />

      {/* 2. Danh mục (Dynamic) */}
      <div className="mb-8">
        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Danh mục</label>
        <div className="space-y-3">
          <label className="flex items-center group cursor-pointer">
            <input 
              type="radio" 
              name="category" 
              value="" 
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              checked={!filters.category}
              onChange={handleCategoryChange}
            />
            <span className="ml-3 text-sm font-bold text-gray-600 group-hover:text-primary-600 transition-colors">Tất cả</span>
          </label>
          {categories.map(cat => (
            <label key={cat._id} className="flex items-center group cursor-pointer">
              <input 
                type="radio" 
                name="category" 
                value={cat._id} 
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                checked={filters.category === cat._id}
                onChange={handleCategoryChange}
              />
              <span className="ml-3 text-sm font-bold text-gray-600 group-hover:text-primary-600 transition-colors">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-8 border-gray-50" />

      {/* 3. Khoảng Giá */}
      <div className="mb-6">
        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Khoảng giá (VNĐ)</label>
        <div className="flex items-center gap-2 mb-4">
          <input 
            type="number" 
            placeholder="Từ..." 
            className="w-1/2 p-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
          />
          <span className="text-gray-300">-</span>
          <input 
            type="number" 
            placeholder="Đến..." 
            className="w-1/2 p-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
          />
        </div>
        <button 
          onClick={handlePriceApply}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-600/20"
        >
          Áp Dụng
        </button>
      </div>

    </div>
  );
};

export default ProductFilter;
