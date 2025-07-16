import express from 'express';
import { getAllUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllUsers); // paginated
router.get('/:id', getUser);
router.put('/:id', authMiddleware, upload.single('profilePhoto'), updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
