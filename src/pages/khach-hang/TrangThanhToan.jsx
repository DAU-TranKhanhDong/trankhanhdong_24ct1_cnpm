import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, ChevronDown, QrCode, ArrowLeft, ShieldCheck, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import Toast from '../../components/dung-chung/ThongBaoToast';
import KhungThanhToanVietQR from '../../components/khach-hang/KhungThanhToanVietQR';

export default function CheckoutPage() {
  const { cartItems, subtotal, shippingFee, discountAmount, totalAmount, appliedVoucher, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Trần Khánh Đông',
    phone: currentUser?.phone || '0379340113',
    city: 'Đà Nẵng',
    district: 'Quận Hải Châu',
    ward: 'phường Hải Châu',
    street: '123 Lê Đình Lý',
    notes: '',
    paymentMethod: 'BANK_QR'
  });

  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  if (cartItems.length === 0 && !createdOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không có sản phẩm để thanh toán</h2>
        <p className="text-xs text-slate-500">Giỏ hàng của bạn đang trống, hãy chọn sản phẩm trước nhé!</p>
        <Link to="/products" className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all">
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  const handleConfirmAndPay = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.street.trim()) {
      setToast({ type: 'error', message: 'Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng!' });
      return;
    }

    setIsSubmitting(true);

    const fullAddress = `${formData.street.trim()}, ${formData.ward.trim()}, ${formData.district.trim()}, ${formData.city}`;

    setTimeout(() => {
      const newOrder = createOrder({
        customerId: currentUser?.id || 'usr_guest',
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        shippingAddress: fullAddress,
        paymentMethod: 'BANK_QR',
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail
        })),
        itemsTotal: subtotal,
        shippingFee: shippingFee || 30000,
        discountAmount,
        voucherCode: appliedVoucher?.code || '',
        totalAmount,
        notes: formData.notes.trim()
      });

      setCreatedOrder(newOrder);
      setShowQRModal(true);
      setIsSubmitting(false);
      clearCart();
    }, 400);
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 sm:px-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Card Form Thông Tin Nhận Hàng chuẩn như hình mẫu */}
      <div className="max-w-xl w-full bg-white p-6 sm:p-9 rounded-3xl border border-slate-200/90 shadow-2xl space-y-6">
        
        {/* Tiêu đề & Lời nhắn */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Thông Tin Nhận Hàng
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Vui lòng cung cấp số điện thoại Việt Nam (+84) và địa chỉ để shop gửi hàng.
          </p>
        </div>

        <form onSubmit={handleConfirmAndPay} className="space-y-4">
          {/* Họ và tên người nhận */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Họ và tên người nhận <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Trần Khánh Đông"
                className="w-full text-xs pl-10 pr-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Số điện thoại Việt Nam (+84) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Mã quốc gia: +84 (Việt Nam)</span>
            </div>
            <div className="flex gap-2.5">
              <div className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 flex items-center justify-center shrink-0">
                VN +84
              </div>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0379340113"
                className="flex-1 text-xs px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Tỉnh / Thành phố */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Tỉnh / Thành phố <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-amber-700 font-medium">
                💡 Gõ "Q" để thấy Quảng Trị, Quảng Ngãi...
              </span>
            </div>
            <div className="relative">
              <Building2 size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs pl-10 pr-9 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-800"
              >
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Quảng Nam">Quảng Nam</option>
                <option value="Quảng Ngãi">Quảng Ngãi</option>
                <option value="Quảng Trị">Quảng Trị</option>
                <option value="Quảng Bình">Quảng Bình</option>
                <option value="Quảng Ninh">Quảng Ninh</option>
                <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                <option value="Hải Phòng">Hải Phòng</option>
                <option value="Cần Thơ">Cần Thơ</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="Đồng Nai">Đồng Nai</option>
                <option value="Khánh Hòa">Khánh Hòa</option>
                <option value="Lâm Đồng">Lâm Đồng</option>
                <option value="Bắc Ninh">Bắc Ninh</option>
                <option value="Nghệ An">Nghệ An</option>
                <option value="Thanh Hóa">Thanh Hóa</option>
              </select>
              <ChevronDown size={15} className="text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Quận / Huyện & Phường / Xã */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Quận / Huyện <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Quận Hải Châu"
                className="w-full text-xs px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Phường / Xã <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                placeholder="phường Hải Châu"
                className="w-full text-xs px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Địa chỉ chi tiết */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Địa chỉ chi tiết (Số nhà, tên đường) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder="123 Lê Đình Lý"
              className="w-full text-xs px-3.5 py-3 bg-slate-50/50 border border-orange-300 rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium text-slate-800"
            />
          </div>

          {/* Ghi chú đơn hàng */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Ghi chú đơn hàng (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
              className="w-full text-xs px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-slate-700"
            />
          </div>

          {/* Khối tổng kết thanh toán */}
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4.5 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span>Đơn hàng ({totalQuantity || 1} món):</span>
              <span className="font-semibold text-slate-900">{subtotal.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-slate-900">
                {(shippingFee || 30000).toLocaleString('vi-VN')} đ
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-700 font-medium">
                <span>Giảm giá khuyến mãi:</span>
                <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
            <div className="border-t border-amber-200/90 pt-2.5 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
              <span className="text-xl font-serif font-black text-[#c2410c]">
                {totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* 2 Nút hành động ở cuối */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors shrink-0 cursor-pointer"
            >
              Quay Lại
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-[#c2410c] hover:bg-[#9a3412] disabled:bg-orange-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 hover:shadow-orange-900/30 transition-all cursor-pointer"
            >
              <QrCode size={18} />
              <span>{isSubmitting ? 'Đang khởi tạo...' : 'Xác Nhận & Quét Mã QR Thanh Toán'}</span>
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400 pt-1">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Thông tin đặt hàng được mã hóa & bảo mật an toàn</span>
        </div>
      </div>

      {/* Modal Popup Mã VietQR MBBank khi bấm Xác Nhận */}
      {showQRModal && createdOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-xl w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 relative max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => navigate(`/order-success/${createdOrder.id}`)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Đóng và xem đơn hàng"
            >
              <X size={20} />
            </button>

            <KhungThanhToanVietQR
              orderId={createdOrder.id}
              amount={createdOrder.totalAmount}
              onPaymentConfirmed={() => {
                setTimeout(() => {
                  navigate(`/order-success/${createdOrder.id}`);
                }, 1200);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
