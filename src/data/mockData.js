// Mock Data ban đầu cho hệ thống Website Bán Hàng Đồ Gia Dụng

export const INITIAL_USERS = [
  {
    id: 'usr_admin',
    name: 'Quản Trị Viên (Admin)',
    email: 'admin@gmail.com',
    password: '123',
    role: 'admin',
    phone: '0901234567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: 'usr_seller',
    name: 'Gia Dụng SmartHome Store',
    email: 'seller@gmail.com',
    password: '123',
    role: 'seller',
    phone: '0912345678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-01-10',
    rating: 4.8,
    shopName: 'Gia Dụng SmartHome Chính Hãng',
  },
  {
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
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'Tất cả sản phẩm', icon: 'Sparkles' },
  { id: 'bep', name: 'Thiết bị nhà bếp', icon: 'Utensils' },
  { id: 'lam-sach', name: 'Dọn dẹp & Làm sạch', icon: 'Sparkle' },
  { id: 'khong-khi', name: 'Không khí & Quạt', icon: 'Wind' },
  { id: 'dien-nha-tam', name: 'Thiết bị chăm sóc & Giặt ủi', icon: 'Shirt' },
  { id: 'thong-minh', name: 'Gia dụng thông minh', icon: 'Cpu' }
];

export const BRANDS = ['Philips', 'Lock&Lock', 'Sunhouse', 'Panasonic', 'Xiaomi', 'Tefal', 'Sharp', 'Kangaroo'];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Nồi chiên không dầu Philips HD9650/91 7.2L XXL Công nghệ Twin TurboStar',
    category: 'bep',
    brand: 'Philips',
    price: 3490000,
    originalPrice: 4290000,
    rating: 4.9,
    ratingCount: 128,
    stock: 25,
    soldCount: 840,
    featured: true,
    bestSeller: true,
    sellerId: 'usr_seller',
    sellerName: 'Gia Dụng SmartHome Chính Hãng',
    thumbnail: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Nồi chiên không dầu Philips dung tích XXL 7.2L giúp nướng nguyên con gà hoặc 1.4kg khoai tây. Giảm đến 90% lượng chất béo với luồng khí xoáy đối lưu cao cấp.',
    specifications: {
      'Dung tích': '7.2 Lít (Thực phẩm 1.4kg)',
      'Công suất': '2225 W',
      'Chất liệu lòng nồi': 'Thép không gỉ phủ chống dính cao cấp QuickClean',
      'Bảng điều khiển': 'Điện tử cảm ứng xoay QuickControl',
      'Xuất xứ': 'Ba Lan / Thổ Nhĩ Kỳ'
    },
    warrantyMonths: 24,
    status: 'active'
  },
  {
    id: 'prod_2',
    name: 'Robot hút bụi lau nhà Xiaomi Dreame L10s Ultra Bản Quốc Tế Tự Giặt Giẻ',
    category: 'lam-sach',
    brand: 'Xiaomi',
    price: 11990000,
    originalPrice: 14500000,
    rating: 4.8,
    ratingCount: 95,
    stock: 12,
    soldCount: 310,
    featured: true,
    bestSeller: true,
    sellerId: 'usr_seller',
    sellerName: 'Gia Dụng SmartHome Chính Hãng',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Robot hút bụi thông minh tự động hút rác, tự động giặt và sấy khô giẻ lau bằng khí nóng. Lực hút siêu mạnh 5300Pa nhận diện thảm và né vật cản thông minh bằng AI 3D.',
    specifications: {
      'Lực hút': '5300 Pa',
      'Dung lượng pin': '5200 mAh (Làm việc 210 phút)',
      'Dung tích túi bụi trạm sạc': '3.0 Lít (Dùng 60 ngày)',
      'Công nghệ điều hướng': 'AI Action + Camera RGB 3D',
      'Bảo hành': 'Chính hãng 12 tháng'
    },
    warrantyMonths: 12,
    status: 'active'
  },
  {
    id: 'prod_3',
    name: 'Máy lọc không khí Sharp FP-J30E-B Diệt khuẩn Plasmacluster Ion 23m²',
    category: 'khong-khi',
    brand: 'Sharp',
    price: 1890000,
    originalPrice: 2490000,
    rating: 4.7,
    ratingCount: 215,
    stock: 45,
    soldCount: 1200,
    featured: false,
    bestSeller: true,
    sellerId: 'usr_seller',
    sellerName: 'Gia Dụng SmartHome Chính Hãng',
    thumbnail: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Máy lọc không khí trang bị màng lọc HEPA cao cấp loại bỏ 99.97% bụi mịn PM2.5, phấn hoa và mùi hôi. Công nghệ tạo ion Plasmacluster mật độ 7000 ion/cm3 ức chế vi rút.',
    specifications: {
      'Diện tích phòng sử dụng': 'Dưới 23 m²',
      'Lưu lượng không khí': '60 - 180 m³/giờ',
      'Bộ lọc': 'Bộ lọc bụi thô, Bộ lọc HEPA',
      'Chế độ Haze': 'Tự động giải phóng Ion tốc độ cao trong 60 phút'
    },
    warrantyMonths: 12,
    status: 'active'
  },
  {
    id: 'prod_4',
    name: 'Nồi cơm điện tử áp suất Cuckoo 1.8L CRP-PK1000S Đa Năng',
    category: 'bep',
    brand: 'Panasonic',
    price: 2650000,
    originalPrice: 3200000,
    rating: 4.9,
    ratingCount: 88,
    stock: 18,
    soldCount: 420,
    featured: true,
    bestSeller: false,
    sellerId: 'usr_seller',
    sellerName: 'Gia Dụng SmartHome Chính Hãng',
    thumbnail: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Nồi cơm điện tử công nghệ nhiệt 3 chiều, lòng nồi tráng men kim cương nhân tạo siêu bền chống trầy xước, nấu cơm dẻo thơm nguyên hạt.',
    specifications: {
      'Dung tích': '1.8 Lít (4 - 6 người ăn)',
      'Công suất': '1150 W',
      'Lòng nồi': 'Hợp kim nhôm phủ chống dính kim cương Xwall',
      'Chế độ nấu': 'Nấu cơm, cơm trộn, nấu cháo, hầm canh, làm bánh'
    },
    warrantyMonths: 24,
    status: 'active'
  },
  {
    id: 'prod_5',
    name: 'Bàn ủi hơi nước đứng Tefal IT3440E0 Công Suất 1800W 3 Cấp Độ Hơi',
    category: 'dien-nha-tam',
    brand: 'Tefal',
    price: 1550000,
    originalPrice: 1990000,
    rating: 4.6,
    ratingCount: 64,
    stock: 5, // Sắp hết hàng
    soldCount: 190,
    featured: false,
    bestSeller: false,
    sellerId: 'usr_seller',
    sellerName: 'Gia Dụng SmartHome Chính Hãng',
    thumbnail: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Bàn ủi hơi nước đứng Tefal giúp là phẳng quần áo nhanh chóng không cần cầu ủi. Hơi nước mạnh mẽ diệt khuẩn 99.9% trên mọi chất liệu vải mềm mại.',
    specifications: {
      'Công suất': '1800 W',
      'Bình chứa nước': '1.5 Lít (tháo rời tiện lợi)',
      'Lượng hơi phun': '30 g/phút',
      'Thời gian làm nóng': '45 giây'
    },
    warrantyMonths: 24,
    status: 'active'
  },
  {
    id: 'prod_6',
    name: 'Bộ nồi chảo inox 304 nguyên khối 5 đáy Sunhouse Mama SHG501',
    category: 'bep',
    brand: 'Sunhouse',
    price: 1250000,
    originalPrice: 1650000,
    rating: 4.8,
    ratingCount: 140,
    stock: 0, // Hết hàng
    soldCount: 520,
    featured: false,
    bestSeller: true,
    sellerId: 'usr_seller',
    sellerName: 'Gia Dụng SmartHome Chính Hãng',
    thumbnail: 'https://images.unsplash.com/photo-1584990347449-39943f2efd3b?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584990347449-39943f2efd3b?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Bộ nồi inox 5 đáy truyền nhiệt đều, giữ nhiệt lâu, chống cháy khét. Dùng tốt trên mọi loại bếp: bếp từ, bếp hồng ngoại, bếp gas.',
    specifications: {
      'Số lượng': '3 nồi (16cm, 20cm, 24cm) + 1 quánh',
      'Chất liệu': 'Inox 304 cao cấp an toàn thực phẩm',
      'Đáy nồi': 'Đáy 5 lớp siêu bền'
    },
    warrantyMonths: 36,
    status: 'active'
  },
  {
    id: 'prod_7',
    name: 'Ấm đun nước siêu tốc thủy tinh Lock&Lock EJK418SLV 1.8L Có Đèn LED',
    category: 'bep',
    brand: 'Lock&Lock',
    price: 480000,
    originalPrice: 690000,
    rating: 4.7,
    ratingCount: 310,
    stock: 30,
    soldCount: 980,
    featured: false,
    bestSeller: true,
    sellerId: 'usr_seller',
    sellerName: 'Gia Dụng SmartHome Chính Hãng',
    thumbnail: 'https://images.unsplash.com/photo-1594213114663-ddbe3f1987d2?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1594213114663-ddbe3f1987d2?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Thân ấm làm bằng thủy tinh borosilicate chịu nhiệt trong suốt, mâm nhiệt thép không gỉ sáng bóng, tự ngắt khi nước sôi an toàn tuyệt đối.',
    specifications: {
      'Dung tích': '1.8 Lít',
      'Công suất': '1850 W',
      'Chất liệu': 'Thủy tinh chịu nhiệt + Inox 304',
      'Tiện ích': 'Đèn LED báo hoạt động, xoay 360 độ'
    },
    warrantyMonths: 12,
    status: 'active'
  },
  {
    id: 'prod_8',
    name: 'Máy hút bụi cầm tay không dây Dyson V12 Detect Slim Total Clean',
    category: 'lam-sach',
    brand: 'Xiaomi',
    price: 13900000,
    originalPrice: 16900000,
    rating: 5.0,
    ratingCount: 42,
    stock: 8,
    soldCount: 75,
    featured: true,
    bestSeller: false,
    sellerId: 'usr_seller',
    sellerName: 'Gia Dụng SmartHome Chính Hãng',
    thumbnail: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Máy hút bụi cầm tay nhẹ nhất trang bị tia laser xanh soi rõ bụi vô hình trên sàn nhà. Cảm biến Piezo đo kích thước hạt bụi hiển thị trên màn hình LCD.',
    specifications: {
      'Lực hút': '150 AW',
      'Thời gian dùng pin': 'Lên đến 60 phút',
      'Trọng lượng': '2.2 kg',
      'Bộ phụ kiện': '5 đầu hút chuyên dụng'
    },
    warrantyMonths: 24,
    status: 'active'
  }
];

export const INITIAL_PROMOTIONS = [
  {
    id: 'promo_1',
    code: 'GIADUNG50K',
    title: 'Giảm ngay 50.000đ đơn từ 500k',
    discountType: 'fixed', // fixed | percentage
    discountValue: 50000,
    minOrderValue: 500000,
    maxDiscount: 50000,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 82,
    status: 'active'
  },
  {
    id: 'promo_2',
    code: 'FREESHIP',
    title: 'Miễn phí vận chuyển toàn quốc (tối đa 30k)',
    discountType: 'fixed',
    discountValue: 30000,
    minOrderValue: 300000,
    maxDiscount: 30000,
    expiryDate: '2026-12-31',
    usageLimit: 1000,
    usedCount: 240,
    status: 'active'
  },
  {
    id: 'promo_3',
    code: 'SUMMER10',
    title: 'Ưu đãi hè rực rỡ giảm 10% tối đa 200k',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 1000000,
    maxDiscount: 200000,
    expiryDate: '2026-10-31',
    usageLimit: 200,
    usedCount: 45,
    status: 'active'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-88291',
    customerId: 'usr_customer',
    customerName: 'Trần Khánh Đông',
    customerPhone: '0987654321',
    shippingAddress: 'Số 45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'COD', // COD | BANK_QR | CARD
    paymentStatus: 'unpaid', // unpaid | paid
    items: [
      {
        productId: 'prod_1',
        name: 'Nồi chiên không dầu Philips HD9650/91 7.2L XXL',
        price: 3490000,
        quantity: 1,
        thumbnail: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80'
      }
    ],
    itemsTotal: 3490000,
    shippingFee: 30000,
    discountAmount: 50000,
    voucherCode: 'GIADUNG50K',
    totalAmount: 3470000,
    status: 'pending', // pending -> confirmed -> preparing -> shipping -> delivered | cancelled
    timeline: [
      { status: 'pending', title: 'Đơn hàng đã được tạo', time: '2026-09-06 14:30' }
    ],
    notes: 'Giao giờ hành chính giúp mình',
    createdAt: '2026-09-06 14:30',
    warrantyRequested: false
  },
  {
    id: 'ORD-77150',
    customerId: 'usr_customer',
    customerName: 'Trần Khánh Đông',
    customerPhone: '0987654321',
    shippingAddress: 'Số 45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'BANK_QR',
    paymentStatus: 'paid',
    items: [
      {
        productId: 'prod_7',
        name: 'Ấm đun nước siêu tốc thủy tinh Lock&Lock EJK418SLV 1.8L',
        price: 480000,
        quantity: 2,
        thumbnail: 'https://images.unsplash.com/photo-1594213114663-ddbe3f1987d2?w=600&auto=format&fit=crop&q=80'
      }
    ],
    itemsTotal: 960000,
    shippingFee: 30000,
    discountAmount: 30000,
    voucherCode: 'FREESHIP',
    totalAmount: 960000,
    status: 'delivered',
    timeline: [
      { status: 'pending', title: 'Đơn hàng đã được tạo', time: '2026-09-01 09:15' },
      { status: 'confirmed', title: 'Người bán đã xác nhận đơn', time: '2026-09-01 10:00' },
      { status: 'preparing', title: 'Đang đóng gói sản phẩm', time: '2026-09-01 14:00' },
      { status: 'shipping', title: 'Đang giao hàng', time: '2026-09-02 08:30' },
      { status: 'delivered', title: 'Đã giao hàng thành công', time: '2026-09-03 16:45' }
    ],
    notes: 'Gọi trước khi giao',
    createdAt: '2026-09-01 09:15',
    reviewed: true,
    warrantyRequested: false
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev_1',
    productId: 'prod_7',
    orderId: 'ORD-77150',
    userId: 'usr_customer',
    userName: 'Trần Khánh Đông',
    rating: 5,
    comment: 'Ấm đun siêu nhanh, thủy tinh dày dặn đẹp mắt, đèn led sáng xanh rất chill. Đóng gói cẩn thận 5 sao!',
    createdAt: '2026-09-04 10:20',
    status: 'approved'
  }
];
