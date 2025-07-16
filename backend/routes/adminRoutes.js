import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authMiddleware, isAdmin, getAdminStats);

export default router;
