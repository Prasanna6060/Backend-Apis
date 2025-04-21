import express from "express";
import {
  loginTechnician,
  // getTechnicianById,
  getALlTechnicians,
  registerTechnicians,
  searchTechniciansByLocation,
} from "../controllers/Technician.controller.js";
import singleUpload from "../middleware/multer.js";
import { authLimiter } from "../middleware/ratelimit.js";

const router = express.Router();

router.get("/", getALlTechnicians);
router.post("/register",authLimiter,singleUpload, registerTechnicians);
router.post("/login", authLimiter,loginTechnician);
// router.get("/:id", getTechnicianById);
router.get("/search", searchTechniciansByLocation);


export default router;
