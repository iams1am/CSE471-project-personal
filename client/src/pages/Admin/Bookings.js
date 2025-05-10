import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Table, Button, Badge } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";

const Bookings = () => {
  const [auth] = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all bookings
  const getAllBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!auth?.token) {
        throw new Error("No authentication token found");
      }
      
      console.log("Fetching bookings with token:", auth?.token ? "Token exists" : "No token");
      
      const { data } = await axios.get("http://localhost:8080/api/v1/booking/all-bookings", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      
      console.log("Bookings response:", data);
      
      if (data?.success) {
        setBookings(data.bookings || []);
      } else {
        throw new Error(data?.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong in getting bookings";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllBookings();
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
  }, [auth?.token]);

  // Handle booking deletion
  const handleDelete = async (bookingId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/booking/delete-booking/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data?.success) {
        toast.success("Booking Deleted Successfully");
        getAllBookings();
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Handle status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/v1/booking/update-status/${bookingId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data?.success) {
        toast.success(`Booking ${newStatus} successfully`);
        getAllBookings();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
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

  if (error) {
    return (
      <Layout title="Error">
        <div className="container mt-4">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={"Bookings Management"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
              <h3 className="mb-4">Bookings Management</h3>
              {bookings.length === 0 ? (
                <div className="alert alert-info">
                  No bookings found.
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Movie</th>
                        <th>Showtime</th>
                        <th>Seats</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => (
                        <tr key={booking._id}>
                          <td>{index + 1}</td>
                          <td>{booking.user?.name || 'N/A'}</td>
                          <td>{booking.movie?.title || 'N/A'}</td>
                          <td>
                            {new Date(booking.showtime?.date).toLocaleDateString()} - {booking.showtime?.time || 'N/A'}
                          </td>
                          <td>{booking.seats?.join(", ") || 'N/A'}</td>
                          <td>${booking.totalAmount || 'N/A'}</td>
                          <td>
                            <Badge
                              bg={
                                booking.status === "confirmed"
                                  ? "success"
                                  : booking.status === "cancelled"
                                  ? "danger"
                                  : "warning"
                              }
                            >
                              {booking.status || 'pending'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {booking.status !== "cancelled" && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                                >
                                  Cancel
                                </Button>
                              )}
                              {booking.status === "pending" && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                                >
                                  Confirm
                                </Button>
                              )}
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(booking._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bookings; 