import express from 'express';
import { registerUser, loginUser } from '../controllers/User.controller.js';
import  {singleUpload}  from '../middleware/multer.js';
import { authLimiter } from '../middleware/ratelimit.js';

const router = express.Router(); 

router.post('/register',authLimiter,singleUpload, registerUser);
router.post('/login', authLimiter,loginUser);
// router.get('/regiser/send-code', registerUserNumber);

export default router;