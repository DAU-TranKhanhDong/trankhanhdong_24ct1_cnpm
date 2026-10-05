import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Ticket, Check, ShieldAlert } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function CartPage() {
  const {
    cartItems,
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    appliedVoucher,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyVoucher,
    removeVoucher
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyVoucher(couponInput);
    if (res.success) {
      setToast({ type: 'success', message: res.message });
      setCouponInput('');
    } else {
      setToast({ type: 'error', message: res.message });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Chưa có món đồ gia dụng nào được thêm vào giỏ. Hãy dạo một vòng và lựa chọn những thiết bị tiện nghi cho tổ ấm của bạn nhé!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all"
        >
          Mua sắm ngay <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShoppingBag className="text-orange-600" />
          Giỏ Hàng Của Bạn ({cartItems.length} loại sản phẩm)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
        >
          <Trash2 size={13} /> Xóa toàn bộ giỏ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.productId} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl bg-slate-50 p-2 shrink-0 border border-slate-100"
                />

                <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                  <Link to={`/products/${item.productId}`}>
                    <h3 className="text-sm font-semibold text-slate-800 hover:text-orange-600 line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs font-black text-orange-600">
                    {item.price.toLocaleString('vi-VN')} đ
                  </p>
                  {item.stock <= 5 && (
                    <p className="text-[11px] text-amber-600 font-medium">Chỉ còn {item.stock} cái trong kho</p>
                  )}
                </div>

                {/* Quantity Control */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.stock)}
                    className="p-1.5 hover:bg-slate-200 text-slate-600"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.stock)}
                    disabled={item.quantity >= item.stock}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 disabled:opacity-40"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Subtotal for Item */}
                <div className="text-right shrink-0 min-w-[100px]">
                  <p className="text-sm font-black text-slate-900">
                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                  </p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-xs text-rose-500 hover:text-rose-700 mt-1 inline-flex items-center gap-0.5"
                  >
                    <Trash2 size={12} /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Voucher */}
        <div className="space-y-6">
          {/* Voucher Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket size={16} className="text-orange-600" />
              Mã Giảm Giá / Voucher
            </h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="VD: GIADUNG50K, FREESHIP"
                className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none uppercase font-semibold focus:border-orange-500"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
              >
                Áp dụng
              </button>
            </form>

            {appliedVoucher && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-800">
                <span className="font-semibold">Mã: {appliedVoucher.code} (-{discountAmount.toLocaleString('vi-VN')}đ)</span>
                <button
                  onClick={removeVoucher}
                  className="text-rose-600 hover:underline font-bold text-[11px]"
                >
                  Gỡ bỏ
                </button>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Chi Tiết Thanh Toán
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính hàng hóa:</span>
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
                  <span>Giảm giá khuyến mãi:</span>
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
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-orange-500/20 transition-all"
            >
              Tiến Hành Đặt Hàng <ArrowRight size={16} />
            </button>

            <Link
              to="/products"
              className="block text-center text-xs text-slate-500 hover:text-orange-600"
            >
              ← Tiếp tục mua sắm thêm sản phẩm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
