import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Cấu hình kết nối MySQL Connection Pool
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gia_dung_shop',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000
};

let pool = null;
let isConnected = false;

try {
  pool = mysql.createPool(poolConfig);
} catch (err) {
  console.warn('⚠️ Chưa thể tạo MySQL Pool:', err.message);
}

/**
 * Hàm kiểm tra và kết nối Cơ sở dữ liệu MySQL (gia_dung_shop)
 */
export const connectDB = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool(poolConfig);
    }
    const connection = await pool.getConnection();
    isConnected = true;
    console.log('===============================================');
    console.log('✅ KẾT NỐI DATABASE MYSQL THÀNH CÔNG:');
    console.log(`📦 Database : ${poolConfig.database}`);
    console.log(`🌐 Host     : ${poolConfig.host}:${poolConfig.port}`);
    console.log(`👤 User     : ${poolConfig.user}`);
    console.log('===============================================');
    connection.release();
    return { success: true, message: 'Đã kết nối Database MySQL thành công' };
  } catch (error) {
    isConnected = false;
    console.warn('===============================================');
    console.warn('⚠️ TRẠNG THÁI KẾT NỐI DATABASE (MySQL):');
    console.warn(`❌ Chưa kết nối được MySQL tại ${poolConfig.host}:${poolConfig.port}`);
    console.warn(`   Lý do: ${error.message}`);
    console.warn('👉 Hướng dẫn: Khởi động MySQL trên XAMPP/WampServer và');
    console.warn('   import tệp database.sql vào CSDL "gia_dung_shop".');
    console.warn('===============================================');
    return { success: false, error: error.message };
  }
};

/**
 * Lấy trạng thái kết nối Database hiện tại
 */
export const getDBStatus = () => ({
  connected: isConnected,
  config: {
    host: poolConfig.host,
    port: poolConfig.port,
    database: poolConfig.database,
    user: poolConfig.user
  },
  schema: 'gia_dung_shop (Tables: users, products, orders, categories, brands, promotions)'
});

export default pool;
