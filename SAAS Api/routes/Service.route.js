import express from 'express';
import { createServices, getAllServices, getServicesById, getServiceName, getServiceByCategory } from '../controllers/Service.contoller.js';

const router = express.Router();


router.get('/', getAllServices);
router.post('/', createServices);
router.post('/:id', getServicesById);
router.get('/category/:category', getServiceByCategory)
router.get('/:category/:name/:location', getServiceName);

export default router;