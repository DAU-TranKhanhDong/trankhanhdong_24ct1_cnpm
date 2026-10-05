import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, Calendar, DollarSign } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function AdminPromotions() {
  const { promotions, addPromotion, togglePromotionStatus, deletePromotion } = useProducts();
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    discountType: 'fixed',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    expiryDate: '2026-12-31',
    usageLimit: 500
  });

  const handleOpenAdd = () => {
    setFormData({
      code: '',
      title: '',
      discountType: 'fixed',
      discountValue: '',
      minOrderValue: 500000,
      maxDiscount: '',
      expiryDate: '2026-12-31',
      usageLimit: 500
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discountValue) {
      setToast({ type: 'error', message: 'Vui lòng nhập đầy đủ mã và giá trị giảm!' });
      return;
    }
    addPromotion(formData);
    setIsModalOpen(false);
    setToast({ type: 'success', message: `Đã tạo mã giảm giá ${formData.code.toUpperCase()} thành công!` });
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản Lý Khuyến Mãi & Voucher</h1>
          <p className="text-xs text-slate-500 mt-1">Tạo mã ưu đãi toàn sàn cho khách hàng áp dụng khi thanh toán</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all self-start"
        >
          <Plus size={16} /> Tạo Mã Khuyến Mãi Mới
        </button>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {promotions.map(promo => {
          const isActive = promo.status === 'active';

          return (
            <div
              key={promo.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3 transition-all ${
                isActive ? 'border-purple-200' : 'border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg">
                  {promo.code}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isActive ? 'Đang hiệu lực' : 'Đã dừng'}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{promo.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Giảm:{' '}
                  <b>
                    {promo.discountType === 'percentage'
                      ? `${promo.discountValue}% (tối đa ${promo.maxDiscount.toLocaleString('vi-VN')}đ)`
                      : `${promo.discountValue.toLocaleString('vi-VN')} đ`}
                  </b>
                </p>
                <p className="text-[11px] text-slate-400">
                  Đơn tối thiểu: {promo.minOrderValue.toLocaleString('vi-VN')} đ
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>HSD: {promo.expiryDate}</span>
                <span>Đã dùng: {promo.usedCount}/{promo.usageLimit}</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => togglePromotionStatus(promo.id)}
                  className="text-xs font-semibold text-purple-600 hover:underline"
                >
                  {isActive ? 'Tạm dừng' : 'Kích hoạt lại'}
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => deletePromotion(promo.id)}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Xóa mã
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Voucher */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Tạo Mã Giảm Giá Mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã code (Viết hoa) *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="VD: GIADUNG2026"
                    className="w-full p-2.5 border border-slate-200 rounded-xl uppercase font-mono font-bold outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loại giảm giá *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                  >
                    <option value="fixed">Tiền mặt cố định (VNĐ)</option>
                    <option value="percentage">Phần trăm (%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả hiển thị cho khách *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Giảm ngay 100.000đ cho đơn từ 1 triệu"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giá trị giảm *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder="VD: 50000 hoặc 10"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đơn hàng tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    placeholder="VD: 500000"
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày hết hạn</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giới hạn số lượt dùng</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  Tạo Mã Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
