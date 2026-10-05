import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { CATEGORIES, BRANDS } from '../../data/mockData';
import ProductCard from '../../components/khach-hang/TheSanPham';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function ProductsPage() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState(null);

  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentFilter = searchParams.get('filter') || ''; // 'hot' | 'promo'

  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState('all'); // all | under1m | 1m-3m | 3m-7m | over7m
  const [sortBy, setSortBy] = useState('popular'); // popular | price-asc | price-desc | rating

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Danh mục
      if (currentCategory !== 'all' && p.category !== currentCategory) {
        return false;
      }
      // Từ khóa tìm kiếm
      if (currentSearch.trim()) {
        const query = currentSearch.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        const matchDesc = p.description?.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchDesc) return false;
      }
      // Bộ lọc nhanh Hot / Promo
      if (currentFilter === 'hot' && !p.bestSeller && p.soldCount < 200) {
        return false;
      }
      if (currentFilter === 'promo' && (!p.originalPrice || p.originalPrice <= p.price)) {
        return false;
      }
      // Thương hiệu
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }
      // Khoảng giá
      if (priceRange === 'under1m' && p.price >= 1000000) return false;
      if (priceRange === '1m-3m' && (p.price < 1000000 || p.price > 3000000)) return false;
      if (priceRange === '3m-7m' && (p.price < 3000000 || p.price > 7000000)) return false;
      if (priceRange === 'over7m' && p.price < 7000000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.soldCount || 0) - (a.soldCount || 0); // popular default
    });
  }, [products, currentCategory, currentSearch, currentFilter, selectedBrand, priceRange, sortBy]);

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId === 'all') params.delete('category');
    else params.set('category', catId);
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSelectedBrand('all');
    setPriceRange('all');
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Danh Sách Đồ Gia Dụng</span>
            {currentCategory !== 'all' && (
              <span className="text-sm font-normal text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                {CATEGORIES.find(c => c.id === currentCategory)?.name}
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hiển thị <b>{filteredProducts.length}</b> sản phẩm phù hợp
            {currentSearch && ` với từ khóa "${currentSearch}"`}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={15} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Sắp xếp theo:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none cursor-pointer"
          >
            <option value="popular">Phổ biến / Bán chạy nhất</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="rating">Đánh giá sao cao nhất</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter size={16} className="text-orange-600" />
              Bộ Lọc Tìm Kiếm
            </span>
            {(selectedBrand !== 'all' || priceRange !== 'all' || currentCategory !== 'all' || currentSearch) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
              >
                <X size={12} /> Xóa lọc
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Nhóm sản phẩm</h4>
            <div className="space-y-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                    currentCategory === cat.id
                      ? 'bg-orange-500 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Khoảng giá</h4>
            <div className="space-y-2 text-xs">
              {[
                { id: 'all', label: 'Tất cả mức giá' },
                { id: 'under1m', label: 'Dưới 1.000.000đ' },
                { id: '1m-3m', label: '1.000.000đ - 3.000.000đ' },
                { id: '3m-7m', label: '3.000.000đ - 7.000.000đ' },
                { id: 'over7m', label: 'Trên 7.000.000đ' }
              ].map(pr => (
                <label key={pr.id} className="flex items-center gap-2.5 cursor-pointer text-slate-600 hover:text-slate-900">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === pr.id}
                    onChange={() => setPriceRange(pr.id)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span>{pr.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Thương hiệu</h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  selectedBrand === 'all'
                    ? 'bg-orange-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả
              </button>
              {BRANDS.map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    selectedBrand === b
                      ? 'bg-orange-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto">
                <Filter size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm nào</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Vui lòng thử xóa bớt bộ lọc giá, thương hiệu hoặc tìm kiếm với từ khóa khác.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Khôi phục tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCartSuccess={() => setToast({ type: 'success', message: `Đã thêm "${prod.name}" vào giỏ hàng!` })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
