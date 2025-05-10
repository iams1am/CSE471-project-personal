import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";

const Users = () => {
  const [auth] = useAuth();
  const [users, setUsers] = useState([]);

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/auth/all-users", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      if (data?.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting users");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/auth/delete-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data?.success) {
        toast.success("User Deleted Successfully");
        getAllUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Users Management"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>All Users</h3>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.address}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.role === 1 ? "bg-danger" : "bg-success"
                            }`}
                          >
                            {user.role === 1 ? "Admin" : "User"}
                          </span>
                        </td>
                        <td>
                          {user.role !== 1 && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(user._id)}
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;