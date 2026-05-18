import React, { useState, useEffect } from 'react';
import ProductCard from '../components/product/ProductCard';
import ProductSlider from '../components/product/ProductSlider';
import { getProducts, getBestSellers, getMostViewed } from '../services/product.service';
import { ArrowRightOutlined, GlobalOutlined, RocketOutlined, SafetyOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [saleProducts, setSaleProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [mostViewedProducts, setMostViewedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const [saleRes, newRes, bestSellerRes, mostViewedRes] = await Promise.all([
          getProducts({ limit: 4, sort: 'price_asc' }),
          getProducts({ limit: 4, sort: 'newest' }),
          getBestSellers(),
          getMostViewed()
        ]);
        setSaleProducts(saleRes.data || []);
        setNewProducts(newRes.data || []);
        setBestSellerProducts(bestSellerRes.data || []);
        setMostViewedProducts(mostViewedRes.data || []);
      } catch (error) {
        console.error("Failed to load home products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="w-full">
      
      {/* 1. HERO SECTION - FIXED OVERLAY */}
      <section className="relative h-[600px] lg:h-[800px] w-full overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=2000" 
          alt="Hero Background" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Hero Content - Centered Overlay */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-20">
          <div className="max-w-2xl text-white animate-fade-in">
            <span className="inline-block bg-primary-600 text-white text-xs font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-6">
              Bộ sưu tập 2026
            </span>
            <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-none mb-6">
              BƯỚC ĐI <br /> <span className="text-primary-500 italic">PHÁ CÁCH.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-200 mb-10 max-w-lg leading-relaxed">
              Khám phá bộ sưu tập Sneaker mới nhất mùa này. Thiết kế đỉnh cao, trải nghiệm tuyệt vời cho từng nhịp bước.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-700 transition-all flex items-center gap-3 group shadow-xl shadow-primary-600/20">
                MUA SẮM NGAY <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & FEATURES - GRID LAYOUT */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16 pb-16 border-b border-gray-100">
            <div className="text-center">
              <span className="block text-4xl font-black text-gray-900 mb-1">50k+</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Khách hàng tin dùng</span>
            </div>
            <div className="text-center border-x border-gray-100">
              <span className="block text-4xl font-black text-gray-900 mb-1">120+</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Thương hiệu quốc tế</span>
            </div>
            <div className="text-center hidden md:block">
              <span className="block text-4xl font-black text-gray-900 mb-1">20+</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cửa hàng toàn quốc</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <RocketOutlined />, title: 'Giao hàng nhanh', desc: 'Trong vòng 24h nội thành' },
              { icon: <SafetyOutlined />, title: 'Bảo hành 12 tháng', desc: 'Chính hãng 100%' },
              { icon: <GlobalOutlined />, title: 'Đổi trả dễ dàng', desc: 'Trong vòng 30 ngày' },
              { icon: <CustomerServiceOutlined />, title: 'Hỗ trợ 24/7', desc: 'Tư vấn tận tâm' },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors group">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 text-2xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{f.title}</h4>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRODUCT SECTIONS - GRID & HEADER FLEX */}
      <div className="max-w-7xl mx-auto px-4 py-24 space-y-32">
        
        {/* Section Wrapper */}
        {[
          { title: 'Sản Phẩm Khuyến Mãi', accent: 'bg-primary-600', products: saleProducts, color: 'text-primary-600', slider: false },
          { title: 'Sản Phẩm Mới Nhất', accent: 'bg-black', products: newProducts, color: 'text-black', slider: false },
          { title: 'Top 10 Bán Chạy', accent: 'bg-orange-500', products: bestSellerProducts, color: 'text-orange-500', slider: true },
          { title: 'Top 10 Xem Nhiều Nhất', accent: 'bg-blue-500', products: mostViewedProducts, color: 'text-blue-500', slider: true }
        ].map((section, idx) => (
          <section key={idx}>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                {section.title}
              </h2>
              <Link to="/products" className="group flex items-center gap-2 font-bold text-sm tracking-widest uppercase text-gray-400 hover:text-primary-600 transition-colors">
                Xem tất cả <ArrowRightOutlined className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {section.slider ? (
              <ProductSlider products={section.products} isLoading={isLoading} />
            ) : (
              isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {[1,2,3,4].map(n => (
                    <div key={n} className="bg-gray-50 aspect-[3/4] rounded-3xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {section.products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )
            )}
          </section>
        ))}

        {/* 4. NEWSLETTER BANNER - BETTER LAYOUT */}
        <section className="relative rounded-[40px] overflow-hidden bg-gray-900 h-[450px] flex items-center px-8 lg:px-20 mt-32">
           <img 
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=2000" 
            alt="Promo Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
           />
           <div className="relative z-10 max-w-2xl text-center md:text-left mx-auto md:mx-0">
              <h2 className="text-white text-4xl lg:text-6xl font-black leading-tight mb-6">THAM GIA CỘNG ĐỒNG <span className="text-primary-500">STEP UP.</span></h2>
              <p className="text-gray-300 text-lg mb-10">Đăng ký thành viên để nhận ưu đãi lên đến 30% cho đơn hàng đầu tiên.</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..." 
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 flex-grow"
                />
                <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-primary-500 hover:text-white transition-all whitespace-nowrap">
                  Đăng ký ngay
                </button>
              </div>
           </div>
        </section>

      </div>

      {/* 5. FOOTER - CLEANER LAYOUT */}
      <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
            <div className="md:col-span-1">
              <h3 className="text-xl font-black mb-6">STEP UP <span className="text-primary-600 font-light italic">Sneaker</span></h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Nơi khởi đầu của những bước chân đam mê. Chúng tôi cung cấp những mẫu Sneaker chính hãng tốt nhất thế giới.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">MUA SẮM</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link to="/products" className="hover:text-primary-600">Tất cả sản phẩm</Link></li>
                <li><Link to="/" className="hover:text-primary-600">Hàng mới về</Link></li>
                <li><Link to="/" className="hover:text-primary-600">Khuyến mãi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">HỖ TRỢ</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link to="/" className="hover:text-primary-600">Chính sách đổi trả</Link></li>
                <li><Link to="/" className="hover:text-primary-600">Chính sách bảo hành</Link></li>
                <li><Link to="/" className="hover:text-primary-600">Vận chuyển</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">LIÊN HỆ</h4>
              <p className="text-sm text-gray-500 mb-4">Email: support@stepup.vn</p>
              <p className="text-sm text-gray-500">Hotline: 1900 6789</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-400 text-xs">
            © 2026 STEP UP Sneaker Co. Design for the winners.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;