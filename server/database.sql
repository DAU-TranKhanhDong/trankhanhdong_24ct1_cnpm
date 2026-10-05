-- ============================================================
-- DATABASE: Website Bán Hàng Đồ Gia Dụng
-- Tác giả  : Trần Khánh Đông
-- Ngày tạo : 2026-09-29
-- Mô tả    : Schema MySQL cho hệ thống thương mại điện tử
--             gồm: Users, Products, Orders, Reviews, Promotions
-- ============================================================

CREATE DATABASE IF NOT EXISTS gia_dung_shop
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gia_dung_shop;

-- ============================================================
-- BẢNG 1: NGƯỜI DÙNG (users)
-- Vai trò: admin | seller | customer
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(50)     NOT NULL PRIMARY KEY,
  name          VARCHAR(150)    NOT NULL,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  password      VARCHAR(255)    NOT NULL,
  role          ENUM('admin','seller','customer') NOT NULL DEFAULT 'customer',
  phone         VARCHAR(20),
  address       TEXT,
  avatar        TEXT,
  status        ENUM('active','blocked') NOT NULL DEFAULT 'active',
  -- Riêng cho seller
  shop_name     VARCHAR(200),
  rating        DECIMAL(3,2),
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 2: DANH MỤC SẢN PHẨM (categories)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id            VARCHAR(50)     NOT NULL PRIMARY KEY,
  name          VARCHAR(100)    NOT NULL,
  icon          VARCHAR(100),
  sort_order    INT             NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 3: THƯƠNG HIỆU (brands)
-- ============================================================
CREATE TABLE IF NOT EXISTS brands (
  id            INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)    NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 4: SẢN PHẨM (products)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id                VARCHAR(50)     NOT NULL PRIMARY KEY,
  name              VARCHAR(300)    NOT NULL,
  category_id       VARCHAR(50)     NOT NULL,
  brand_id          INT,
  seller_id         VARCHAR(50)     NOT NULL,
  price             DECIMAL(15,0)   NOT NULL,
  original_price    DECIMAL(15,0),
  stock             INT             NOT NULL DEFAULT 0,
  sold_count        INT             NOT NULL DEFAULT 0,
  rating            DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  rating_count      INT             NOT NULL DEFAULT 0,
  thumbnail         TEXT,
  description       TEXT,
  warranty_months   INT             NOT NULL DEFAULT 0,
  featured          TINYINT(1)      NOT NULL DEFAULT 0,
  best_seller       TINYINT(1)      NOT NULL DEFAULT 0,
  status            ENUM('active','inactive','out_of_stock') NOT NULL DEFAULT 'active',
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_product_brand    FOREIGN KEY (brand_id)    REFERENCES brands(id),
  CONSTRAINT fk_product_seller   FOREIGN KEY (seller_id)   REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 5: HÌNH ẢNH SẢN PHẨM (product_images)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id            INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id    VARCHAR(50)     NOT NULL,
  image_url     TEXT            NOT NULL,
  sort_order    INT             NOT NULL DEFAULT 0,

  CONSTRAINT fk_img_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 6: THÔNG SỐ KỸ THUẬT SẢN PHẨM (product_specifications)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_specifications (
  id            INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id    VARCHAR(50)     NOT NULL,
  spec_key      VARCHAR(200)    NOT NULL,
  spec_value    TEXT            NOT NULL,
  sort_order    INT             NOT NULL DEFAULT 0,

  CONSTRAINT fk_spec_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 7: MÃ KHUYẾN MÃI (promotions)
-- ============================================================
CREATE TABLE IF NOT EXISTS promotions (
  id              VARCHAR(50)     NOT NULL PRIMARY KEY,
  code            VARCHAR(50)     NOT NULL UNIQUE,
  title           VARCHAR(200)    NOT NULL,
  discount_type   ENUM('fixed','percentage') NOT NULL,
  discount_value  DECIMAL(15,2)   NOT NULL,
  min_order_value DECIMAL(15,0)   NOT NULL DEFAULT 0,
  max_discount    DECIMAL(15,0),
  expiry_date     DATE            NOT NULL,
  usage_limit     INT             NOT NULL DEFAULT 0,
  used_count      INT             NOT NULL DEFAULT 0,
  status          ENUM('active','inactive','expired') NOT NULL DEFAULT 'active',
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 8: ĐƠN HÀNG (orders)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                VARCHAR(50)     NOT NULL PRIMARY KEY,
  customer_id       VARCHAR(50)     NOT NULL,
  customer_name     VARCHAR(150)    NOT NULL,
  customer_phone    VARCHAR(20),
  shipping_address  TEXT            NOT NULL,
  payment_method    ENUM('COD','BANK_QR','CARD') NOT NULL DEFAULT 'COD',
  payment_status    ENUM('unpaid','paid')         NOT NULL DEFAULT 'unpaid',
  items_total       DECIMAL(15,0)   NOT NULL,
  shipping_fee      DECIMAL(15,0)   NOT NULL DEFAULT 0,
  discount_amount   DECIMAL(15,0)   NOT NULL DEFAULT 0,
  voucher_code      VARCHAR(50),
  total_amount      DECIMAL(15,0)   NOT NULL,
  status            ENUM('pending','confirmed','preparing','shipping','delivered','cancelled') NOT NULL DEFAULT 'pending',
  notes             TEXT,
  warranty_requested TINYINT(1)     NOT NULL DEFAULT 0,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_order_customer  FOREIGN KEY (customer_id)  REFERENCES users(id),
  CONSTRAINT fk_order_promotion FOREIGN KEY (voucher_code) REFERENCES promotions(code)
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 9: CHI TIẾT ĐƠN HÀNG (order_items)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id            INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id      VARCHAR(50)     NOT NULL,
  product_id    VARCHAR(50)     NOT NULL,
  product_name  VARCHAR(300)    NOT NULL,
  price         DECIMAL(15,0)   NOT NULL,
  quantity      INT             NOT NULL DEFAULT 1,
  thumbnail     TEXT,

  CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 10: TIMELINE ĐƠN HÀNG (order_timeline)
-- Lưu lịch sử trạng thái của từng đơn hàng
-- ============================================================
CREATE TABLE IF NOT EXISTS order_timeline (
  id            INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id      VARCHAR(50)     NOT NULL,
  status        VARCHAR(50)     NOT NULL,
  title         VARCHAR(200)    NOT NULL,
  event_time    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_timeline_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 11: ĐÁNH GIÁ SẢN PHẨM (reviews)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id            INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id    VARCHAR(50)     NOT NULL,
  order_id      VARCHAR(50),
  user_id       VARCHAR(50)     NOT NULL,
  user_name     VARCHAR(150)    NOT NULL,
  rating        TINYINT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_order   FOREIGN KEY (order_id)   REFERENCES orders(id),
  CONSTRAINT fk_review_user    FOREIGN KEY (user_id)    REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================
-- BẢNG 12: GIỎ HÀNG (cart_items)
-- Lưu giỏ hàng trên server (thay thế localStorage)
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id            INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id       VARCHAR(50)     NOT NULL,
  product_id    VARCHAR(50)     NOT NULL,
  quantity      INT             NOT NULL DEFAULT 1,
  added_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_cart (user_id, product_id),
  CONSTRAINT fk_cart_user    FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- DỮ LIỆU MẪU (SEED DATA)
-- ============================================================

-- ---- Người dùng ----
INSERT INTO users (id, name, email, password, role, phone, address, avatar, status, shop_name, rating, created_at) VALUES
('usr_admin',    'Quản Trị Viên (Admin)',       'admin@gmail.com',     '123', 'admin',    '0901234567', NULL,                                                                   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'active', NULL,                             NULL, '2026-01-01 00:00:00'),
('usr_seller',   'Gia Dụng SmartHome Store',    'seller@gmail.com',    '123', 'seller',   '0912345678', NULL,                                                                   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'active', 'Gia Dụng SmartHome Chính Hãng', 4.8,  '2026-01-10 00:00:00'),
('usr_customer', 'Trần Khánh Đông',             'khachhang@gmail.com', '123', 'customer', '0987654321', 'Số 45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'active', NULL,                             NULL, '2026-02-15 00:00:00');

-- ---- Danh mục ----
INSERT INTO categories (id, name, icon, sort_order) VALUES
('all',          'Tất cả sản phẩm',            'Sparkles', 0),
('bep',          'Thiết bị nhà bếp',           'Utensils', 1),
('lam-sach',     'Dọn dẹp & Làm sạch',         'Sparkle',  2),
('khong-khi',    'Không khí & Quạt',            'Wind',     3),
('dien-nha-tam', 'Thiết bị chăm sóc & Giặt ủi','Shirt',    4),
('thong-minh',   'Gia dụng thông minh',         'Cpu',      5);

-- ---- Thương hiệu ----
INSERT INTO brands (name) VALUES
('Philips'), ('Lock&Lock'), ('Sunhouse'), ('Panasonic'),
('Xiaomi'), ('Tefal'), ('Sharp'), ('Kangaroo');

-- ---- Sản phẩm ----
INSERT INTO products (id, name, category_id, brand_id, seller_id, price, original_price, stock, sold_count, rating, rating_count, thumbnail, description, warranty_months, featured, best_seller, status) VALUES
('prod_1', 'Nồi chiên không dầu Philips HD9650/91 7.2L XXL Công nghệ Twin TurboStar',    'bep',          1, 'usr_seller', 3490000, 4290000, 25,  840,  4.9, 128, 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80', 'Nồi chiên không dầu Philips dung tích XXL 7.2L giúp nướng nguyên con gà hoặc 1.4kg khoai tây. Giảm đến 90% lượng chất béo với luồng khí xoáy đối lưu cao cấp.',   24, 1, 1, 'active'),
('prod_2', 'Robot hút bụi lau nhà Xiaomi Dreame L10s Ultra Bản Quốc Tế Tự Giặt Giẻ',   'lam-sach',     5, 'usr_seller',11990000,14500000, 12,  310,  4.8,  95, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80', 'Robot hút bụi thông minh tự động hút rác, tự động giặt và sấy khô giẻ lau bằng khí nóng. Lực hút siêu mạnh 5300Pa nhận diện thảm và né vật cản thông minh bằng AI 3D.', 12, 1, 1, 'active'),
('prod_3', 'Máy lọc không khí Sharp FP-J30E-B Diệt khuẩn Plasmacluster Ion 23m²',       'khong-khi',    7, 'usr_seller', 1890000, 2490000, 45, 1200,  4.7, 215, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80', 'Máy lọc không khí trang bị màng lọc HEPA cao cấp loại bỏ 99.97% bụi mịn PM2.5, phấn hoa và mùi hôi. Công nghệ tạo ion Plasmacluster mật độ 7000 ion/cm3 ức chế vi rút.', 12, 0, 1, 'active'),
('prod_4', 'Nồi cơm điện tử áp suất Cuckoo 1.8L CRP-PK1000S Đa Năng',                  'bep',          4, 'usr_seller', 2650000, 3200000, 18,  420,  4.9,  88, 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80', 'Nồi cơm điện tử công nghệ nhiệt 3 chiều, lòng nồi tráng men kim cương nhân tạo siêu bền chống trầy xước, nấu cơm dẻo thơm nguyên hạt.',  24, 1, 0, 'active'),
('prod_5', 'Bàn ủi hơi nước đứng Tefal IT3440E0 Công Suất 1800W 3 Cấp Độ Hơi',         'dien-nha-tam', 6, 'usr_seller', 1550000, 1990000,  5,  190,  4.6,  64, 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80', 'Bàn ủi hơi nước đứng Tefal giúp là phẳng quần áo nhanh chóng không cần cầu ủi. Hơi nước mạnh mẽ diệt khuẩn 99.9% trên mọi chất liệu vải mềm mại.',               24, 0, 0, 'active'),
('prod_6', 'Bộ nồi chảo inox 304 nguyên khối 5 đáy Sunhouse Mama SHG501',               'bep',          3, 'usr_seller', 1250000, 1650000,  0,  520,  4.8, 140, 'https://images.unsplash.com/photo-1584990347449-39943f2efd3b?w=600&auto=format&fit=crop&q=80', 'Bộ nồi inox 5 đáy truyền nhiệt đều, giữ nhiệt lâu, chống cháy khét. Dùng tốt trên mọi loại bếp: bếp từ, bếp hồng ngoại, bếp gas.',                              36, 0, 1, 'out_of_stock'),
('prod_7', 'Ấm đun nước siêu tốc thủy tinh Lock&Lock EJK418SLV 1.8L Có Đèn LED',       'bep',          2, 'usr_seller',  480000,  690000, 30,  980,  4.7, 310, 'https://images.unsplash.com/photo-1594213114663-ddbe3f1987d2?w=600&auto=format&fit=crop&q=80', 'Thân ấm làm bằng thủy tinh borosilicate chịu nhiệt trong suốt, mâm nhiệt thép không gỉ sáng bóng, tự ngắt khi nước sôi an toàn tuyệt đối.',                     12, 0, 1, 'active'),
('prod_8', 'Máy hút bụi cầm tay không dây Dyson V12 Detect Slim Total Clean',           'lam-sach',     5, 'usr_seller',13900000,16900000,  8,   75,  5.0,  42, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80', 'Máy hút bụi cầm tay nhẹ nhất trang bị tia laser xanh soi rõ bụi vô hình trên sàn nhà. Cảm biến Piezo đo kích thước hạt bụi hiển thị trên màn hình LCD.',        24, 1, 0, 'active');

-- ---- Hình ảnh sản phẩm ----
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
('prod_1', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80', 0),
('prod_1', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',   1),
('prod_2', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80', 0),
('prod_2', 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80', 1),
('prod_3', 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80', 0),
('prod_4', 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80',   0),
('prod_5', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80', 0),
('prod_6', 'https://images.unsplash.com/photo-1584990347449-39943f2efd3b?w=600&auto=format&fit=crop&q=80', 0),
('prod_7', 'https://images.unsplash.com/photo-1594213114663-ddbe3f1987d2?w=600&auto=format&fit=crop&q=80', 0),
('prod_8', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',   0);

-- ---- Thông số kỹ thuật ----
INSERT INTO product_specifications (product_id, spec_key, spec_value, sort_order) VALUES
('prod_1', 'Dung tích',          '7.2 Lít (Thực phẩm 1.4kg)',                            0),
('prod_1', 'Công suất',          '2225 W',                                                1),
('prod_1', 'Chất liệu lòng nồi', 'Thép không gỉ phủ chống dính cao cấp QuickClean',      2),
('prod_1', 'Bảng điều khiển',    'Điện tử cảm ứng xoay QuickControl',                    3),
('prod_1', 'Xuất xứ',            'Ba Lan / Thổ Nhĩ Kỳ',                                  4),

('prod_2', 'Lực hút',             '5300 Pa',                                              0),
('prod_2', 'Dung lượng pin',      '5200 mAh (Làm việc 210 phút)',                         1),
('prod_2', 'Dung tích túi bụi',   '3.0 Lít (Dùng 60 ngày)',                              2),
('prod_2', 'Công nghệ điều hướng','AI Action + Camera RGB 3D',                            3),
('prod_2', 'Bảo hành',            'Chính hãng 12 tháng',                                 4),

('prod_3', 'Diện tích phòng',     'Dưới 23 m²',                                          0),
('prod_3', 'Lưu lượng không khí', '60 - 180 m³/giờ',                                     1),
('prod_3', 'Bộ lọc',              'Bộ lọc bụi thô, Bộ lọc HEPA',                         2),
('prod_3', 'Chế độ Haze',         'Tự động giải phóng Ion tốc độ cao trong 60 phút',      3),

('prod_4', 'Dung tích',           '1.8 Lít (4 - 6 người ăn)',                            0),
('prod_4', 'Công suất',           '1150 W',                                               1),
('prod_4', 'Lòng nồi',            'Hợp kim nhôm phủ chống dính kim cương Xwall',         2),
('prod_4', 'Chế độ nấu',          'Nấu cơm, cơm trộn, nấu cháo, hầm canh, làm bánh',    3),

('prod_5', 'Công suất',           '1800 W',                                               0),
('prod_5', 'Bình chứa nước',      '1.5 Lít (tháo rời tiện lợi)',                         1),
('prod_5', 'Lượng hơi phun',      '30 g/phút',                                           2),
('prod_5', 'Thời gian làm nóng',  '45 giây',                                             3),

('prod_6', 'Số lượng',            '3 nồi (16cm, 20cm, 24cm) + 1 quánh',                  0),
('prod_6', 'Chất liệu',           'Inox 304 cao cấp an toàn thực phẩm',                  1),
('prod_6', 'Đáy nồi',             'Đáy 5 lớp siêu bền',                                  2),

('prod_7', 'Dung tích',           '1.8 Lít',                                             0),
('prod_7', 'Công suất',           '1850 W',                                               1),
('prod_7', 'Chất liệu',           'Thủy tinh chịu nhiệt + Inox 304',                     2),
('prod_7', 'Tiện ích',            'Đèn LED báo hoạt động, xoay 360 độ',                  3),

('prod_8', 'Lực hút',             '150 AW',                                               0),
('prod_8', 'Thời gian dùng pin',  'Lên đến 60 phút',                                     1),
('prod_8', 'Trọng lượng',         '2.2 kg',                                               2),
('prod_8', 'Bộ phụ kiện',         '5 đầu hút chuyên dụng',                               3);

-- ---- Mã khuyến mãi ----
INSERT INTO promotions (id, code, title, discount_type, discount_value, min_order_value, max_discount, expiry_date, usage_limit, used_count, status) VALUES
('promo_1', 'GIADUNG50K', 'Giảm ngay 50.000đ đơn từ 500k',                   'fixed',      50000,   500000,  50000, '2026-12-31', 500,  82, 'active'),
('promo_2', 'FREESHIP',   'Miễn phí vận chuyển toàn quốc (tối đa 30k)',       'fixed',      30000,   300000,  30000, '2026-12-31', 1000, 240,'active'),
('promo_3', 'SUMMER10',   'Ưu đãi hè rực rỡ giảm 10% tối đa 200k',           'percentage', 10,      1000000, 200000,'2026-10-31', 200,  45, 'active');

-- ---- Đơn hàng ----
INSERT INTO orders (id, customer_id, customer_name, customer_phone, shipping_address, payment_method, payment_status, items_total, shipping_fee, discount_amount, voucher_code, total_amount, status, notes, warranty_requested, created_at) VALUES
('ORD-88291', 'usr_customer', 'Trần Khánh Đông', '0987654321', 'Số 45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'COD',     'unpaid', 3490000, 30000, 50000, 'GIADUNG50K', 3470000, 'pending',   'Giao giờ hành chính giúp mình',  0, '2026-09-06 14:30:00'),
('ORD-77150', 'usr_customer', 'Trần Khánh Đông', '0987654321', 'Số 45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 'BANK_QR', 'paid',   960000,  30000, 30000, 'FREESHIP',   960000,  'delivered', 'Gọi trước khi giao',             0, '2026-09-01 09:15:00');

-- ---- Chi tiết đơn hàng ----
INSERT INTO order_items (order_id, product_id, product_name, price, quantity, thumbnail) VALUES
('ORD-88291', 'prod_1', 'Nồi chiên không dầu Philips HD9650/91 7.2L XXL',      3490000, 1, 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80'),
('ORD-77150', 'prod_7', 'Ấm đun nước siêu tốc thủy tinh Lock&Lock EJK418SLV', 480000,  2, 'https://images.unsplash.com/photo-1594213114663-ddbe3f1987d2?w=600&auto=format&fit=crop&q=80');

-- ---- Timeline đơn hàng ----
INSERT INTO order_timeline (order_id, status, title, event_time) VALUES
('ORD-88291', 'pending',   'Đơn hàng đã được tạo',        '2026-09-06 14:30:00'),
('ORD-77150', 'pending',   'Đơn hàng đã được tạo',        '2026-09-01 09:15:00'),
('ORD-77150', 'confirmed', 'Người bán đã xác nhận đơn',   '2026-09-01 10:00:00'),
('ORD-77150', 'preparing', 'Đang đóng gói sản phẩm',      '2026-09-01 14:00:00'),
('ORD-77150', 'shipping',  'Đang giao hàng',               '2026-09-02 08:30:00'),
('ORD-77150', 'delivered', 'Đã giao hàng thành công',     '2026-09-03 16:45:00');

-- ---- Đánh giá ----
INSERT INTO reviews (product_id, order_id, user_id, user_name, rating, comment, status, created_at) VALUES
('prod_7', 'ORD-77150', 'usr_customer', 'Trần Khánh Đông', 5,
 'Ấm đun siêu nhanh, thủy tinh dày dặn đẹp mắt, đèn led sáng xanh rất chill. Đóng gói cẩn thận 5 sao!',
 'approved', '2026-09-04 10:20:00');

-- ============================================================
-- VIEWS HỮU ÍCH
-- ============================================================

-- View: danh sách sản phẩm kèm tên danh mục, thương hiệu, người bán
CREATE OR REPLACE VIEW v_products AS
SELECT
  p.id, p.name, p.price, p.original_price, p.stock, p.sold_count,
  p.rating, p.rating_count, p.thumbnail, p.featured, p.best_seller,
  p.warranty_months, p.status,
  c.name  AS category_name,
  b.name  AS brand_name,
  u.name  AS seller_name,
  u.shop_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands     b ON p.brand_id    = b.id
LEFT JOIN users      u ON p.seller_id   = u.id;

-- View: tổng quan đơn hàng
CREATE OR REPLACE VIEW v_orders AS
SELECT
  o.id, o.customer_name, o.customer_phone, o.shipping_address,
  o.payment_method, o.payment_status,
  o.items_total, o.shipping_fee, o.discount_amount, o.total_amount,
  o.voucher_code, o.status, o.notes, o.created_at,
  u.email AS customer_email
FROM orders o
LEFT JOIN users u ON o.customer_id = u.id;
