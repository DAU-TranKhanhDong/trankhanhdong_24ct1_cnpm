import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, PackageCheck, Shield, Store, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const { currentUser, logout, isAdmin, isSeller } = useAuth();
  const { totalCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
      {/* Top Banner Info */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="font-medium text-orange-400">
            🔥 Siêu hội gia dụng thông minh - Giảm tới 40% & Thanh toán Mã QR tiện lợi
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/products" className="text-slate-300 hover:text-white">Sản phẩm hot</Link>
            <Link to="/orders" className="text-slate-300 hover:text-white">Tra cứu đơn</Link>
            <span className="text-slate-400">Hotline: <b className="text-white">1900 8888</b></span>
            <span className="text-slate-700">|</span>

            {/* Trạng thái đăng nhập trên Topbar */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <span className="text-purple-300 font-bold flex items-center gap-1 bg-purple-900/60 px-2 py-0.5 rounded">
                    <Shield size={12} className="text-amber-400" />
                    Admin: {currentUser.name}
                  </span>
                ) : (
                  <span className="text-slate-300">
                    Khách: <b className="text-white">{currentUser.name}</b>
                  </span>
                )}
                <button
                  onClick={logout}
                  className="text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                  title="Đăng xuất khỏi tài khoản"
                >
                  (Đăng xuất)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 font-semibold">
                <Link to="/login" className="text-amber-400 hover:text-amber-300">Đăng Nhập</Link>
                <span className="text-slate-600">•</span>
                <Link to="/register" className="text-slate-300 hover:text-white">Đăng Ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
              GiaDụng<span className="text-orange-600">Smart</span>
            </span>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase -mt-1">Tiện nghi cuộc sống</p>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-2 hidden sm:block">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm nồi chiên, robot hút bụi, máy lọc không khí, bếp từ..."
              className="w-full pl-11 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Actions (Role Links, Cart, Profile) */}
        <div className="flex items-center gap-3">
          {/* Nút đặc quyền chỉ Admin mới có */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 border border-purple-500 px-3.5 py-2 rounded-xl shadow-md shadow-purple-600/20 transition-all"
            >
              <Shield size={15} />
              <span>Trang Quản Trị (Admin)</span>
            </Link>
          )}

          {/* Nút Seller nếu là seller */}
          {isSeller && (
            <Link
              to="/seller"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-xl transition-colors"
            >
              <Store size={15} />
              Kênh Người Bán
            </Link>
          )}

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative p-2.5 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all flex items-center"
            title="Giỏ hàng của bạn"
          >
            <ShoppingBag className="w-6 h-6" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth Area */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className={`w-8 h-8 rounded-full object-cover border-2 ${
                    isAdmin ? 'border-purple-500' : 'border-orange-400'
                  }`}
                />
                <div className="hidden md:block text-left text-xs leading-tight">
                  <span className="font-bold text-slate-800 block max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] font-bold uppercase ${
                    isAdmin ? 'text-purple-600' : 'text-slate-400'
                  }`}>
                    {isAdmin ? '👑 Admin' : 'Khách Hàng'}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <div className={`px-4 py-2.5 border-b border-slate-100 ${
                    isAdmin ? 'bg-purple-50/60' : 'bg-slate-50'
                  }`}>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Tài khoản hiện tại</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                    <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded mt-1 ${
                      isAdmin ? 'bg-purple-200 text-purple-900' : 'bg-orange-100 text-orange-800'
                    }`}>
                      Vai trò: {isAdmin ? 'Quản Trị Viên (Toàn Quyền)' : 'Khách Hàng Mua Sắm'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-orange-600 font-medium"
                    >
                      <User size={15} />
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-orange-600 font-medium"
                    >
                      <PackageCheck size={15} />
                      Đơn hàng của tôi
                    </Link>

                    {/* Chỉ Admin mới thấy link Admin */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-slate-100 my-1"></div>
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 font-bold"
                        >
                          <Shield size={15} />
                          Trang Quản Trị Hệ Thống
                        </Link>
                        <Link
                          to="/seller"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 font-semibold"
                        >
                          <Store size={15} />
                          Kênh Bán Hàng (Seller)
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    {/* Nếu đang là khách, cho phép chuyển sang đăng nhập admin */}
                    {!isAdmin && (
                      <Link
                        to="/login"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 font-semibold"
                      >
                        <Shield size={15} />
                        Đăng nhập bằng Admin
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold text-left cursor-pointer"
                    >
                      <LogOut size={15} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Khi chưa đăng nhập: Hiện rõ ràng nút Đăng Nhập & Đăng Ký */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold px-3.5 py-2 text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Đăng Nhập
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md shadow-orange-600/20 transition-all"
              >
                Đăng Ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 border-t border-slate-100 pt-3 bg-white space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm đồ gia dụng..."
                className="w-full pl-9 pr-20 py-2 bg-slate-100 rounded-lg text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-600 text-white text-xs px-3 py-1.5 rounded-md"
              >
                Tìm
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 text-xs font-medium">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-1">Trang chủ</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-1">Tất cả sản phẩm</Link>
            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="py-1">Đơn mua của tôi</Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="py-1 text-purple-700 font-bold">
                🛡️ Trang Quản Trị (Admin)
              </Link>
            )}
            {!currentUser ? (
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-1/2 text-center py-2 bg-slate-100 font-bold rounded-lg">
                  Đăng Nhập
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-1/2 text-center py-2 bg-orange-600 text-white font-bold rounded-lg">
                  Đăng Ký
                </Link>
              </div>
            ) : (
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left py-1 text-rose-600 font-bold">
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
