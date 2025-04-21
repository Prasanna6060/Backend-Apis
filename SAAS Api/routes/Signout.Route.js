import express from 'express';
import { signOut } from '../controllers/signout.controller.js';

const router = express.Router();

router.post('/', signOut);

export default router;