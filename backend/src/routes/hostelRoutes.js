import express from 'express';
import { protect, getMe } from './../controllers/authController.js';
import {
  createHostel,
  getAllHostels,
} from '../controllers/hostelController.js';

const router = express.Router();

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
// router.use(protect);

router.post('/createHostel', createHostel);
router.get('/getAllHostels', getAllHostels);

export default router;