import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/mockData';

// Tài khoản Quản trị viên (Admin) luôn có sẵn trên hệ thống
export const DEFAULT_ADMIN = {
  id: 'usr_admin',
  name: 'Quản Trị Viên (Admin Hệ Thống)',
  email: 'admin@gmail.com',
  password: '123',
  role: 'admin',
  phone: '0901234567',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'active',
  createdAt: '2026-01-01',
};

// Tài khoản khách hàng mẫu
export const DEFAULT_CUSTOMER = {
  id: 'usr_customer',
  name: 'Trần Khánh Đông',
  email: 'khachhang@gmail.com',
  password: '123',
  role: 'customer',
  phone: '0987654321',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  status: 'active',
  address: 'Số 45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  createdAt: '2026-02-15',
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('app_users');
    let list = saved ? JSON.parse(saved) : INITIAL_USERS;
    
    // Luôn đảm bảo tài khoản Admin tồn tại trong danh sách
    const hasAdmin = list.some(u => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() && u.role === 'admin');
    if (!hasAdmin) {
      list = [DEFAULT_ADMIN, ...list];
    } else {
      // Đảm bảo mật khẩu admin luôn đúng là 123 và trạng thái active
      list = list.map(u => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() ? { ...u, role: 'admin', password: '123', status: 'active' } : u);
    }
    return list;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('app_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id === 'usr_customer') {
          return { ...parsed, name: 'Trần Khánh Đông' };
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    // Mặc định ban đầu chưa đăng nhập để người dùng thấy rõ nút Đăng nhập / Đăng ký
    return null;
  });

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('app_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('app_current_user');
    }
  }, [currentUser]);

  // Đăng nhập
  const login = (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    // Cho phép đăng nhập nhanh admin bằng "admin" hoặc "admin@gmail.com" với pass 123
    const isQuickAdmin = (cleanEmail === 'admin' || cleanEmail === 'admin@gmail.com') && (password === '123' || password === 'admin');
    if (isQuickAdmin) {
      const adminUser = users.find(u => u.role === 'admin') || DEFAULT_ADMIN;
      setCurrentUser(adminUser);
      return { success: true, user: adminUser };
    }

    const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
    if (!found) {
      return { success: false, message: 'Email hoặc mật khẩu không chính xác' };
    }
    if (found.status === 'blocked') {
      return { success: false, message: 'Tài khoản này đã bị khóa bởi Quản trị viên' };
    }
    setCurrentUser(found);
    return { success: true, user: found };
  };

  // Đăng nhập 1-chạm vào Admin luôn sẵn sàng cho chủ máy
  const loginAsAdmin = () => {
    return login('admin@gmail.com', '123');
  };

  // Đăng nhập 1-chạm vào Khách hàng
  const loginAsCustomer = () => {
    const cust = users.find(u => u.role === 'customer') || DEFAULT_CUSTOMER;
    setCurrentUser(cust);
    return { success: true, user: cust };
  };

  // Đăng ký tài khoản mới: KHÁCH HÀNG CHỈ CÓ QUYỀN CUSTOMER
  const register = (data) => {
    const cleanEmail = data.email.toLowerCase().trim();
    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'Email này đã được sử dụng' };
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      phone: data.phone?.trim() || '',
      address: data.address?.trim() || '',
      role: 'customer', // Luôn chỉ là khách hàng, không thể tự nhận quyền admin
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Đăng xuất
  const logout = () => {
    setCurrentUser(null);
  };

  // Đổi vai trò
  const switchRole = (role) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  // Cập nhật thông tin profile
  const updateProfile = (updatedData) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updatedData };
      setUsers(all => all.map(u => u.id === updated.id ? updated : u));
      return updated;
    });
  };

  // Admin quản lý người dùng
  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        // Không cho phép khóa tài khoản Admin
        if (u.role === 'admin') return u;
        const nextStatus = u.status === 'active' ? 'blocked' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      login,
      loginAsAdmin,
      loginAsCustomer,
      register,
      logout,
      switchRole,
      updateProfile,
      toggleUserStatus,
      isAdmin: currentUser?.role === 'admin',
      isSeller: currentUser?.role === 'seller',
      isCustomer: currentUser?.role === 'customer' || !currentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
