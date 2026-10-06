import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, UserCheck, Shield, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function LoginPage() {
  const { login, loginAsAdmin, loginAsCustomer } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      setToast({ type: 'success', message: `Chào mừng ${res.user.name}!` });
      setTimeout(() => {
        if (res.user.role === 'admin') navigate('/admin');
        else if (res.user.role === 'seller') navigate('/seller');
        else navigate('/');
      }, 400);
    } else {
      setToast({ type: 'error', message: res.message });
    }
  };

  const handleQuickAdmin = () => {
    setEmail('admin@gmail.com');
    setPassword('123');
    const res = loginAsAdmin();
    if (res.success) {
      setToast({ type: 'success', message: 'Đăng nhập thành công với quyền Quản Trị Viên (Admin)!' });
      setTimeout(() => navigate('/admin'), 400);
    }
  };

  const handleQuickCustomer = () => {
    setEmail('khachhang@gmail.com');
    setPassword('123');
    const res = loginAsCustomer();
    if (res.success) {
      setToast({ type: 'success', message: 'Đăng nhập thành công với tài khoản Khách Hàng!' });
      setTimeout(() => navigate('/'), 400);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-lg w-full space-y-6 bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xl">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
            <ShoppingBag size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Đăng Nhập Tài Khoản</h2>
          <p className="text-xs text-slate-500">Truy cập hệ thống mua sắm & quản lý đồ gia dụng GiaDụngSmart</p>
        </div>

        {/* Thẻ Tài Khoản Admin Luôn Có Sẵn */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 sm:p-5 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-purple-200">
              <Shield size={16} className="text-amber-400" />
              Tài Khoản Admin Luôn Có Sẵn
            </span>
            <span className="text-[10px] font-extrabold bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full uppercase">
              Tất Cả Mọi Quyền
            </span>
          </div>

          <div className="bg-black/30 rounded-xl p-3 text-xs space-y-1 font-mono text-purple-100 border border-purple-500/30">
            <p>Email: <b className="text-white">admin@gmail.com</b></p>
            <p>Mật khẩu: <b className="text-white">123</b></p>
          </div>

          <div className="text-[11px] text-purple-200 leading-tight">
            ⚡ <b>Đặc quyền Admin:</b> Quản lý toàn bộ người dùng, thêm/sửa/xóa sản phẩm, duyệt đơn hàng và doanh thu. Khách hàng thường không có các quyền này.
          </div>

          <button
            type="button"
            onClick={handleQuickAdmin}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Đăng Nhập Nhanh Bằng Tài Khoản Admin</span>
          </button>
        </div>

        {/* Nút đăng nhập khách mẫu để so sánh */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 flex items-center gap-1">
              <UserCheck size={14} className="text-orange-600" />
              Tài khoản Khách Hàng mẫu:
            </p>
            <p className="text-[11px] text-slate-500 font-mono truncate">khachhang@gmail.com / 123 (Chỉ quyền mua hàng)</p>
          </div>
          <button
            type="button"
            onClick={handleQuickCustomer}
            className="px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
          >
            Đăng nhập Khách
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] text-slate-400 font-medium uppercase shrink-0">
            Hoặc nhập thông tin đăng nhập
          </span>
        </div>

        {/* Form đăng nhập tự do */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email đăng nhập:</label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com hoặc email của bạn..."
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu:</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-orange-500/20 transition-all cursor-pointer"
          >
            Đăng Nhập Vào Hệ Thống <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-orange-600 hover:underline">
            Đăng ký tài khoản Khách Hàng mới
          </Link>
        </div>
      </div>
    </div>
  );
}
