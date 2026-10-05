import React from 'react';
import { ShoppingBag, PhoneCall, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Policy Highlights */}
      <div className="border-b border-slate-800 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Giao hàng toàn quốc</p>
              <p className="text-xs text-slate-400">Nhanh chóng trong 24h - 48h</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Chính hãng 100%</p>
              <p className="text-xs text-slate-400">Bảo hành lên tới 36 tháng</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Đổi trả dễ dàng</p>
              <p className="text-xs text-slate-400">7 ngày miễn phí đổi mới</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Giá tốt cam kết</p>
              <p className="text-xs text-slate-400">Nhiều ưu đãi & voucher sốc</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-lg font-black text-white">GiaDụng<span className="text-orange-500">Smart</span></span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hệ thống cung cấp thiết bị và đồ gia dụng thông minh chính hãng hàng đầu Việt Nam. Nâng tầm không gian sống cho mọi gia đình.
          </p>
          <div className="space-y-2 text-xs text-slate-400">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-orange-500 shrink-0" />
              Tòa nhà CNPM, Quận 1, TP. Hồ Chí Minh
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall size={14} className="text-orange-500 shrink-0" />
              1900 8888 - 0987 654 321
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} className="text-orange-500 shrink-0" />
              hotro@giadungsmart.vn
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Danh mục sản phẩm</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link to="/products?category=bep" className="hover:text-orange-400">Thiết bị nhà bếp</Link></li>
            <li><Link to="/products?category=lam-sach" className="hover:text-orange-400">Robot & Máy hút bụi</Link></li>
            <li><Link to="/products?category=khong-khi" className="hover:text-orange-400">Máy lọc không khí & Quạt</Link></li>
            <li><Link to="/products?category=dien-nha-tam" className="hover:text-orange-400">Bàn ủi hơi nước & Chăm sóc vải</Link></li>
            <li><Link to="/products?category=thong-minh" className="hover:text-orange-400">Gia dụng thông minh Smarthome</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Hỗ trợ khách hàng</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li><Link to="/orders" className="hover:text-orange-400">Tra cứu đơn hàng</Link></li>
            <li><a href="#policy" className="hover:text-orange-400">Chính sách bảo hành & đổi trả</a></li>
            <li><a href="#shipping" className="hover:text-orange-400">Phương thức thanh toán & Giao nhận</a></li>
            <li><a href="#guide" className="hover:text-orange-400">Hướng dẫn mua hàng online</a></li>
            <li><a href="#faq" className="hover:text-orange-400">Câu hỏi thường gặp (FAQ)</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Dành cho đối tác</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Đăng ký trở thành người bán hoặc đối tác phân phối thiết bị gia dụng cùng GiaDụngSmart.
          </p>
          <div className="space-y-2">
            <Link
              to="/seller"
              className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              Kênh Người Bán Hàng
            </Link>
            <Link
              to="/admin"
              className="inline-block w-full text-center bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-700 transition-colors"
            >
              Cổng Quản Trị Hệ Thống
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 GiaDụngSmart E-Commerce. Xây dựng bằng React & Tailwind CSS.</p>
          <p className="text-slate-400">Đồ án môn học Công Nghệ Phần Mềm (CNPM).</p>
        </div>
      </div>
    </footer>
  );
}
