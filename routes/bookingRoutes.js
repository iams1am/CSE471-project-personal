import express from "express";
import { 
  createBooking, 
  getUserBookings, 
  processPayment, 
  deleteBooking,
  updateBookingStatus,
  getAllBookings,
  getBookedSeats 
} from "../controllers/bookingController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create booking
router.post("/create-booking", requireSignIn, createBooking);

// Get user bookings
router.get("/user-bookings", requireSignIn, getUserBookings);

// Get all bookings (admin only)
router.get("/all-bookings", requireSignIn, isAdmin, getAllBookings);

// Get booked seats for a movie showtime
router.get("/booked-seats/:movieId", getBookedSeats);

// Process payment
router.post("/process-payment", requireSignIn, processPayment);

// Delete booking (admin only)
router.delete("/delete-booking/:id", requireSignIn, isAdmin, deleteBooking);

// Update booking status (admin only)
router.put("/update-status/:id", requireSignIn, isAdmin, updateBookingStatus);

export default router; 