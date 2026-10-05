import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('app_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map(u => u.id === 'usr_customer' ? { ...u, name: 'Trần Khánh Đông' } : u);
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('app_current_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.id === 'usr_customer') {
        return { ...parsed, name: 'Trần Khánh Đông' };
      }
      return parsed;
    }
    return INITIAL_USERS.find(u => u.role === 'customer');
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
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) {
      return { success: false, message: 'Email hoặc mật khẩu không chính xác' };
    }
    if (found.status === 'blocked') {
      return { success: false, message: 'Tài khoản này đã bị khóa bởi Quản trị viên' };
    }
    setCurrentUser(found);
    return { success: true, user: found };
  };

  // Đăng ký tài khoản khách hàng mới
  const register = (data) => {
    const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Email này đã được sử dụng' };
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      address: data.address || '',
      role: data.role || 'customer',
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

  // Đổi vai trò nhanh (phục vụ kiểm thử demo ngay lập tức)
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
      register,
      logout,
      switchRole,
      updateProfile,
      toggleUserStatus,
      isAdmin: currentUser?.role === 'admin',
      isSeller: currentUser?.role === 'seller',
      isCustomer: currentUser?.role === 'customer',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
