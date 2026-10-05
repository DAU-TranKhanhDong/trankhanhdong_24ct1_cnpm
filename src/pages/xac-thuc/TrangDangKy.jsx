import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 'customer'
  });
  const [toast, setToast] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password.length < 3) {
      setToast({ type: 'error', message: 'Mật khẩu phải từ 3 ký tự trở lên' });
      return;
    }
    const res = register(formData);
    if (res.success) {
      setToast({ type: 'success', message: 'Đăng ký tài khoản thành công!' });
      setTimeout(() => {
        if (res.user.role === 'seller') navigate('/seller');
        else navigate('/');
      }, 500);
    } else {
      setToast({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
            <ShoppingBag size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Tạo Tài Khoản Mới</h2>
          <p className="text-xs text-slate-500">Trở thành thành viên hoặc đối tác bán hàng của GiaDụngSmart</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Loại tài khoản:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'customer' })}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                  formData.role === 'customer'
                    ? 'border-orange-600 bg-orange-50 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Khách Mua Hàng
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'seller' })}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                  formData.role === 'seller'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Người Bán Hàng
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Họ và tên / Tên cửa hàng *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nguyễn Văn A / Cửa Hàng Gia Dụng..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email đăng nhập *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@gmail.com"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0987654321"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mật khẩu *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Ít nhất 3 ký tự"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Địa chỉ mặc định:</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Số nhà, đường, phường, quận, TP..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-orange-500/20 transition-all cursor-pointer"
          >
            Tạo Tài Khoản <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-orange-600 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
