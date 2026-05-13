import React from 'react';
import { ShoppingCartOutlined, StarFilled, HeartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const discountPercent = product.originalPrice > product.salePrice
    ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-3xl p-4 premium-card-hover premium-shadow relative flex flex-col h-full border border-gray-100/50">
      {/* Badge & Favorite */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        {product.isNewProduct && (
          <span className="bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg">New</span>
        )}
        {discountPercent > 0 && (
          <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg shadow-red-600/30">-{discountPercent}%</span>
        )}
      </div>
      
      <button className="absolute top-6 right-6 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:shadow-md transition-all">
        <HeartOutlined className="text-lg" />
      </button>

      {/* Image Section */}
      <Link to={`/product/${product._id}`} className="block relative aspect-[4/3] mb-6 overflow-hidden rounded-2xl bg-gray-50">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400'}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 p-4"
        />
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur-sm text-black font-bold px-6 py-2.5 rounded-full text-xs tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
            Xem chi tiết
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-grow px-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/80">
            {product.category?.name || 'SNEAKERS'}
          </span>
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
            <StarFilled />
            <span className="text-gray-900 ml-0.5">4.8</span>
          </div>
        </div>
        
        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 hover:text-red-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {product.description || "Thiết kế hiện đại mang lại cảm giác thoải mái tối đa cho đôi chân."}
        </p>
      </div>

      {/* Footer: Price & Add to cart */}
      <div className="px-2 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl font-black text-gray-900 tracking-tight">
            {product.salePrice?.toLocaleString('vi-VN')}đ
          </span>
          {discountPercent > 0 && (
            <span className="text-xs text-gray-400 line-through font-medium">
              {product.originalPrice?.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
        
        <button className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg hover:shadow-red-600/30 transform hover:-rotate-6">
          <ShoppingCartOutlined className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
