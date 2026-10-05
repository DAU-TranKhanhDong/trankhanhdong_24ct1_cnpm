# 🛒 GiaDụngSmart - Website Thương Mại Điện Tử Đồ Gia Dụng Thông Minh

> Dự án website bán hàng đồ gia dụng chính hãng được xây dựng bằng **React 19**, **Vite**, **Tailwind CSS 4**, tích hợp đa vai trò (Khách hàng, Người bán, Quản trị viên) và phương thức thanh toán **Mã QR (VietQR MBBank)** bảo mật.

---

## 📐 Kiến Trúc Hệ Thống (System Architecture)

```mermaid
graph TD
    User([Người Dùng / Khách Hàng / Seller / Admin]) --> Router[React Router DOM v7]

    subgraph State Management [Tầng Quản Lý Trạng Thái - Context API]
        AuthContext[AuthContext - Quản lý Tài khoản & Phân quyền]
        ProductContext[ProductContext - Quản lý Sản phẩm & Tồn kho]
        CartContext[CartContext - Quản lý Giỏ hàng & Voucher]
        OrderContext[OrderContext - Quản lý Đơn hàng & Thanh toán]
    end

    Router --> AuthContext
    AuthContext --> ProductContext
    ProductContext --> CartContext
    CartContext --> OrderContext

    subgraph UI Modules [Phân Hệ Giao Diện Người Dùng]
        Customer[Khách Hàng: Trang Chủ, Chi Tiết SP, Giỏ Hàng, Thanh Toán, Tra Cứu Đơn]
        Seller[Người Bán: Thống Kê Doanh Thu, Quản Lý SP, Kho Hàng, Xử Lý Đơn]
        Admin[Quản Trị Viên: Giám Sát Người Dùng, Sản Phẩm, Toàn Bộ Đơn Hàng, Khuyến Mãi]
    end

    OrderContext --> Customer
    OrderContext --> Seller
    OrderContext --> Admin

    subgraph Payment Module [Cổng Thanh Toán]
        COD[Thanh toán COD khi nhận hàng]
        VietQR[Thanh toán VietQR MBBank - Napas 247]
        Card[Thẻ Quốc Tế / ATM Nội Địa]
    end

    Customer --> PaymentModule
```

---

## 💳 Quy Trình Thanh Toán Bằng Mã QR (VietQR MBBank)

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách Hàng
    participant Checkout as TrangThanhToan
    participant QRComp as KhungThanhToanVietQR
    participant OrderCtx as OrderContext
    participant Bank as App Ngân Hàng (MBBank/Napas)

    Customer->>Checkout: Chọn phương thức "Chuyển khoản VietQR"
    Checkout->>QRComp: Xem trước mã QR sạch (Đã ẩn số tài khoản bảo mật)
    Customer->>Checkout: Nhập địa chỉ & Bấm "Xác Nhận Đặt Hàng"
    Checkout->>OrderCtx: createOrder (Trạng thái: pending, unpaid)
    Checkout->>Customer: Điều hướng tới TrangDatHangThanhCong
    Customer->>Bank: Mở App Ngân hàng quét mã QR trên màn hình
    Bank-->>Customer: Tự động điền số tài khoản MBBank & tên TRAN KHANH DONG
    Customer->>Bank: Nhập số tiền & xác nhận chuyển khoản
    Customer->>QRComp: Bấm "Tôi Đã Chuyển Khoản Xong"
    QRComp->>OrderCtx: confirmPayment(orderId) -> Cập nhật paid
    QRComp-->>Customer: Hiển thị pháo hoa & thông báo ghi nhận thành công!
```

---

## 🗂 Cấu Trúc Thư Mục Dự Án (Project Structure)

```
24ct1.trankhanhdong/
├── public/                       # Tài nguyên tĩnh
│   ├── qr-card-clean.png         # Ảnh thẻ mã QR MBBank (bảo mật số tài khoản)
│   ├── qr-payment-clean.png      # Ảnh poster mã QR đầy đủ
│   └── favicon.svg               # Logo trang web
├── src/                          # Mã nguồn ứng dụng
│   ├── assets/                   # Hình ảnh minh họa & icon
│   ├── components/               # Các component giao diện
│   │   ├── dung-chung/           # Thành phần chung (Header, Footer, Toast, Navbar)
│   │   ├── khach-hang/           # Component khách hàng (KhungThanhToanVietQR, Thẻ SP)
│   │   ├── nguoi-ban/            # Layout & thanh điều hướng người bán (Seller)
│   │   └── quan-tri/             # Layout & sidebar quản trị viên (Admin)
│   ├── context/                  # Quản lý trạng thái toàn cục (Context API)
│   │   ├── AuthContext.jsx       # Đăng nhập, đăng ký, chuyển đổi vai trò
│   │   ├── CartContext.jsx       # Thêm/bớt giỏ hàng, áp mã giảm giá
│   │   ├── OrderContext.jsx      # Tạo đơn, duyệt đơn, xác nhận VietQR, bảo hành
│   │   └── ProductContext.jsx    # Tồn kho, phân loại danh mục, tìm kiếm
│   ├── data/
│   │   └── mockData.js           # Dữ liệu mẫu (Sản phẩm gia dụng, đơn hàng, user)
│   ├── pages/                    # Các trang hiển thị chính
│   │   ├── khach-hang/           # TrangChu, TrangSanPham, TrangThanhToan, TrangDatHangThanhCong...
│   │   ├── nguoi-ban/            # TongQuanNguoiBan, SanPhamNguoiBan, DonHangNguoiBan...
│   │   ├── quan-tri/             # TongQuanQuanTri, QuanLyNguoiDung, QuanLyDonHang...
│   │   └── xac-thuc/             # TrangDangNhap, TrangDangKy
│   ├── routes/
│   │   └── AppRoutes.jsx         # Khai báo tuyến đường & Route bảo vệ vai trò
│   ├── App.jsx                   # Component gốc gắn các Provider
│   ├── index.css                 # Phong cách Tailwind CSS 4
│   └── main.jsx                  # Điểm khởi chạy ứng dụng (Entry point)
├── server/                       # Backend Node.js / Express (Tùy chọn)
│   ├── src/                      # API router, controllers
│   ├── database.sql              # Kịch bản cơ sở dữ liệu SQL
│   └── package.json              # Cấu hình backend server
├── index.html                    # Tệp HTML mẫu Vite
├── package.json                  # Cấu hình thư viện và scripts frontend
├── vite.config.js                # Cấu hình Vite React & Tailwind
├── netlify.toml                  # Cấu hình build & redirect cho Netlify/Vercel
└── README.md                     # Tài liệu kiến trúc dự án
```

---

## ⚡ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend Core:** [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Payment Integration:** VietQR Napas 247 (MBBank)
- **Backend (Optional):** Node.js, Express, MySQL/PostgreSQL

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy máy chủ phát triển:**
   ```bash
   npm run dev
   ```

3. **Kiểm tra và đóng gói sản phẩm:**
   ```bash
   npm run build
   npm run preview
   ```
