import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';

const ProductSlider = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-gray-50 aspect-[3/4] rounded-3xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div className="text-center py-10 text-gray-500">Không có sản phẩm nào.</div>;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={24}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      className="pb-12"
    >
      {products.map((product) => (
        <SwiperSlide key={product._id} className="pb-12 pt-2">
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductSlider;
