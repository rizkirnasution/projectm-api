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

router.post("/create", authMiddleware, createUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.get("/", authMiddleware, getUser);
router.get("/username", authMiddleware, getAllOnlyUsername);

export default router;
