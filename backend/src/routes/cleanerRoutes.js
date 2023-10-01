import express from 'express';
import {
  getMyProfile,
  cleanerSignup,
} from '../controllers/cleanerController.js';
import { protect, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', cleanerSignup);

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(protect);

router.get('/getMyProfile', getMe, getMyProfile);

export default router;
