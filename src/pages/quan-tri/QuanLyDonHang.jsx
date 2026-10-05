import React, { useState } from 'react';
import { ShoppingBag, Search, Eye, Filter } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

export default function AdminOrders() {
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Giám Sát Toàn Bộ Đơn Hàng</h1>
        <p className="text-xs text-slate-500 mt-1">Theo dõi tiến độ vận chuyển và tình hình xử lý đơn của người bán</p>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
          />
          <Search size={15} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="preparing">Đang chuẩn bị</option>
          <option value="shipping">Đang giao hàng</option>
          <option value="delivered">Đã giao thành công</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Mã đơn & Ngày tạo</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Sản phẩm mua</th>
                <th className="p-4">Thanh toán</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 font-mono text-purple-700">{o.id}</p>
                    <p className="text-[11px] text-slate-400">{o.createdAt}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{o.customerName}</p>
                    <p className="text-[11px] text-slate-400">{o.customerPhone}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-700">{o.items.length} mặt hàng</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{o.items[0]?.name}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-800">
                      {o.paymentMethod === 'BANK_QR' ? 'VietQR MBBank' : o.paymentMethod}
                    </span>
                    <p className={`text-[10px] font-bold ${o.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {o.paymentStatus === 'paid' ? 'Đã thu tiền' : 'Chưa thu tiền'}
                    </p>
                  </td>
                  <td className="p-4 font-black text-orange-600">
                    {o.totalAmount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
