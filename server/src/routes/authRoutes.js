import express from 'express';
import { registerUser, getAllUsers } from '../controllers/authController.js';

const router = express.Router();

// Tuyến đường Đăng ký tài khoản (Tự động ghi vào CSDL MySQL XAMPP)
router.post('/register', registerUser);

// Tuyến đường Lấy danh sách người dùng từ CSDL MySQL
router.get('/users', getAllUsers);

export default router;
