import { Router } from 'express';
import { BookingVehicleController } from '../controllers/bookingVehicle.controller';

// CREATE ROUTER
const router = Router();

/**
 *  ROUTES
 */

// CREATE BOOKING VEHICLE
router.post('/', BookingVehicleController.createBookingVehicle);

// FETCH BOOKING VEHICLES
router.get('/', BookingVehicleController.fetchBookingVehicles);

// FETCH POPULAR BOOKING VEHICLES
router.get('/popular', BookingVehicleController.fetchPopularBookingVehicles);

// GET BOOKING VEHICLE DETAILS
router.get('/:id', BookingVehicleController.getBookingVehicleDetails);

// UPDATE BOOKING VEHICLE
router.patch('/:id', BookingVehicleController.updateBookingVehicle);

// DELETE BOOKING VEHICLE
router.delete('/:id', BookingVehicleController.deleteBookingVehicle);

// EXPORT ROUTER
export default router;
