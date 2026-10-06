import pool from '../config/db.js';

/**
 * Controller Đăng ký người dùng mới - Tự động ghi vào CSDL MySQL (giadungsmart.users)
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

    // 3. Thực thi INSERT vào bảng users trong MySQL
    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone, address, role)
       VALUES (?, ?, ?, ?, ?, 'customer')`,
      [
        name.trim(),
        cleanEmail,
        password, // Lưu mật khẩu
        phone ? phone.trim() : null,
        address ? address.trim() : null
      ]
    );

    const insertedId = result.insertId;

    const newUser = {
      id: `usr_${insertedId}`,
      db_id: insertedId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    console.log(`✅ [MYSQL XAMPP] Đã INSERT thành công người dùng mới vào bảng users:`);
    console.log(`   👉 ID: ${insertedId} | Họ tên: ${name} | Email: ${cleanEmail} | Role: customer`);

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
 * Controller Lấy danh sách người dùng từ MySQL
 */
export const getAllUsers = async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ success: false, message: 'MySQL chưa kết nối' });
    }

    const [rows] = await pool.query(
      'SELECT id, full_name AS name, email, phone, address, role, created_at AS createdAt FROM users ORDER BY id DESC'
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
