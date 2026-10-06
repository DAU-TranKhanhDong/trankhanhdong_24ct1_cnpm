import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { connectDB, getDBStatus } from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (phục vụ giao diện public/index.html)
app.use(express.static(path.join(__dirname, '../public')));

// Routes API v1
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);

// Endpoint kiểm tra kết nối Database
app.get('/api/v1/db-status', (req, res) => {
  const status = getDBStatus();
  res.status(status.connected ? 200 : 503).json({
    status: status.connected ? 'connected' : 'disconnected',
    database: status.config.database,
    host: `${status.config.host}:${status.config.port}`,
    message: status.connected
      ? 'Đã kết nối thành công tới Database MySQL gia_dung_shop'
      : 'Chưa kết nối được MySQL. Hãy khởi động dịch vụ MySQL (XAMPP) và kiểm tra file .env',
    schema: status.schema,
    timestamp: new Date().toISOString()
  });
});

// Khởi chạy server và kết nối Database
app.listen(PORT, async () => {
  console.log('===============================================');
  console.log('🚀 Server Node.js + Express đang chạy tại:');
  console.log('👉 Trang chủ:      http://localhost:' + PORT);
  console.log('👉 API Health:     http://localhost:' + PORT + '/api/v1/health');
  console.log('👉 API DB Status:  http://localhost:' + PORT + '/api/v1/db-status');
  console.log('===============================================');
  
  // Thực hiện kết nối Database
  await connectDB();
});

export default app;