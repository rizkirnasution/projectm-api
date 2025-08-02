import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllOnlyUsername,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// API create user 
// Middleware: authMiddleware memastikan hanya user yang sudah login bisa akses
// panggil func dari controller
router.post("/create", authMiddleware, createUser);

// API untuk mengupdate user berdasarkan ID
// Middleware: authMiddleware memastikan hanya user yang sudah login bisa akses
// Panggil updateUser dari controller 
router.put("/:id", authMiddleware, updateUser);

// API untuk menghapus user berdasarkan ID
// Middleware: authMiddleware memastikan hanya user yang sudah login bisa akses
// Panggil deleteUser dari controller
router.delete("/:id", authMiddleware, deleteUser);

// API untuk mengambil semua data user
// Middleware: authMiddleware memastikan hanya user yang sudah login bisa akses
// Panggil getUser dari controller
router.get("/", authMiddleware, getUser);

// API untuk mengambil hanya username semua user
// Middleware: authMiddleware memastikan hanya user yang sudah login bisa akses
//panggil getAllOnlyUsername dari controller
router.get("/username", authMiddleware, getAllOnlyUsername);

export default router;
