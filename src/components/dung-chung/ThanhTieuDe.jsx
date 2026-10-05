import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, PackageCheck, Heart, Shield, Store, Menu, X } from 'lucide-react';
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
      <div className="bg-orange-600 text-white text-[12px] py-1 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="font-medium">🔥 Siêu hội gia dụng thông minh - Giảm tới 40% & Freeship đơn từ 300k</p>
          <div className="flex items-center gap-6">
            <Link to="/products" className="hover:underline">Bán chạy nhất</Link>
            <Link to="/orders" className="hover:underline">Kiểm tra đơn hàng</Link>
            <span>Hotline hỗ trợ: <b>1900 8888</b></span>
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
              className="w-full pl-11 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all shadow-inner"
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
          {/* Direct link for Seller / Admin */}
          {isSeller && (
            <Link
              to="/seller"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg transition-colors"
            >
              <Store size={15} />
              Kênh Người Bán
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-2 rounded-lg transition-colors"
            >
              <Shield size={15} />
              Trang Quản Trị
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

          {/* User Profile / Auth */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-orange-200"
                />
                <span className="hidden md:inline text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                  {currentUser.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Đăng nhập với tư cách</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded mt-1 bg-slate-100 text-slate-700">
                      Vai trò: {currentUser.role}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 font-medium"
                  >
                    <User size={16} />
                    Hồ sơ tài khoản
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 font-medium"
                  >
                    <PackageCheck size={16} />
                    Đơn hàng của tôi
                  </Link>

                  {isSeller && (
                    <Link
                      to="/seller"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-semibold"
                    >
                      <Store size={16} />
                      Vào Kênh Bán Hàng
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 font-semibold"
                    >
                      <Shield size={16} />
                      Vào Trang Quản Trị
                    </Link>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium text-left"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-2 text-slate-700 hover:text-orange-600"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                Đăng ký
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

      {/* Mobile Search Bar & Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 border-t border-slate-100 pt-3 bg-white space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm đồ gia dụng..."
                className="w-full pl-9 pr-20 py-2 bg-slate-100 rounded-lg text-sm"
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

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 text-sm font-medium">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-1">Trang chủ</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-1">Tất cả sản phẩm</Link>
            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="py-1">Đơn mua</Link>
            {isSeller && (
              <Link to="/seller" onClick={() => setIsMobileMenuOpen(false)} className="py-1 text-blue-600">
                Kênh người bán
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="py-1 text-purple-600">
                Trang Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
