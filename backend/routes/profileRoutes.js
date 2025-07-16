import express from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', authMiddleware, getMyProfile);
router.put('/', authMiddleware, updateMyProfile);

export default router;
