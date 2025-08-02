import express from 'express';
import { getAllRole } from '../controllers/roleController';
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Route untuk mendapatkan semua role
// authMiddleware: hanya user terautentikasi yang bisa akses
// getAllRole: controller untuk mengambil seluruh data task
router.get("/", authMiddleware, getAllRole);

export default router;
