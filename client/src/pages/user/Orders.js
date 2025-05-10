import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "../../utils/axios";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import PaymentModal from "../../components/Payment/PaymentModal";
import { Button } from "react-bootstrap";
import UserMenu from "../../components/Layout/UserMenu";

const Orders = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const getBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/booking/user-bookings");
      if (data?.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data?.message || "Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getBookings();
    }
  }, [auth?.token]);

  const handlePaymentClick = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const { data } = await axios.delete(`/booking/delete-booking/${bookingId}`);
      if (data?.success) {
        toast.success("Booking deleted successfully");
        getBookings(); // Refresh the bookings list
      } else {
        toast.error(data?.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error.response?.data?.message || "Failed to delete booking");
    }
  };

  const handlePaymentSuccess = () => {
    getBookings(); // Refresh the bookings list
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="container mt-4">
          <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Bookings">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center mb-4">Your Bookings</h1>
            {bookings.length === 0 ? (
              <div className="alert alert-info">
                You haven't made any bookings yet.
              </div>
            ) : (
            <div className="table-responsive">
                <table className="table table-bordered table-hover" style={{ backgroundColor: '#000', color: '#fff' }}>
                <thead>
                  <tr>
                      <th scope="col" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>#</th>
                      <th scope="col" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>Movie</th>
                      <th scope="col" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>Showtime</th>
                      <th scope="col" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>Seat No.</th>
                      <th scope="col" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>Amount</th>
                      <th scope="col" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>Status</th>
                      <th scope="col" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>Date</th>
                      <th scope="col" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={booking._id}>
                        <td>{index + 1}</td>
                        <td>{booking.movie?.title || 'N/A'}</td>
                        <td>
                          {booking.showtime?.date ? new Date(booking.showtime.date).toLocaleDateString() : 'N/A'} - {booking.showtime?.time || 'N/A'}
                        </td>
                        <td>{booking.seats?.join(", ") || 'N/A'}</td>
                        <td>${booking.totalAmount || 'N/A'}</td>
                        <td>
                          <span className={`badge bg-${booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning'}`}>
                            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                          </span>
                        </td>
                        <td>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            {booking.status !== 'confirmed' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handlePaymentClick(booking)}
                              >
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </td>
                  </tr>
                    ))}
                </tbody>
              </table>
            </div>
            )}

            <PaymentModal
              show={showPaymentModal}
              handleClose={() => setShowPaymentModal(false)}
              booking={selectedBooking}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;