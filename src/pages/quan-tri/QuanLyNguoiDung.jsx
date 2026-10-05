import React, { useState } from 'react';
import { Users, Shield, Lock, Unlock, Search, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/dung-chung/ThongBaoToast';

export default function AdminUsers() {
  const { users, toggleUserStatus } = useAuth();
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleToggle = (userId, currentStatus, name) => {
    toggleUserStatus(userId);
    const next = currentStatus === 'active' ? 'khóa' : 'mở khóa';
    setToast({ type: 'info', message: `Đã ${next} tài khoản "${name}"` });
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản Lý Tài Khoản Người Dùng</h1>
        <p className="text-xs text-slate-500 mt-1">Phân quyền, kiểm soát truy cập và khóa tài khoản vi phạm</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
          />
          <Search size={15} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="customer">Khách hàng</option>
          <option value="seller">Người bán hàng</option>
          <option value="admin">Quản trị viên</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Người dùng</th>
                <th className="p-4">Số điện thoại</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Ngày tham gia</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">{u.name}</p>
                      <p className="text-slate-400 text-[11px]">{u.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{u.phone || 'Chưa cập nhật'}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : u.role === 'seller'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{u.createdAt}</td>
                  <td className="p-4">
                    {u.status === 'blocked' ? (
                      <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                        Đã khóa
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        Hoạt động
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggle(u.id, u.status, u.name)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                          u.status === 'blocked'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        {u.status === 'blocked' ? 'Mở khóa' : 'Khóa tài khoản'}
                      </button>
                    )}
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
