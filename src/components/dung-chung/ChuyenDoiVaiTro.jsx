import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Store, UserCheck, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoleSwitcher() {
  const { currentUser, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = (role) => {
    switchRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'seller') navigate('/seller');
    else navigate('/');
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sticky top-0 z-50 border-b border-slate-800 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-end gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Chuyển vai trò:</span>

          <button
            onClick={() => handleSwitch('customer')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all font-medium ${
              currentUser?.role === 'customer'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <UserCheck size={13} />
            Khách hàng
          </button>

          <button
            onClick={() => handleSwitch('seller')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all font-medium ${
              currentUser?.role === 'seller'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Store size={13} />
            Người bán
          </button>

          <button
            onClick={() => handleSwitch('admin')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all font-medium ${
              currentUser?.role === 'admin'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Shield size={13} />
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}
