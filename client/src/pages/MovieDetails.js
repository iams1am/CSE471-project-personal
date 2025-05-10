import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();

  // Get movie details
  const getMovieDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/movie/get-movie/${id}`);
      if (data?.success) {
        setMovie(data.movie);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
      toast.error("Failed to load movie details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // Get booked seats for selected showtime
  const getBookedSeats = async () => {
    if (!selectedShowtime) return;

    try {
      const { data } = await axios.get(`/booking/booked-seats/${id}`, {
        params: {
          date: new Date(selectedShowtime.date).toISOString(),
          time: selectedShowtime.time
        }
      });
      
      if (data?.success) {
        setBookedSeats(data.bookedSeats);
      }
    } catch (error) {
      console.error("Error fetching booked seats:", error);
      toast.error("Failed to load seat availability");
    }
  };

  useEffect(() => {
    getMovieDetails();
  }, [id]);

  useEffect(() => {
    if (selectedShowtime) {
      getBookedSeats();
    }
  }, [selectedShowtime]);

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    setBookedSeats([]);
  };

  const handleSeatSelect = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      toast.error("This seat is already booked");
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    if (!auth?.user) {
      toast.error("Please login to book tickets");
      navigate("/login");
      return;
    }

    if (!selectedShowtime || selectedSeats.length === 0) {
      toast.error("Please select a showtime and seats");
      return;
    }

    try {
      const bookingData = {
        movieId: movie._id,
        showtime: {
          date: selectedShowtime.date,
          time: selectedShowtime.time
        },
        seats: selectedSeats,
        totalAmount: selectedSeats.length * movie.price
      };

      const { data } = await axios.post("/booking/create-booking", bookingData);
      
      if (data?.success) {
        toast.success("Booking successful!");
        navigate("/dashboard/user/Orders");
      } else {
        toast.error(data?.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error("Please login to book tickets");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to create booking. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout title="Movie Not Found">
        <div className="container mt-5">
          <div className="alert alert-danger">
            Movie not found. Please try again.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={movie.title}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <img
              src={movie.poster}
              alt={movie.title}
              className="img-fluid rounded"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="col-md-8">
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <p><strong>Genre:</strong> {movie.genre?.join(", ")}</p>
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Cast:</strong> {movie.cast?.join(", ")}</p>
            <p><strong>Duration:</strong> {movie.duration} minutes</p>
            <p><strong>Price:</strong> ${movie.price}</p>
            
            {movie.status === "now_showing" && (
              <>
                <div className="mb-4">
                  <h4>Showtimes</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {movie.showtimes.map((showtime, index) => (
                      <button
                        key={index}
                        className={`btn ${
                          selectedShowtime === showtime
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => handleShowtimeSelect(showtime)}
                      >
                        {new Date(showtime.date).toLocaleDateString()} - {showtime.time}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedShowtime && (
                  <div className="mb-4">
                    <h4>Select Seats</h4>
                    <div className="screen-container mb-4">
                      <div className="screen">
                        <div className="screen-content">
                          <span>SCREEN</span>
                        </div>
                      </div>
                    </div>
                    <div className="seat-grid">
                      {Array.from({ length: 50 }, (_, i) => i + 1).map((seat) => (
                        <button
                          key={seat}
                          className={`seat ${
                            selectedSeats.includes(seat) 
                              ? "selected" 
                              : bookedSeats.includes(seat)
                              ? "booked"
                              : ""
                          }`}
                          onClick={() => handleSeatSelect(seat)}
                          disabled={bookedSeats.includes(seat)}
                        >
                          {seat}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <div className="d-flex gap-3">
                        <div className="d-flex align-items-center">
                          <div className="seat-sample available me-2"></div>
                          <span>Available</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="seat-sample selected me-2"></div>
                          <span>Selected</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="seat-sample booked me-2"></div>
                          <span>Booked</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedShowtime && selectedSeats.length > 0 && (
                  <div className="booking-summary">
                    <h4>Booking Summary</h4>
                    <p>Selected Seats: {selectedSeats.join(", ")}</p>
                    <p>Total Amount: ${selectedSeats.length * movie.price}</p>
                    <button
                      className="btn btn-success"
                      onClick={handleBooking}
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </>
            )}

            {movie.status === "coming_soon" && (
              <div className="alert alert-info">
                This movie will be available for booking soon. Stay tuned!
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MovieDetails; 