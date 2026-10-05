import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, Image, Sparkles } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { CATEGORIES, BRANDS } from '../../data/mockData';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function SellerProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'bep',
    brand: 'Philips',
    price: '',
    originalPrice: '',
    stock: '',
    thumbnail: '',
    description: '',
    warrantyMonths: 12,
    featured: false
  });

  const filteredProducts = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchName && matchCategory;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'bep',
      brand: 'Philips',
      price: '',
      originalPrice: '',
      stock: 10,
      thumbnail: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
      description: '',
      warrantyMonths: 12,
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      category: p.category,
      brand: p.brand,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stock: p.stock,
      thumbnail: p.thumbnail,
      description: p.description,
      warrantyMonths: p.warrantyMonths || 12,
      featured: Boolean(p.featured)
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
      deleteProduct(id);
      setToast({ type: 'info', message: 'Đã xóa sản phẩm thành công' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stock: Number(formData.stock),
        warrantyMonths: Number(formData.warrantyMonths)
      });
      setToast({ type: 'success', message: 'Cập nhật sản phẩm thành công!' });
    } else {
      addProduct(formData);
      setToast({ type: 'success', message: 'Đã thêm sản phẩm mới vào gian hàng!' });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản Lý Sản Phẩm Gia Dụng</h1>
          <p className="text-xs text-slate-500 mt-1">Đăng bán, cập nhật giá và thông số kỹ thuật</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all self-start"
        >
          <Plus size={16} /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm theo tên..."
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
          />
          <Search size={15} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
        >
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Sản phẩm</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Giá bán</th>
                <th className="p-4">Tồn kho</th>
                <th className="p-4">Đã bán</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={p.thumbnail}
                      alt={p.name}
                      className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-slate-800 line-clamp-1 max-w-xs">{p.name}</span>
                      <span className="text-[11px] text-slate-400">{p.brand} • BH {p.warrantyMonths}T</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-600 capitalize">{p.category}</td>
                  <td className="p-4 font-bold text-orange-600">{p.price.toLocaleString('vi-VN')} đ</td>
                  <td className="p-4 font-semibold">
                    {p.stock === 0 ? (
                      <span className="text-rose-600">Hết hàng (0)</span>
                    ) : p.stock <= 5 ? (
                      <span className="text-amber-600">Sắp hết ({p.stock})</span>
                    ) : (
                      <span className="text-emerald-600">{p.stock}</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500">{p.soldCount}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Mới Sản Phẩm Gia Dụng'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Nồi chiên không dầu Philips HD9650 7.2L"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Danh mục *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thương hiệu *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                  >
                    {BRANDS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giá bán hiện tại (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giá gốc niêm yết (VNĐ)</label>
                  <input
                    type="number"
                    min="1000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số lượng tồn kho ban đầu *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link ảnh thumbnail *</label>
                  <input
                    type="url"
                    required
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thời gian bảo hành (tháng)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.warrantyMonths}
                    onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tính năng nổi bật, công nghệ chống dính, tiết kiệm điện năng..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="text-blue-600 rounded"
                />
                <label htmlFor="featured" className="font-semibold text-slate-700 cursor-pointer">
                  Đánh dấu là Sản phẩm nổi bật (Hiển thị trang chủ)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  {editingId ? 'Cập Nhật' : 'Lưu Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
