import React from 'react';
import { DollarSign, Users, ShoppingBag, Layers, TrendingUp, UserCheck, Store, ShieldAlert } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { users } = useAuth();

  const completedOrders = orders.filter(o => o.status === 'delivered');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const customers = users.filter(u => u.role === 'customer');
  const sellers = users.filter(u => u.role === 'seller');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tổng Quan Báo Cáo Hệ Thống</h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi tổng doanh thu toàn sàn, quản lý người dùng, sản phẩm và kiểm soát các đơn hàng phát sinh
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Tổng doanh thu toàn sàn</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp size={12} /> Tăng trưởng ổn định
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Tổng số đơn hàng</p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">
              {orders.length} đơn
            </h3>
            <span className="text-[11px] text-slate-400 block mt-1">
              {completedOrders.length} đơn đã giao thành công
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Thành viên đăng ký</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {users.length} tài khoản
            </h3>
            <span className="text-[11px] text-blue-600 font-semibold block mt-1">
              {customers.length} khách • {sellers.length} người bán
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Sản phẩm toàn sàn</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {products.length} sản phẩm
            </h3>
            <span className="text-[11px] text-slate-400 block mt-1">Đang được đăng bán</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Layers size={22} />
          </div>
        </div>
      </div>

      {/* Detailed Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Orders on Platform */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Đơn hàng mới nhất toàn hệ thống</h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-purple-600 hover:underline">
              Giám sát đơn hàng
            </Link>
          </div>

          <div className="divide-y divide-slate-100 space-y-2">
            {orders.slice(0, 4).map(o => (
              <div key={o.id} className="pt-2 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{o.id} - {o.customerName}</p>
                  <p className="text-slate-400 text-[11px]">PT: {o.paymentMethod} • Trạng thái: {o.status}</p>
                </div>
                <span className="font-bold text-orange-600">{o.totalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Account List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Danh sách tài khoản hệ thống</h3>
            <Link to="/admin/users" className="text-xs font-semibold text-purple-600 hover:underline">
              Quản lý tài khoản
            </Link>
          </div>

          <div className="divide-y divide-slate-100 space-y-2">
            {users.map(u => (
              <div key={u.id} className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border" />
                  <div>
                    <p className="font-bold text-slate-800">{u.name}</p>
                    <p className="text-slate-400 text-[11px]">{u.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'seller' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
