import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { movieId, showtime, seats, totalAmount } = req.body;
    
    // Validate required fields
    if (!movieId || !showtime || !seats || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    // Check if seats are already booked for this showtime
    const existingBookings = await Booking.find({
      movie: movieId,
      'showtime.date': showtime.date,
      'showtime.time': showtime.time,
      status: { $in: ['pending', 'confirmed'] }
    });

    // Get all booked seats for this showtime
    const bookedSeats = existingBookings.reduce((acc, booking) => {
      return [...acc, ...booking.seats];
    }, []);

    // Check if any of the requested seats are already booked
    const seatsAlreadyBooked = seats.filter(seat => bookedSeats.includes(seat));
    if (seatsAlreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats ${seatsAlreadyBooked.join(', ')} are already booked for this showtime`
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      movie: movieId,
      showtime,
      seats,
      totalAmount
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    console.error("Error in creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Error in creating booking",
      error: error.message
    });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Error in getting bookings:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting bookings",
      error
    });
  }
};

// Process payment
export const processPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Verify the booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to process this payment"
      });
    }

    // Verify the amount matches
    if (booking.totalAmount !== amount) {
      return res.status(400).json({
        success: false,
        message: "Amount mismatch"
      });
    }

    // Update booking status
    booking.status = 'confirmed';
    booking.paymentMethod = paymentMethod;
    booking.paymentDate = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      booking
    });
  } catch (error) {
    console.error("Error in processing payment:", error);
    res.status(500).json({
      success: false,
      message: "Error in processing payment",
      error
    });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Only allow deletion of pending or cancelled bookings
    if (booking.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: "Cannot delete confirmed bookings"
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleting booking:", error);
    res.status(500).json({
      success: false,
      message: "Error in deleting booking",
      error: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Update status
    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    console.error("Error in updating booking status:", error);
    res.status(500).json({
      success: false,
      message: "Error in updating booking status",
      error
    });
  }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    console.log("Fetching all bookings...");
    
    // Check if we can connect to the database
    const dbState = mongoose.connection.readyState;
    console.log("Database connection state:", dbState);
    
    if (dbState !== 1) {
      throw new Error("Database connection not ready");
    }

    // First, check if there are any bookings
    const bookingsCount = await Booking.countDocuments();
    console.log(`Total bookings found: ${bookingsCount}`);

    if (bookingsCount === 0) {
      return res.status(200).json({
        success: true,
        bookings: []
      });
    }

    // Fetch bookings with populated fields
    const bookings = await Booking.find({})
      .populate({
        path: 'user',
        model: 'users',
        select: 'name email'
      })
      .populate({
        path: 'movie',
        model: 'Movie',
        select: 'title'
      })
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance

    console.log("Bookings fetched successfully:", bookings.length);

    // Log the first booking for debugging
    if (bookings.length > 0) {
      console.log("Sample booking:", {
        id: bookings[0]._id,
        user: bookings[0].user,
        movie: bookings[0].movie,
        status: bookings[0].status
      });
    }

    // Transform the bookings data to ensure all fields are properly formatted
    const formattedBookings = bookings.map(booking => {
      try {
        return {
          _id: booking._id,
          user: {
            name: booking.user?.name || 'N/A',
            email: booking.user?.email || 'N/A'
          },
          movie: {
            title: booking.movie?.title || 'N/A'
          },
          showtime: {
            date: booking.showtime?.date || new Date(),
            time: booking.showtime?.time || 'N/A'
          },
          seats: booking.seats || [],
          totalAmount: booking.totalAmount || 0,
          status: booking.status || 'pending',
          createdAt: booking.createdAt
        };
      } catch (err) {
        console.error("Error formatting booking:", err);
        return null;
      }
    }).filter(Boolean); // Remove any null entries

    res.status(200).json({
      success: true,
      bookings: formattedBookings
    });
  } catch (error) {
    console.error("Detailed error in getting all bookings:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    // Check for specific error types
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid data format in bookings",
        error: error.message
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error in bookings data",
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error in getting all bookings",
      error: error.message
    });
  }
};

// Get booked seats for a movie showtime
export const getBookedSeats = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date, time } = req.query;

    if (!movieId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Movie ID, date, and time are required"
      });
    }

    // Convert the date string to a Date object
    const showtimeDate = new Date(date);
    
    // Find all bookings for this movie and showtime
    const bookings = await Booking.find({
      movie: movieId,
      'showtime.date': {
        $gte: new Date(showtimeDate.setHours(0, 0, 0, 0)),
        $lt: new Date(showtimeDate.setHours(23, 59, 59, 999))
      },
      'showtime.time': time,
      status: { $in: ['pending', 'confirmed'] }
    });

    // Get all booked seats
    const bookedSeats = bookings.reduce((acc, booking) => {
      return [...acc, ...booking.seats];
    }, []);

    res.status(200).json({
      success: true,
      bookedSeats
    });
  } catch (error) {
    console.error("Error in getting booked seats:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting booked seats",
      error: error.message
    });
  }
}; 