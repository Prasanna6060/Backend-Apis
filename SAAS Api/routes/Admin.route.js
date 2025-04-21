import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/Admin.controller.js";

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

export default router;

