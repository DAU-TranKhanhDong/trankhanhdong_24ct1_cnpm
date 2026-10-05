import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Shield, Check, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    email: currentUser?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim()
    });
    setToast({ type: 'success', message: 'Cập nhật thông tin tài khoản thành công!' });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.oldPassword !== currentUser.password) {
      setToast({ type: 'error', message: 'Mật khẩu hiện tại không đúng!' });
      return;
    }
    if (passwordData.newPassword.length < 3) {
      setToast({ type: 'error', message: 'Mật khẩu mới phải từ 3 ký tự trở lên' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ type: 'error', message: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    updateProfile({ password: passwordData.newPassword });
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setToast({ type: 'success', message: 'Đổi mật khẩu tài khoản thành công!' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="text-orange-600" />
          Hồ Sơ & Địa Chỉ Nhận Hàng
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Quản lý thông tin tài khoản và địa chỉ giao hàng mặc định</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm h-fit">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-orange-100 shadow-md"
          />
          <div>
            <h3 className="text-base font-bold text-slate-800">{currentUser?.name}</h3>
            <p className="text-xs text-slate-400">{currentUser?.email}</p>
            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
              Vai trò: {currentUser?.role}
            </span>
          </div>
        </div>

        {/* Update Form & Password */}
        <div className="md:col-span-2 space-y-8">
          {/* Info Form */}
          <form onSubmit={handleUpdateInfo} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              Thông tin liên lạc & Địa chỉ
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên:</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Đăng nhập):</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full text-xs p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại:</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ nhận hàng mặc định:</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Lưu Thay Đổi
            </button>
          </form>

          {/* Change password */}
          <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Lock size={16} className="text-orange-600" />
              Đổi Mật Khẩu
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  required
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  placeholder="Nhập mật khẩu hiện tại (demo: 123)"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới:</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nhập lại mật khẩu mới:</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Cập Nhật Mật Khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
