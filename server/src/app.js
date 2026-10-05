import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRoutes from './routes/healthRoutes.js';

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

// Khởi chạy server
app.listen(PORT, () => {
  console.log('===============================================');
  console.log('🚀 Server Node.js + Express đang chạy tại:');
  console.log('👉 Trang chủ:   http://localhost:' + PORT);
  console.log('👉 API Health:  http://localhost:' + PORT + '/api/v1/health');
  console.log('===============================================');
});

export default app;