import express from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, searchTasks} from '../controllers/taskController';
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getAllTasks);
router.get("/search", authMiddleware, searchTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
