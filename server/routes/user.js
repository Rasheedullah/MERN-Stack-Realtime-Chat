import express from 'express';
import {
  register,
  login,
  validUser,
  logout,
  searchUsers,
  getUserById,
} from '../controllers/user.js';
import { Auth } from '../middleware/user.js';
const router = express.Router();
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/valid', Auth, validUser);
router.get('/auth/logout', Auth, logout);
router.get('/api/user?', Auth, searchUsers);
router.get('/api/users/:id', Auth, getUserById);
export default router;
