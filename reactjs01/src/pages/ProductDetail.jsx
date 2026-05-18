import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { getProductById, getProducts } from '../services/product.service';
import ProductCard from '../components/product/ProductCard';
import { ShoppingCartOutlined, ThunderboltOutlined, SafetyCertificateOutlined, RetweetOutlined } from '@ant-design/icons';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      try {
        const res = await getProductById(id);
        if (res.data) {
          setProduct(res.data);
          
          // Fetch similar products in same category
          const similarRes = await getProducts({ 
            category: res.data.category?._id, 
            limit: 4 
          });
          // Filter out current product
          setSimilarProducts(similarRes.data?.filter(p => p._id !== id) || []);
        }
      } catch (error) {
        console.error("Failed to load product detail", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleIncrease = () => {
    if (quantity < product?.stockQuantity) setQuantity(q => q + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm!</h2>
      <button onClick={() => window.history.back()} className="text-primary-600 font-bold underline">Quay lại</button>
    </div>
  );

  const isOutOfStock = product.stockQuantity === 0;
  const discountPercent = product.originalPrice > product.salePrice
    ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-10">
          <span className="hover:text-primary-600 cursor-pointer">Trang chủ</span>
          <span>/</span>
          <span className="hover:text-primary-600 cursor-pointer">{product.category?.name || 'Sản phẩm'}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Cột trái: Media Gallery */}
          <div className="w-full lg:w-3/5">
            <div className="sticky top-32">
              <Swiper
                style={{ '--swiper-navigation-color': '#000', '--swiper-pagination-color': '#000' }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[Navigation, Pagination, Thumbs]}
                className="w-full aspect-square rounded-[3rem] overflow-hidden bg-gray-50 mb-6 border border-gray-100"
              >
                {product.images?.map((img, idx) => (
                  <SwiperSlide key={idx} className="flex items-center justify-center p-12">
                    <img src={img} alt={`${product.name} - ${idx}`} className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-700" />
                  </SwiperSlide>
                ))}
              </Swiper>
              
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={15}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Navigation, Thumbs]}
                className="w-full h-24 px-2"
              >
                {product.images?.map((img, idx) => (
                  <SwiperSlide key={idx} className="cursor-pointer rounded-2xl overflow-hidden border-2 border-transparent transition-all opacity-50 [.swiper-slide-thumb-active]:opacity-100 [.swiper-slide-thumb-active]:border-primary-600">
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Cột phải: Product Actions */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="mb-8">
              {product.isNewProduct && (
                <span className="inline-block bg-black text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-[0.2em] uppercase mb-4">New Arrival</span>
              )}
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4 tracking-tighter italic uppercase">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                 <div className="flex flex-col">
                    <span className="text-4xl font-black text-primary-600 tracking-tight">{product.salePrice?.toLocaleString('vi-VN')}đ</span>
                    {discountPercent > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-gray-400 line-through font-medium">{product.originalPrice?.toLocaleString('vi-VN')}đ</span>
                        <span className="bg-primary-50 text-primary-600 text-[10px] font-black px-2 py-0.5 rounded-md">-{discountPercent}%</span>
                      </div>
                    )}
                 </div>
              </div>

              <p className="text-gray-500 leading-relaxed font-medium mb-8">
                {product.description}
              </p>
            </div>

            <div className="space-y-8 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 mb-8">
              {/* Status */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Tình trạng</span>
                <span className={`font-black ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                  {isOutOfStock ? 'Hết hàng' : `Còn hàng (${product.stockQuantity})`}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Số lượng</span>
                <div className="flex items-center bg-white rounded-2xl border border-gray-200 p-1 shadow-sm">
                  <button 
                    onClick={handleDecrease}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary-600 disabled:opacity-20 transition-all"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    readOnly
                    className="w-12 h-10 text-center font-black text-gray-900 outline-none text-lg"
                  />
                  <button 
                    onClick={handleIncrease}
                    disabled={quantity >= product.stockQuantity || isOutOfStock}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400 hover:text-primary-600 disabled:opacity-20 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  disabled={isOutOfStock}
                  className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-black/20 disabled:bg-gray-300 group"
                >
                  <ShoppingCartOutlined className="text-xl group-hover:-rotate-12 transition-transform" /> THÊM VÀO GIỎ HÀNG
                </button>
                <button 
                  disabled={isOutOfStock}
                  className="w-full bg-primary-600 text-white font-black py-5 rounded-2xl hover:bg-primary-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-600/20 disabled:bg-primary-300 group"
                >
                  <ThunderboltOutlined className="text-xl group-hover:scale-125 transition-transform" /> MUA NGAY
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <SafetyCertificateOutlined className="text-2xl text-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <RetweetOutlined className="text-2xl text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Đổi trả 30 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Sản phẩm tương tự */}
        <div className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Có thể bạn sẽ thích</h2>
            <div className="h-1 flex-grow mx-8 bg-gray-50"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarProducts.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
