import React, { useState } from 'react';
import { PackageCheck, Clock, CheckCircle2, Truck, XCircle, AlertCircle, RotateCcw, MessageSquare, ShieldAlert, QrCode } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/dung-chung/ThongBaoToast';
import KhungThanhToanVietQR from '../../components/khach-hang/KhungThanhToanVietQR';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  preparing: { label: 'Đang chuẩn bị hàng', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  shipping: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  delivered: { label: 'Đã giao thành công', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  cancelled: { label: 'Đã hủy', color: 'bg-rose-100 text-rose-800 border-rose-300' }
};

export default function OrderHistoryPage() {
  const { orders, cancelOrder, requestWarranty } = useOrders();
  const { currentUser } = useAuth();
  const [toast, setToast] = useState(null);
  const [qrModalOrder, setQrModalOrder] = useState(null);

  // Warranty Modal state
  const [warrantyModalOrder, setWarrantyModalOrder] = useState(null);
  const [warrantyReason, setWarrantyReason] = useState('Lỗi kỹ thuật không hoạt động');
  const [warrantyDesc, setWarrantyDesc] = useState('');

  // Lọc các đơn của khách hàng này (nếu chưa login hiển thị tất cả đơn mẫu của khách)
  const myOrders = orders.filter(o => !currentUser || o.customerId === currentUser.id || currentUser.role === 'customer');

  const handleCancel = (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      cancelOrder(orderId, 'Khách hàng yêu cầu hủy đơn');
      setToast({ type: 'info', message: `Đã hủy đơn hàng ${orderId}` });
    }
  };

  const handleOpenWarranty = (order) => {
    setWarrantyModalOrder(order);
    setWarrantyDesc('');
  };

  const handleSubmitWarranty = (e) => {
    e.preventDefault();
    if (!warrantyDesc.trim()) {
      setToast({ type: 'error', message: 'Vui lòng mô tả cụ thể tình trạng lỗi sản phẩm' });
      return;
    }
    requestWarranty(warrantyModalOrder.id, warrantyReason, warrantyDesc);
    setWarrantyModalOrder(null);
    setToast({ type: 'success', message: 'Yêu cầu bảo hành / đổi trả đã được gửi tới người bán!' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <PackageCheck className="text-orange-600" />
            Đơn Hàng Của Tôi ({myOrders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi quy trình: Chờ xác nhận → Đã xác nhận → Đang chuẩn bị → Đang giao → Đã giao
          </p>
        </div>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <p className="text-sm font-semibold text-slate-700">Bạn chưa có đơn hàng nào</p>
          <Link
            to="/products"
            className="inline-block bg-orange-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => {
            const st = statusConfig[order.status] || statusConfig.pending;
            const canCancel = order.status === 'pending';
            const isDelivered = order.status === 'delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header đơn */}
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-bold text-slate-900">Mã đơn: <b className="text-orange-600 font-mono">{order.id}</b></span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">{order.createdAt}</span>
                    <span className="text-slate-400">|</span>
                    {order.paymentMethod === 'BANK_QR' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md text-[11px]">
                        <QrCode size={13} className="text-blue-600" /> VietQR MBBank
                      </span>
                    ) : (
                      <span className="text-slate-600 font-semibold">{order.paymentMethod}</span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ chuyển khoản'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.color}`}>
                      {st.label}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-14 h-14 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100"
                          />
                          <div>
                            <Link to={`/products/${item.productId}`} className="text-xs font-semibold text-slate-800 hover:text-orange-600 line-clamp-1">
                              {item.name}
                            </Link>
                            <p className="text-[11px] text-slate-400">Số lượng: x{item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-900 shrink-0">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tiến trình Timeline */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                    <p className="font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Clock size={14} className="text-orange-600" />
                      Nhật ký vận chuyển:
                    </p>
                    <div className="space-y-1.5 pl-2 border-l-2 border-orange-400 text-[11px]">
                      {order.timeline?.map((step, sIdx) => (
                        <div key={sIdx} className="flex justify-between items-center text-slate-600">
                          <span className="font-medium text-slate-800">{step.title}</span>
                          <span className="text-slate-400">{step.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Thông báo đổi trả / bảo hành nếu có */}
                  {order.warrantyRequested && order.warrantyInfo && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-amber-800">
                        <RotateCcw size={14} />
                        Yêu cầu bảo hành / đổi trả:
                        <span className="uppercase text-[10px] bg-amber-200 px-1.5 py-0.5 rounded">
                          {order.warrantyInfo.status === 'processing' ? 'Đang chờ xử lý' : order.warrantyInfo.status === 'approved' ? 'Đã chấp thuận đổi mới' : 'Từ chối'}
                        </span>
                      </div>
                      <p className="text-slate-600">Lý do: {order.warrantyInfo.reason}</p>
                      {order.warrantyInfo.sellerResponse && (
                        <p className="text-blue-700 font-medium">Phản hồi từ shop: {order.warrantyInfo.sellerResponse}</p>
                      )}
                    </div>
                  )}

                  {/* Footer đơn: Tổng tiền và các hành động */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      Giao tới: <span className="text-slate-800 font-medium">{order.shippingAddress}</span>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400">Tổng thanh toán: </span>
                        <span className="text-sm font-black text-orange-600">
                          {order.totalAmount.toLocaleString('vi-VN')} đ
                        </span>
                      </div>

                      {/* Các nút hành động */}
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {order.paymentMethod === 'BANK_QR' && order.paymentStatus !== 'paid' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => setQrModalOrder(order)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <QrCode size={13} />
                            Quét mã QR thanh toán
                          </button>
                        )}

                        {canCancel && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Hủy đơn hàng
                          </button>
                        )}

                        {isDelivered && !order.warrantyRequested && (
                          <button
                            onClick={() => handleOpenWarranty(order)}
                            className="bg-white border border-amber-300 hover:bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <RotateCcw size={12} />
                            Đổi trả / Bảo hành
                          </button>
                        )}

                        {isDelivered && (
                          <Link
                            to={`/products/${order.items[0]?.productId}`}
                            className="bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <MessageSquare size={12} />
                            Đánh giá SP
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Payment Modal */}
      {qrModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <QrCode className="text-blue-600" size={18} />
                Thanh Toán Đơn Hàng {qrModalOrder.id}
              </h3>
              <button
                onClick={() => setQrModalOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <KhungThanhToanVietQR
              orderId={qrModalOrder.id}
              amount={qrModalOrder.totalAmount}
              isPaid={qrModalOrder.paymentStatus === 'paid'}
              onPaymentConfirmed={() => {
                setToast({ type: 'success', message: `Đã xác nhận thanh toán thành công đơn hàng ${qrModalOrder.id}!` });
              }}
            />
          </div>
        </div>
      )}

      {/* Warranty Modal */}
      {warrantyModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="text-orange-600" size={18} />
                Yêu Cầu Đổi Trả / Bảo Hành Đơn {warrantyModalOrder.id}
              </h3>
              <button onClick={() => setWarrantyModalOrder(null)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmitWarranty} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lý do yêu cầu:</label>
                <select
                  value={warrantyReason}
                  onChange={(e) => setWarrantyReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none"
                >
                  <option value="Lỗi kỹ thuật không hoạt động">Lỗi kỹ thuật không hoạt động</option>
                  <option value="Bể vỡ, trầy xước khi vận chuyển">Bể vỡ, trầy xước khi vận chuyển</option>
                  <option value="Giao sai mẫu mã hoặc màu sắc">Giao sai mẫu mã hoặc màu sắc</option>
                  <option value="Thiếu phụ kiện kèm theo máy">Thiếu phụ kiện kèm theo máy</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả chi tiết tình trạng sản phẩm:</label>
                <textarea
                  rows={4}
                  required
                  value={warrantyDesc}
                  onChange={(e) => setWarrantyDesc(e.target.value)}
                  placeholder="Vui lòng nêu rõ lỗi gặp phải, mã serial sản phẩm nếu có để kỹ thuật viên hỗ trợ nhanh nhất..."
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWarrantyModalOrder(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md"
                >
                  Gửi Yêu Cầu Cho Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
