import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Common / Dung chung
import ThanhTieuDe from '../components/dung-chung/ThanhTieuDe';
import ThanhDieuHuong from '../components/dung-chung/ThanhDieuHuong';
import ChanTrang from '../components/dung-chung/ChanTrang';

// Customer Pages / Khach hang
import TrangChu from '../pages/khach-hang/TrangChu';
import TrangSanPham from '../pages/khach-hang/TrangSanPham';
import TrangChiTietSanPham from '../pages/khach-hang/TrangChiTietSanPham';
import TrangGioHang from '../pages/khach-hang/TrangGioHang';
import TrangThanhToan from '../pages/khach-hang/TrangThanhToan';
import TrangDatHangThanhCong from '../pages/khach-hang/TrangDatHangThanhCong';
import TrangLichSuDonHang from '../pages/khach-hang/TrangLichSuDonHang';
import TrangThongTinCaNhan from '../pages/khach-hang/TrangThongTinCaNhan';

// Auth Pages / Xac thuc
import TrangDangNhap from '../pages/xac-thuc/TrangDangNhap';
import TrangDangKy from '../pages/xac-thuc/TrangDangKy';

// Seller / Nguoi ban
import BoCucNguoiBan from '../components/nguoi-ban/BoCucNguoiBan';
import TongQuanNguoiBan from '../pages/nguoi-ban/TongQuanNguoiBan';
import SanPhamNguoiBan from '../pages/nguoi-ban/SanPhamNguoiBan';
import DonHangNguoiBan from '../pages/nguoi-ban/DonHangNguoiBan';
import KhoHangNguoiBan from '../pages/nguoi-ban/KhoHangNguoiBan';

// Admin / Quan tri
import BoCucQuanTri from '../components/quan-tri/BoCucQuanTri';
import TongQuanQuanTri from '../pages/quan-tri/TongQuanQuanTri';
import QuanLyNguoiDung from '../pages/quan-tri/QuanLyNguoiDung';
import QuanLySanPham from '../pages/quan-tri/QuanLySanPham';
import QuanLyDonHang from '../pages/quan-tri/QuanLyDonHang';
import QuanLyKhuyenMai from '../pages/quan-tri/QuanLyKhuyenMai';

// Layout cho Customer
const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ThanhTieuDe />
      <ThanhDieuHuong />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
      <ChanTrang />
    </div>
  );
};

// Route bảo vệ theo vai trò
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer public & private routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<TrangChu />} />
        <Route path="/products" element={<TrangSanPham />} />
        <Route path="/products/:id" element={<TrangChiTietSanPham />} />
        <Route path="/cart" element={<TrangGioHang />} />
        <Route path="/checkout" element={<TrangThanhToan />} />
        <Route path="/order-success/:orderId" element={<TrangDatHangThanhCong />} />
        <Route path="/orders" element={<TrangLichSuDonHang />} />
        <Route path="/profile" element={<TrangThongTinCaNhan />} />
        <Route path="/login" element={<TrangDangNhap />} />
        <Route path="/register" element={<TrangDangKy />} />
      </Route>

      {/* Seller Routes */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={['seller', 'admin']}>
            <BoCucNguoiBan />
          </ProtectedRoute>
        }
      >
        <Route index element={<TongQuanNguoiBan />} />
        <Route path="products" element={<SanPhamNguoiBan />} />
        <Route path="orders" element={<DonHangNguoiBan />} />
        <Route path="inventory" element={<KhoHangNguoiBan />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <BoCucQuanTri />
          </ProtectedRoute>
        }
      >
        <Route index element={<TongQuanQuanTri />} />
        <Route path="users" element={<QuanLyNguoiDung />} />
        <Route path="products" element={<QuanLySanPham />} />
        <Route path="orders" element={<QuanLyDonHang />} />
        <Route path="promotions" element={<QuanLyKhuyenMai />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
