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
    // Mới vào trang luôn KHÔNG tự động đăng nhập vào bất kỳ tài khoản nào cả
    try {
      // Dọn sạch dữ liệu tự động đăng nhập cũ còn lưu trong localStorage
      localStorage.removeItem('app_current_user');
      const sessionUser = sessionStorage.getItem('app_session_user');
      if (sessionUser) {
        return JSON.parse(sessionUser);
      }
    } catch (e) {
      return null;
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  // Tự động đồng bộ người dùng từ CSDL MySQL XAMPP khi khởi động
  useEffect(() => {
    const fetchUsersFromDB = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/v1/auth/users');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setUsers(prev => {
              const merged = [...prev];
              json.data.forEach(dbUser => {
                if (!merged.some(u => u.email.toLowerCase() === dbUser.email.toLowerCase())) {
                  merged.push({
                    id: `usr_${dbUser.id}`,
                    db_id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    phone: dbUser.phone || '',
                    address: dbUser.address || '',
                    role: dbUser.role || 'customer',
                    status: 'active',
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                    createdAt: dbUser.createdAt ? String(dbUser.createdAt).split('T')[0] : '2026-10-06'
                  });
                }
              });
              return merged;
            });
          }
        }
      } catch (e) {
        // MySQL backend chưa bật hoặc offline
      }
    };
    fetchUsersFromDB();
  }, []);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('app_session_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('app_session_user');
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

  // Đăng ký tài khoản mới: KHÁCH HÀNG CHỈ CÓ QUYỀN CUSTOMER (Tự động ghi vào CSDL MySQL XAMPP)
  const register = async (data) => {
    const cleanEmail = data.email.toLowerCase().trim();
    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'Email này đã được sử dụng' };
    }

    let newUser = {
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

    // Gửi yêu cầu lưu vào CSDL MySQL qua Backend API
    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          email: cleanEmail,
          password: data.password,
          phone: data.phone?.trim() || '',
          address: data.address?.trim() || ''
        })
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || 'Lỗi khi lưu vào CSDL MySQL' };
      }
      if (result.user) {
        newUser = { ...newUser, ...result.user };
      }
    } catch (err) {
      console.warn('⚠️ Backend chưa chạy hoặc lỗi mạng, lưu vào bộ nhớ tạm:', err.message);
    }

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
