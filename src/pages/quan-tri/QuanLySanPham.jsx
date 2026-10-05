import React, { useState } from 'react';
import { Layers, Search, Trash2, Eye, ShieldCheck, CheckCircle } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { CATEGORIES } from '../../data/mockData';
import Toast from '../../components/dung-chung/ThongBaoToast';
import { Link } from 'react-router-dom';

export default function AdminProducts() {
  const { products, deleteProduct, updateProduct } = useProducts();
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Xóa sản phẩm "${name}" khỏi toàn hệ thống sàn?`)) {
      deleteProduct(id);
      setToast({ type: 'info', message: 'Đã xóa sản phẩm khỏi sàn' });
    }
  };

  const handleToggleFeature = (p) => {
    updateProduct(p.id, { featured: !p.featured });
    setToast({
      type: 'success',
      message: p.featured ? 'Đã gỡ khỏi mục Nổi bật' : 'Đã đưa lên mục Sản phẩm Nổi bật'
    });
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Kiểm Soát Sản Phẩm Toàn Sàn</h1>
        <p className="text-xs text-slate-500 mt-1">Duyệt, kiểm tra chất lượng và xóa các mặt hàng vi phạm quy định</p>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên sản phẩm hoặc thương hiệu..."
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Sản phẩm gia dụng</th>
                <th className="p-4">Người bán (Shop)</th>
                <th className="p-4">Giá bán</th>
                <th className="p-4">Tồn kho</th>
                <th className="p-4">Nổi bật</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.thumbnail} alt={p.name} className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1 border shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1 max-w-sm">{p.name}</p>
                      <p className="text-[11px] text-slate-400">Hãng: {p.brand} • BH {p.warrantyMonths} tháng</p>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{p.sellerName || 'SmartHome Store'}</td>
                  <td className="p-4 font-bold text-orange-600">{p.price.toLocaleString('vi-VN')} đ</td>
                  <td className="p-4 font-semibold text-slate-700">{p.stock} cái</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleFeature(p)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        p.featured
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {p.featured ? '★ Nổi bật' : 'Bình thường'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      to={`/products/${p.id}`}
                      className="inline-block p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem trang sản phẩm"
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Gỡ bỏ sản phẩm"
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
    </div>
  );
}
