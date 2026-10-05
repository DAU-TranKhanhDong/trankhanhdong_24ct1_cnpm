import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, ShieldCheck, Truck, Headphones, Ticket, Check } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { CATEGORIES } from '../../data/mockData';
import ProductCard from '../../components/khach-hang/TheSanPham';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function HomePage() {
  const { products, promotions } = useProducts();
  const [toast, setToast] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const bestSellers = products.filter(p => p.bestSeller || p.soldCount > 300).slice(0, 4);

  const handleCopyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setToast({ type: 'success', message: `Đã sao chép mã ${code} vào bộ nhớ tạm!` });
    setTimeout(() => setCopiedCode(''), 3000);
  };

  return (
    <div className="space-y-12 pb-16">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-xl space-y-5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase border border-white/30">
              <Sparkles size={14} className="text-yellow-300" />
              Đại tiệc công nghệ gia dụng 2026
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Nâng Tầm Không Gian Sống <br className="hidden sm:inline" />
              <span className="text-yellow-300">Tiện Nghi & Hiện Đại</span>
            </h1>
            <p className="text-orange-100 text-sm sm:text-base leading-relaxed">
              Khám phá hàng trăm thiết bị nhà bếp, robot hút bụi và đồ gia dụng thông minh chính hãng. Cam kết chất lượng, bảo hành 1 đổi 1 tới 36 tháng.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Link
                to="/products"
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 text-sm flex items-center gap-2"
              >
                Khám phá ngay <ArrowRight size={16} />
              </Link>
              <Link
                to="/products?filter=hot"
                className="bg-orange-800/60 hover:bg-orange-800/80 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 text-sm backdrop-blur-sm transition-colors"
              >
                Xem Flash Sale
              </Link>
            </div>
          </div>

          <div className="relative w-full md:w-1/2 flex justify-center">
            <div className="relative w-72 h-72 sm:w-88 sm:h-88">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full filter blur-3xl animate-pulse"></div>
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
                alt="Thiết bị nhà bếp thông minh"
                className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white/20"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-800 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
                  %
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Ưu đãi hôm nay</p>
                  <p className="text-sm font-black text-orange-600">Giảm thêm 200.000đ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Danh mục đồ gia dụng</h2>
          <Link to="/products" className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group p-4 bg-white rounded-2xl border border-slate-100 hover:border-orange-300 hover:shadow-lg transition-all text-center flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 group-hover:bg-orange-500 text-orange-600 group-hover:text-white flex items-center justify-center transition-colors">
                <Sparkles size={24} />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-orange-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Voucher codes section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/60 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-wide">
                <Ticket size={18} />
                Mã Giảm Giá Đang Diễn Ra
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Thu thập voucher giảm giá trực tiếp vào đơn hàng của bạn</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-xl p-4 border border-dashed border-orange-300 flex items-center justify-between gap-3 shadow-sm hover:border-orange-500 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    {promo.code}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{promo.title}</p>
                  <p className="text-[11px] text-slate-400">
                    HSD: {promo.expiryDate}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyVoucher(promo.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1 ${
                    copiedCode === promo.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check size={13} /> Đã lưu
                    </>
                  ) : (
                    'Lấy mã'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale / Bán Chạy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <Flame size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Sản Phẩm Bán Chạy Nhất</h2>
              <p className="text-xs text-slate-500">Được hàng ngàn gia đình tin dùng và đánh giá cao</p>
            </div>
          </div>
          <Link to="/products?filter=hot" className="text-xs font-semibold text-orange-600 hover:underline">
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCartSuccess={() => setToast({ type: 'success', message: `Đã thêm "${prod.name}" vào giỏ hàng!` })}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Sản Phẩm Nổi Bật</h2>
              <p className="text-xs text-slate-500">Công nghệ tiên phong, nâng tầm chất lượng cuộc sống</p>
            </div>
          </div>
          <Link to="/products" className="text-xs font-semibold text-orange-600 hover:underline">
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCartSuccess={() => setToast({ type: 'success', message: `Đã thêm "${prod.name}" vào giỏ hàng!` })}
            />
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-400/10 px-3 py-1 rounded-full">
              Dịch vụ hậu mãi số 1
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">Cam Kết Bảo Hành & Hỗ Trợ Kỹ Thuật Tận Tâm</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Mọi sản phẩm gia dụng mua tại GiaDụngSmart đều được kích hoạt bảo hành điện tử chính hãng. Đổi mới miễn phí trong 7 ngày nếu có lỗi kỹ thuật từ nhà sản xuất.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <ShieldCheck className="text-emerald-400" size={18} />
                Bảo hành chính hãng
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Headphones className="text-blue-400" size={18} />
                Hỗ trợ 24/7
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              to="/products"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all"
            >
              Mua sắm an tâm ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
