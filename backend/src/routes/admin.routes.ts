// routes/adminRoutes.ts
import express, { Router } from 'express';
import { getAdmins, deleteAdmin, addAdmin } from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/roles.middleware';

const router: Router = express.Router();

router.use(authenticateToken, isAdmin);
router.get('/all', getAdmins);
router.delete('/:id', deleteAdmin);
router.post('/add', addAdmin);

export default router;