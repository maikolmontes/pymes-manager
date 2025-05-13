import express from 'express';
import { registerUser, getAllUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/', getAllUsers); // opcional

export default router;
