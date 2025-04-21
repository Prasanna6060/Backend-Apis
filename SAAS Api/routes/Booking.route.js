import express from 'express';
import { createBookings } from '../controllers/Booking.contoller/createBookings.js';
import { getBookingByTechniciansId } from '../controllers/Booking.contoller/getBookingById.js';
import updateBookingStatus from '../controllers/Booking.contoller/updateBookingStatus.js';
import { jwtCheck } from '../middleware/jwtCheck.js';

const router = express.Router();

router.use(jwtCheck);

// router.get('/', getAllBookings);
router.post('/', createBookings);
router.get('/:id', getBookingByTechniciansId);
router.put('/:id', updateBookingStatus);

export default router;