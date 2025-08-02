import express from 'express';
import { login, logout} from '../controllers/authCotroller'; //import fungsi login, logout dari controller
import { authMiddleware } from "../middleware/authMiddleware"; //import middleware untuk validasi token JWT

const router = express.Router();

//akan memanggil fungsi login controller ketika ada request POST ke /login
router.post('/login', login);

//akan memanggil fungsi logout controller
router.post("/logout", authMiddleware, logout);

export default router;
