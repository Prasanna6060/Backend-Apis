import express from 'express';
import { getallTechniciansLocation, getUserLocation, postLocation } from '../controllers/Location.controller.js';

const router = express.Router();

router.post('/current-location', postLocation)
router.get('/current-locations', getallTechniciansLocation)
router.get('/current-location/:userId', getUserLocation)

export default router;