import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, QrCode, Banknote, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function CheckoutPage() {
  const { cartItems, subtotal, shippingFee, discountAmount, totalAmount, appliedVoucher, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    notes: '',
    paymentMethod: 'COD' // COD | BANK_QR | CARD
  });

  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không có sản phẩm để thanh toán</h2>
        <Link to="/products" className="inline-block bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setToast({ type: 'error', message: 'Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng!' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        customerId: currentUser?.id || 'usr_guest',
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        shippingAddress: formData.address.trim(),
        paymentMethod: formData.paymentMethod,
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail
        })),
        itemsTotal: subtotal,
        shippingFee,
        discountAmount,
        voucherCode: appliedVoucher?.code || '',
        totalAmount,
        notes: formData.notes.trim()
      });

      clearCart();
      setIsSubmitting(false);
      navigate(`/order-success/${newOrder.id}`);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Xác Nhận Đặt Hàng & Thanh Toán</h1>
        <p className="text-xs text-slate-500 mt-1">Kiểm tra thông tin giao nhận và phương thức thanh toán</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Customer Information & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Truck size={18} className="text-orange-600" />
              Thông Tin Người Nhận Hàng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Trần Khánh Đông"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại nhận hàng *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ví dụ: 0987654321"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ chi tiết nhận hàng (Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành) *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ví dụ: 45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi chú cho shipper (Không bắt buộc)
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao 15 phút..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={18} className="text-orange-600" />
              Phương Thức Thanh Toán
            </h3>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === 'COD'
                    ? 'border-orange-600 bg-orange-50/40'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <Banknote size={16} className="text-emerald-600" />
                    Thanh toán khi nhận hàng (COD)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kiểm tra hàng thoải mái trước khi thanh toán tiền mặt cho shipper.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === 'BANK_QR'
                    ? 'border-orange-600 bg-orange-50/40'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_QR"
                  checked={formData.paymentMethod === 'BANK_QR'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <QrCode size={16} className="text-blue-600" />
                    Chuyển khoản VietQR / Mobile Banking (MB Bank)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Quét mã QR tự động nhận diện tài khoản và điền số tiền bảo mật.
                  </p>
                </div>
              </label>

              {/* Thông tin hiển thị khi chọn BANK_QR */}
              {formData.paymentMethod === 'BANK_QR' && (
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-3 shadow-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <QrCode size={15} className="text-blue-600" />
                      Thông Tin Chuyển Khoản VietQR:
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                      MBBank
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <img
                      src="/qr-card-clean.png"
                      alt="Mã QR MBBank sạch bảo mật"
                      className="w-24 h-auto rounded-xl border border-blue-200 bg-white shadow-xs p-1 shrink-0"
                    />
                    <div className="text-xs space-y-1.5 text-slate-700">
                      <p><b>Chủ tài khoản:</b> <span className="text-blue-700 font-bold">TRAN KHANH DONG</span></p>
                      <p><b>Ngân hàng:</b> MB Bank (Ngân hàng Quân Đội)</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span>Số tài khoản: <b>[Đã bảo mật theo yêu cầu]</b></span>
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        Sau khi bấm Xác nhận đặt hàng, màn hình thanh toán chi tiết kèm hướng dẫn và nút xác nhận sẽ xuất hiện.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.paymentMethod === 'CARD'
                    ? 'border-orange-600 bg-orange-50/40'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={formData.paymentMethod === 'CARD'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <CreditCard size={16} className="text-purple-600" />
                    Thẻ ATM / Thẻ tín dụng Quốc tế (Visa, Mastercard)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hỗ trợ cổng thanh toán bảo mật tiêu chuẩn quốc tế PCI-DSS.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Items Preview & Final Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Sản Phẩm Đặt Mua ({cartItems.length})
          </h4>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map(item => (
              <div key={item.productId} className="flex items-center gap-3 text-xs">
                <img src={item.thumbnail} alt={item.name} className="w-12 h-12 rounded-lg bg-slate-50 p-1 object-contain shrink-0 border" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                  <p className="text-slate-400 text-[11px]">SL: {item.quantity} x {item.price.toLocaleString('vi-VN')}đ</p>
                </div>
                <span className="font-bold text-slate-800 shrink-0">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-4 border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính tiền hàng:</span>
              <span className="font-semibold text-slate-900">{subtotal.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? <b className="text-emerald-600">Miễn phí</b> : `${shippingFee.toLocaleString('vi-VN')} đ`}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Voucher giảm giá ({appliedVoucher?.code}):</span>
                <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
              <span className="text-xl font-black text-orange-600">
                {totalAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span>Đang tạo đơn hàng...</span>
            ) : (
              <>
                <span>Xác Nhận Đặt Hàng Ngay</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Thông tin đặt hàng được bảo vệ & mã hóa</span>
          </div>
        </div>
      </form>
    </div>
  );
}
