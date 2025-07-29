import express from 'express';
import { getAllRole } from '../controllers/roleController';
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getAllRole);

export default router;
