import React, { useContext, useState, useEffect } from 'react';
import { 
  ShoppingOutlined, 
  UserOutlined, 
  SearchOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      user: { email: "", name: "" }
    });
    navigate("/");
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* PART 1: LOGO (Left) */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
            <span className="text-white font-black text-xl italic">S</span>
          </div>
          <span className={`text-2xl font-black tracking-tighter ${
            !isScrolled && location.pathname === '/' ? 'text-white' : 'text-gray-900'
          }`}>
            STEP UP<span className="text-primary-600 font-light italic ml-1">Sneaker</span>
          </span>
        </Link>

        {/* PART 2: MAIN MENU (Center) */}
        <nav className="hidden md:flex items-center space-x-10">
          {[
            { label: 'Trang Chủ', path: '/' },
            { label: 'Sản Phẩm', path: '/products' },
            ...(auth.isAuthenticated ? [{ label: 'Cộng đồng', path: '/user' }] : []),
          ].map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm font-bold tracking-widest uppercase transition-colors hover:text-primary-600 ${
                !isScrolled && location.pathname === '/' ? 'text-white/90' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* PART 3: ICONS & USER (Right) */}
        <div className="flex items-center gap-6">
          {/* Search Icon */}
          <button className={`${!isScrolled && location.pathname === '/' ? 'text-white' : 'text-gray-600'} hover:text-primary-600 transition-colors`}>
            <SearchOutlined className="text-xl" />
          </button>
          
          {/* Cart Icon */}
          <Link to="/cart" className={`relative ${!isScrolled && location.pathname === '/' ? 'text-white' : 'text-gray-600'} hover:text-primary-600 transition-colors`}>
            <ShoppingOutlined className="text-2xl" />
            <span className="absolute -top-1 -right-2 bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
          </Link>

          {/* User Section */}
          {auth.isAuthenticated ? (
            <div 
              className="relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button className={`flex items-center gap-2 font-bold text-sm ${
                !isScrolled && location.pathname === '/' ? 'text-white' : 'text-gray-900'
              }`}>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <UserOutlined />
                </div>
                <span className="hidden sm:inline">{auth.user?.name || 'Tài khoản'}</span>
                <DownOutlined className="text-[10px]" />
              </button>
              
              {/* DROPDOWN MENU */}
              {showUserMenu && (
                <div className="absolute right-0 top-full pt-2 w-48 animate-fade-in">
                  <div className="bg-white rounded-xl shadow-2xl py-2 border border-gray-100 overflow-hidden">
                    <Link to="/profile" className="block px-5 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">Hồ sơ cá nhân</Link>
                    <Link to="/orders" className="block px-5 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-medium">Lịch sử đơn hàng</Link>
                    <hr className="my-2 border-gray-50" />
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-sm text-primary-600 font-bold hover:bg-primary-50 flex items-center gap-2 transition-colors"
                    >
                      <LogoutOutlined /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-primary-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all transform hover:scale-105"
            >
              Đăng nhập
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;