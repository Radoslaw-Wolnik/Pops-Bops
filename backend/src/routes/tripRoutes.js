// src/routes/tripRoutes.js
import express from 'express';
import authenticateToken from '../middleware/auth.js';
// import auth from '../middleware/auth.js';
import { 
} from '../controllers/mainController.js';


const router = express.Router();

router.post('/', authenticateToken, createTrip);
router.get('/', authenticateToken, getTrips);



export default router;