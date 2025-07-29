import express from 'express';
import { login, logout} from '../controllers/authCotroller';
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/login', login);
router.post("/logout", authMiddleware, logout);

export default router;
