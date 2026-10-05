import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Layers, ShoppingBag, Tag, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { currentUser } = useAuth();

  const links = [
    { to: '/admin', label: 'Báo Cáo & Thống Kê', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/admin/users', label: 'Quản Lý Tài Khoản', icon: <Users size={18} /> },
    { to: '/admin/products', label: 'Kiểm Soát Sản Phẩm', icon: <Layers size={18} /> },
    { to: '/admin/orders', label: 'Giám Sát Toàn Bộ Đơn', icon: <ShoppingBag size={18} /> },
    { to: '/admin/promotions', label: 'Quản Lý Mã Khuyến Mãi', icon: <Tag size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Quản Trị Hệ Thống</h2>
              <p className="text-[10px] text-purple-400">GiaDụngSmart Admin</p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 mx-3 my-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
          <img
            src={currentUser?.avatar}
            alt="Admin avatar"
            className="w-10 h-10 rounded-full object-cover border border-purple-500"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
            <span className="text-[10px] text-purple-400 font-semibold">Quyền Quản Trị Cao Cấp</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 py-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Back to Client */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white py-2 px-3 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Xem Giao Diện Người Dùng
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}
