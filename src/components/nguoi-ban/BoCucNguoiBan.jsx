import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Boxes, ArrowLeft, Store, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SellerLayout() {
  const { currentUser } = useAuth();

  const links = [
    { to: '/seller', label: 'Báo Cáo Doanh Thu', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/seller/orders', label: 'Xử Lý Đơn Hàng', icon: <ShoppingCart size={18} /> },
    { to: '/seller/products', label: 'Quản Lý Sản Phẩm', icon: <Package size={18} /> },
    { to: '/seller/inventory', label: 'Quản Lý Tồn Kho', icon: <Boxes size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Store size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Kênh Người Bán</h2>
              <p className="text-[10px] text-blue-400">Gia Dụng SmartHome</p>
            </div>
          </div>
        </div>

        {/* Store Profile Info */}
        <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
          <img
            src={currentUser?.avatar}
            alt="Seller avatar"
            className="w-10 h-10 rounded-full object-cover border border-blue-400"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              ● Đang hoạt động
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 space-y-1 py-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Back to Client Store */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Xem Cửa Hàng (Giao diện khách)
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}
