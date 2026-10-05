import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, UserCheck, Store, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function LoginPage() {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'seller') navigate('/seller');
      else navigate('/');
    } else {
      setToast({ type: 'error', message: res.message });
    }
  };

  const handleQuickLogin = (role) => {
    switchRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'seller') navigate('/seller');
    else navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
            <ShoppingBag size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Đăng Nhập Tài Khoản</h2>
          <p className="text-xs text-slate-500">Truy cập mua sắm và quản lý bán hàng gia dụng</p>
        </div>

        {/* 3 Nút Đăng nhập vai trò */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => handleQuickLogin('customer')}
            type="button"
            className="p-2.5 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 rounded-xl font-semibold text-center transition-colors flex flex-col items-center gap-1 shadow-xs"
          >
            <UserCheck size={16} />
            <span>Khách Mua</span>
          </button>
          <button
            onClick={() => handleQuickLogin('seller')}
            type="button"
            className="p-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-xl font-semibold text-center transition-colors flex flex-col items-center gap-1 shadow-xs"
          >
            <Store size={16} />
            <span>Người Bán</span>
          </button>
          <button
            onClick={() => handleQuickLogin('admin')}
            type="button"
            className="p-2.5 bg-slate-50 hover:bg-purple-50 hover:text-purple-600 border border-slate-200 rounded-xl font-semibold text-center transition-colors flex flex-col items-center gap-1 shadow-xs"
          >
            <Shield size={16} />
            <span>Quản Trị</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email:</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="khachhang@gmail.com / seller@... / admin@..."
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
                placeholder="Mật khẩu mặc định: 123"
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-orange-500/20 transition-all cursor-pointer"
          >
            Đăng Nhập <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-orange-600 hover:underline">
            Đăng ký tài khoản mới ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
