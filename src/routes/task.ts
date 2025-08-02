import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
} from "../controllers/taskController"; //import semua controller

import { authMiddleware } from "../middleware/authMiddleware";

// Import middleware untuk upload file dan error handling multer
import upload, { multerErrorHandler } from "../middleware/fileUploads";

// Buat instance router dari express
const router = express.Router();

// Route untuk membuat task baru:
// - authMiddleware: memastikan user sudah login
// - upload.single("file"): meng-handle upload file dengan field name 'file'
// - multerErrorHandler: menangkap error dari proses upload file
// - createTask: fungsi controller untuk membuat task baru
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  multerErrorHandler,
  createTask
);

// Route untuk mendapatkan semua task
// authMiddleware: hanya user terautentikasi yang bisa akses
// getAllTasks: controller untuk mengambil seluruh data task
router.get("/", authMiddleware, getAllTasks);

// Route untuk mencari task berdasarkan keyword
// authMiddleware: hanya user terautentikasi yang bisa akses
// searchTasks: controller untuk pencarian task sesuai dengan permintaan keyword
router.get("/search", authMiddleware, searchTasks);

// Route untuk mengupdate task berdasarkan ID
// authMiddleware: hanya user terautentikasi yang bisa akses
// updateTask: controller untuk mengubah isi task dengan ID tertentu
router.put("/:id", authMiddleware, updateTask);

// Route untuk menghapus task berdasarkan ID
// authMiddleware: hanya user terautentikasi yang bisa akses
// deleteTask: controller untuk menghapus task

router.delete("/:id", authMiddleware, deleteTask);

export default router;
