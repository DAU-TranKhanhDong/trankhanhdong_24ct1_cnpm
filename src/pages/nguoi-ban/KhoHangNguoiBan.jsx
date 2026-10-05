import React, { useState } from 'react';
import { Boxes, AlertTriangle, CheckCircle, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function SellerInventory() {
  const { products, updateStock } = useProducts();
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStock, setEditingStock] = useState({});

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockChange = (productId, val) => {
    setEditingStock(prev => ({ ...prev, [productId]: val }));
  };

  const handleSaveStock = (productId) => {
    const newQty = editingStock[productId];
    if (newQty === undefined || newQty === '') return;
    updateStock(productId, Number(newQty));
    setToast({ type: 'success', message: 'Đã cập nhật số lượng tồn kho thành công!' });
    setEditingStock(prev => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const handleQuickAdjust = (productId, currentStock, delta) => {
    const nextVal = Math.max(0, currentStock + delta);
    updateStock(productId, nextVal);
    setToast({ type: 'info', message: `Đã cập nhật tồn kho: ${nextVal} cái` });
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản Lý Tồn Kho Sản Phẩm</h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi trạng thái <b>Còn hàng</b>, <b>Sắp hết hàng</b> (≤5), <b>Hết hàng</b> (0) và tự động trừ kho khi xác nhận đơn
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm theo tên hoặc hãng..."
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
          />
          <Search size={15} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Sản phẩm</th>
                <th className="p-4">Hãng</th>
                <th className="p-4">Tình trạng kho</th>
                <th className="p-4">Số lượng tồn</th>
                <th className="p-4">Điều chỉnh nhanh</th>
                <th className="p-4 text-right">Nhập số lượng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(p => {
                const isOut = p.stock <= 0;
                const isLow = p.stock > 0 && p.stock <= 5;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.thumbnail} alt={p.name} className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1 border shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800 line-clamp-1 max-w-xs">{p.name}</p>
                        <p className="text-[11px] text-slate-400">Giá bán: {p.price.toLocaleString('vi-VN')} đ</p>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{p.brand}</td>
                    <td className="p-4">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[11px]">
                          ● Hết hàng
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                          ● Sắp hết hàng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                          ● Còn hàng
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-black text-slate-800">
                      {p.stock} <span className="text-xs font-normal text-slate-400">cái</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleQuickAdjust(p.id, p.stock, 5)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded text-[11px]"
                          title="Nhập thêm 5 cái"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(p.id, p.stock, 10)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded text-[11px]"
                          title="Nhập thêm 10 cái"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(p.id, p.stock, -1)}
                          disabled={p.stock <= 0}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2 py-1 rounded text-[11px] disabled:opacity-40"
                          title="Giảm 1 cái"
                        >
                          -1
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <input
                          type="number"
                          min="0"
                          value={editingStock[p.id] !== undefined ? editingStock[p.id] : p.stock}
                          onChange={(e) => handleStockChange(p.id, e.target.value)}
                          className="w-16 p-1.5 border border-slate-200 rounded-lg text-center font-bold text-xs bg-slate-50 focus:bg-white outline-none"
                        />
                        {editingStock[p.id] !== undefined && editingStock[p.id] !== p.stock && (
                          <button
                            onClick={() => handleSaveStock(p.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs"
                          >
                            Lưu
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
