import React from 'react';
import { DollarSign, ShoppingCart, Boxes, TrendingUp, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { Link } from 'react-router-dom';

export default function SellerDashboard() {
  const { orders } = useOrders();
  const { products } = useProducts();

  // Tính toán số liệu người bán
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = products.filter(p => p.stock <= 0);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bảng Điều Khiển Bán Hàng</h1>
        <p className="text-xs text-slate-500 mt-1">Theo dõi doanh số, xử lý đơn hàng và giám sát tồn kho gia dụng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Doanh thu hoàn tất</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp size={12} /> +15.4% so với tháng trước
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Đơn chờ xác nhận</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {pendingOrders.length} đơn
            </h3>
            <Link to="/seller/orders" className="text-[11px] text-blue-600 font-semibold hover:underline block mt-1">
              Xử lý ngay →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShoppingCart size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Tổng sản phẩm đăng bán</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {products.length} mã
            </h3>
            <span className="text-[11px] text-slate-400 block mt-1">Sẵn sàng cung ứng</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Boxes size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Cảnh báo tồn kho</p>
            <h3 className="text-2xl font-black text-rose-600 mt-1">
              {lowStockProducts.length + outOfStockProducts.length} món
            </h3>
            <span className="text-[11px] text-rose-600 font-semibold block mt-1">
              {outOfStockProducts.length} hết, {lowStockProducts.length} sắp hết
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Orders requiring attention + Low stock alert table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Đơn hàng mới nhận gần đây</h3>
            <Link to="/seller/orders" className="text-xs font-semibold text-blue-600 hover:underline">
              Xem tất cả ({orders.length})
            </Link>
          </div>

          <div className="divide-y divide-slate-100 space-y-2">
            {orders.slice(0, 4).map((ord) => (
              <div key={ord.id} className="pt-2 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{ord.id} - {ord.customerName}</p>
                  <p className="text-slate-400 text-[11px]">
                    {ord.items.length} món • {ord.totalAmount.toLocaleString('vi-VN')} đ
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {ord.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Best Selling Products */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Top sản phẩm gia dụng bán chạy</h3>
            <Link to="/seller/products" className="text-xs font-semibold text-blue-600 hover:underline">
              Quản lý sản phẩm
            </Link>
          </div>

          <div className="divide-y divide-slate-100 space-y-2">
            {products
              .slice()
              .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
              .slice(0, 4)
              .map((p) => (
                <div key={p.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={p.thumbnail} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border" />
                    <div className="max-w-xs">
                      <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                      <p className="text-slate-400 text-[11px]">Kho: {p.stock} | Đã bán: {p.soldCount}</p>
                    </div>
                  </div>
                  <span className="font-black text-orange-600">
                    {p.price.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
