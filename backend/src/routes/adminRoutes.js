// routes/adminRoutes.js
import express from 'express';
import { getAdmins, deleteAdmin, addAdmin } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', authenticateAdmin, getAdmins);
router.delete('/users/:id', authenticateAdmin, deleteAdmin);
router.post('/users', authenticateAdmin, addAdmin);

export default router;