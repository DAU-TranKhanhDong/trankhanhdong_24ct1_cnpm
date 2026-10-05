import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, Home, ShieldCheck } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import KhungThanhToanVietQR from '../../components/khach-hang/KhungThanhToanVietQR';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { orders } = useOrders();

  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    // Kích hoạt hiệu ứng pháo hoa chúc mừng
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-8">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce-short">
        <CheckCircle2 size={42} />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Đặt Hàng Thành Công
        </span>
        <h1 className="text-3xl font-black text-slate-900">
          Cảm Ơn Bạn Đã Mua Sắm!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Mã đơn hàng của bạn là <b className="text-orange-600 font-mono">{orderId}</b>. Chúng tôi đã gửi thông tin đơn hàng tới hệ thống của người bán để bắt đầu chuẩn bị hàng.
        </p>
      </div>

      {/* Khung thanh toán QR nếu chọn BANK_QR */}
      {order && order.paymentMethod === 'BANK_QR' && (
        <div className="text-left">
          <KhungThanhToanVietQR
            orderId={order.id}
            amount={order.totalAmount}
            isPaid={order.paymentStatus === 'paid'}
          />
        </div>
      )}

      {order && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-800">Thông tin nhận hàng</span>
            <span className="text-xs font-semibold text-orange-600">
              {order.paymentMethod === 'COD'
                ? 'Thanh toán COD khi nhận'
                : order.paymentMethod === 'BANK_QR'
                ? (order.paymentStatus === 'paid' ? 'Đã chuyển khoản VietQR' : 'Chờ chuyển khoản VietQR')
                : 'Đã thanh toán qua thẻ'}
            </span>
          </div>

          <div className="text-xs text-slate-600 space-y-1.5">
            <p><b>Người nhận:</b> {order.customerName} ({order.customerPhone})</p>
            <p><b>Địa chỉ:</b> {order.shippingAddress}</p>
            <p><b>Phương thức thanh toán:</b> {order.paymentMethod === 'BANK_QR' ? 'Chuyển khoản VietQR MBBank' : order.paymentMethod}</p>
            <p><b>Tổng tiền thanh toán:</b> <span className="font-bold text-slate-900 text-sm">{order.totalAmount.toLocaleString('vi-VN')} đ</span></p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/orders"
          className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <PackageCheck size={16} />
          Theo Dõi Trạng Thái Đơn Hàng
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Home size={16} />
          Tiếp Tục Mua Sắm
        </Link>
      </div>
    </div>
  );
}
