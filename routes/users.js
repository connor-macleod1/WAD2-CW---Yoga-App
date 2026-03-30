// routes/users.js
import { Router } from 'express';
import { post_new_user, post_login, logoutUser } from '../controllers/userController.js';

const router = Router();

router.post("/register", post_new_user);
router.post("/login", post_login);
router.post("/logout", logoutUser);

export default router;