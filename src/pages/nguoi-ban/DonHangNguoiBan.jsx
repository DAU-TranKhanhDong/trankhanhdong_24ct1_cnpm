import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, Clock, Truck, Package, XCircle, RotateCcw } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import Toast from '../../components/dung-chung/ThongBaoToast';

const statusFlow = ['pending', 'confirmed', 'preparing', 'shipping', 'delivered'];
const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  preparing: 'Đang chuẩn bị',
  shipping: 'Đang giao',
  delivered: 'Đã giao'
};

export default function SellerOrders() {
  const { orders, updateOrderStatus, resolveWarranty } = useOrders();
  const [toast, setToast] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Warranty resolution state
  const [resolvingOrderId, setResolvingOrderId] = useState(null);
  const [sellerReply, setSellerReply] = useState('');

  const filteredOrders = orders.filter(o => statusFilter === 'all' || o.status === statusFilter);

  const handleNextStatus = (order) => {
    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
      const next = statusFlow[currentIndex + 1];
      updateOrderStatus(order.id, next);
      setToast({ type: 'success', message: `Đơn ${order.id} đã chuyển sang "${statusLabels[next]}"` });
    }
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm(`Bạn muốn hủy đơn hàng ${orderId}?`)) {
      updateOrderStatus(orderId, 'cancelled', 'Người bán hủy do hết hàng');
      setToast({ type: 'info', message: `Đã hủy đơn ${orderId}` });
    }
  };

  const handleResolveWarranty = (orderId, status) => {
    resolveWarranty(orderId, status, sellerReply || 'Đã liên hệ xử lý theo quy định bảo hành');
    setResolvingOrderId(null);
    setSellerReply('');
    setToast({ type: 'success', message: `Đã phản hồi yêu cầu bảo hành đơn ${orderId}` });
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tiếp Nhận & Xử Lý Đơn Hàng</h1>
        <p className="text-xs text-slate-500 mt-1">Quy trình: Chờ xác nhận → Đã xác nhận → Đang chuẩn bị → Đang giao → Đã giao</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'pending', label: 'Chờ xác nhận' },
          { id: 'confirmed', label: 'Đã xác nhận' },
          { id: 'preparing', label: 'Đang chuẩn bị' },
          { id: 'shipping', label: 'Đang giao' },
          { id: 'delivered', label: 'Đã giao' },
          { id: 'cancelled', label: 'Đã hủy' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            Không có đơn hàng nào trong trạng thái này.
          </div>
        ) : (
          filteredOrders.map(order => {
            const currentIndex = statusFlow.indexOf(order.status);
            const canAdvance = currentIndex >= 0 && currentIndex < statusFlow.length - 1;
            const nextStatus = canAdvance ? statusFlow[currentIndex + 1] : null;

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Mã đơn: <b className="font-mono text-blue-600">{order.id}</b></span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{order.createdAt}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700">{order.customerName} ({order.customerPhone})</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 uppercase">
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-500 text-[11px]">SẢN PHẨM KHÁCH ĐẶT:</p>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <img src={it.thumbnail} alt={it.name} className="w-10 h-10 object-contain rounded bg-slate-50 p-1 border" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{it.name}</p>
                          <p className="text-slate-400 text-[11px]">Số lượng: x{it.quantity} • {it.price.toLocaleString('vi-VN')} đ</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl">
                    <p className="font-semibold text-slate-500 text-[11px]">ĐỊA CHỈ & THANH TOÁN:</p>
                    <p className="text-slate-700"><b>Địa chỉ:</b> {order.shippingAddress}</p>
                    <p className="text-slate-700">
                      <b>Phương thức:</b>{' '}
                      {order.paymentMethod === 'BANK_QR' ? (
                        <span className="font-semibold text-blue-700">VietQR MBBank</span>
                      ) : (
                        order.paymentMethod
                      )}{' '}
                      ({order.paymentStatus === 'paid' ? (
                        <span className="text-emerald-600 font-bold">Đã thu tiền</span>
                      ) : (
                        <span className="text-amber-600 font-bold">Chưa thu tiền</span>
                      )})
                    </p>
                    {order.notes && <p className="text-slate-500 italic"><b>Ghi chú:</b> {order.notes}</p>}
                    <p className="text-slate-900 font-bold pt-1 border-t border-slate-200">
                      Tổng thu: <span className="text-orange-600 text-sm">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
                    </p>
                  </div>
                </div>

                {/* Warranty handler */}
                {order.warrantyRequested && order.warrantyInfo && (
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <RotateCcw size={15} /> Yêu cầu đổi trả / bảo hành từ khách
                      </span>
                      <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-800 px-2 py-0.5 rounded">
                        {order.warrantyInfo.status}
                      </span>
                    </div>
                    <p className="text-slate-700"><b>Lý do:</b> {order.warrantyInfo.reason} - {order.warrantyInfo.description}</p>
                    
                    {order.warrantyInfo.status === 'processing' ? (
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={sellerReply}
                          onChange={(e) => setSellerReply(e.target.value)}
                          placeholder="Nhập ghi chú phản hồi cho khách..."
                          className="flex-1 p-2 bg-white border border-amber-300 rounded-lg text-xs outline-none"
                        />
                        <button
                          onClick={() => handleResolveWarranty(order.id, 'approved')}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                        >
                          Chấp thuận đổi mới
                        </button>
                        <button
                          onClick={() => handleResolveWarranty(order.id, 'rejected')}
                          className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                        >
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      <p className="text-emerald-700 font-semibold">Phản hồi của shop: {order.warrantyInfo.sellerResponse}</p>
                    )}
                  </div>
                )}

                {/* Action controls for updating status */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </div>

                  {canAdvance && (
                    <button
                      onClick={() => handleNextStatus(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <span>Chuyển sang: <b>{statusLabels[nextStatus]}</b></span>
                      →
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
