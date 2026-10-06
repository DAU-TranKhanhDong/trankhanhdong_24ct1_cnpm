import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AccessDeniedPage() {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLoginAdmin = () => {
    const res = login('admin@gmail.com', '123');
    if (res.success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 text-center shadow-xl space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner animate-pulse">
          <ShieldAlert size={42} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            403 - Giới Hạn Quyền Truy Cập
          </span>
          <h1 className="text-2xl font-black text-slate-900">
            Khu Vực Quản Trị Hệ Thống
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bạn hiện đang đăng nhập với vai trò <b className="text-orange-600 uppercase">[{currentUser?.role || 'Khách Hàng'}]</b>.
            Tài khoản này <b>không có quyền</b> truy cập trang quản trị.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 text-slate-600">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <Shield size={14} className="text-purple-600" />
            Tài khoản Admin luôn có sẵn trên máy:
          </p>
          <div className="space-y-1 font-mono text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
            <p>Email: <b className="text-purple-700">admin@gmail.com</b></p>
            <p>Mật khẩu: <b className="text-purple-700">123</b></p>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            Chỉ tài khoản Quản Trị Viên mới có tất cả mọi quyền quản lý người dùng, sản phẩm, đơn hàng và doanh thu.
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleQuickLoginAdmin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            <Lock size={15} />
            Đăng Nhập Nhanh Tài Khoản Admin
          </button>

          <Link
            to="/"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={15} />
            Quay Về Trang Mua Sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
