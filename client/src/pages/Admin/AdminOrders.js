import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Table, Button, Badge } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";

const AdminOrders = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all orders
  const getAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!auth?.token) {
        throw new Error("No authentication token found");
      }

      const { data } = await axios.get("http://localhost:8080/api/v1/booking/all-bookings", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      
      if (data?.success) {
        setOrders(data.bookings || []);
      } else {
        throw new Error(data?.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong in getting orders";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getAllOrders();
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
  }, [auth?.token]);

  // Handle order deletion
  const handleDelete = async (orderId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/booking/delete-booking/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data?.success) {
        toast.success("Order Deleted Successfully");
        getAllOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
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
    <Layout title={"Admin Orders"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
              <h3 className="mb-4">All Orders</h3>
              {orders.length === 0 ? (
                <div className="alert alert-info">
                  No orders found.
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
                      {orders.map((order, index) => (
                        <tr key={order._id}>
                          <td>{index + 1}</td>
                          <td>{order.user?.name || 'N/A'}</td>
                          <td>{order.movie?.title || 'N/A'}</td>
                          <td>
                            {new Date(order.showtime?.date).toLocaleDateString()} - {order.showtime?.time || 'N/A'}
                          </td>
                          <td>{order.seats?.join(", ") || 'N/A'}</td>
                          <td>${order.totalAmount || 'N/A'}</td>
                          <td>
                            <Badge
                              bg={
                                order.status === "confirmed"
                                  ? "success"
                                  : order.status === "cancelled"
                                  ? "danger"
                                  : "warning"
                              }
                            >
                              {order.status || 'pending'}
                            </Badge>
                          </td>
                          <td>
                            {order.status === "pending" && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(order._id)}
                              >
                                Delete
                              </Button>
                            )}
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

export default AdminOrders; 