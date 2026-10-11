import pool from '../config/db.js';

/**
 * Controller Đăng ký người dùng mới - Tự động ghi trực tiếp vào CSDL MySQL (giadungsmart.users)
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu!'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Kiểm tra kết nối pool
    if (!pool) {
      return res.status(503).json({
        success: false,
        message: 'Cơ sở dữ liệu MySQL chưa sẵn sàng. Hãy khởi động XAMPP!'
      });
    }

    // 2. Kiểm tra email đã tồn tại hay chưa
    const [existing] = await pool.query(
      'SELECT id, email FROM users WHERE LOWER(email) = ?',
      [cleanEmail]
    );

    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email này đã được sử dụng, vui lòng chọn email khác!'
      });
    }

    // 3. Tạo ID và thực thi INSERT vào bảng users trong MySQL giadungsmart
    const newUserId = `usr_${Date.now()}`;
    const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    await pool.query(
      `INSERT INTO users (id, name, email, password, role, phone, address, avatar, status)
       VALUES (?, ?, ?, ?, 'customer', ?, ?, ?, 'active')`,
      [
        newUserId,
        name.trim(),
        cleanEmail,
        password,
        phone ? phone.trim() : null,
        address ? address.trim() : null,
        defaultAvatar
      ]
    );

    const newUser = {
      id: newUserId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      role: 'customer',
      status: 'active',
      avatar: defaultAvatar,
      createdAt: new Date().toISOString()
    };

    console.log(`✅ [MYSQL XAMPP] Đã INSERT thành công người dùng mới vào bảng users:`);
    console.log(`   👉 ID: ${newUserId} | Họ tên: ${name} | Email: ${cleanEmail} | Role: customer`);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản Khách Hàng thành công!',
      user: newUser
    });
  } catch (error) {
    console.error('❌ Lỗi khi đăng ký vào MySQL:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email này đã được sử dụng!'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lưu vào CSDL: ' + error.message
    });
  }
};

/**
 * Controller Đăng nhập từ MySQL (giadungsmart.users)
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu!'
      });
    }

    if (!pool) {
      return res.status(503).json({ success: false, message: 'MySQL chưa kết nối' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const [rows] = await pool.query(
      'SELECT id, name, email, password, role, phone, address, avatar, status FROM users WHERE LOWER(email) = ?',
      [cleanEmail]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác!'
      });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác!'
      });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản này đã bị khóa bởi Quản trị viên!'
      });
    }

    const { password: _, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: safeUser
    });
  } catch (error) {
    console.error('❌ Lỗi khi đăng nhập từ MySQL:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Controller Lấy danh sách toàn bộ người dùng từ MySQL (giadungsmart.users)
 */
export const getAllUsers = async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ success: false, message: 'MySQL chưa kết nối' });
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, phone, address, role, status, avatar, created_at AS createdAt FROM users ORDER BY created_at DESC'
    );

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
