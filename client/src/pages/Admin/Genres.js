import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Form, Button, Table, Modal } from "react-bootstrap";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { FaPlus, FaTrash } from 'react-icons/fa';

const Genres = () => {
  const [auth] = useAuth();
  const [genres, setGenres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [genreName, setGenreName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all genres
  const getAllGenres = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/genre");
      if (data?.success) {
        setGenres(data.genres);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting genres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllGenres();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/genre", { name: genreName });
      if (data?.success) {
        toast.success("Genre Created Successfully");
        setShowModal(false);
        getAllGenres();
        setGenreName("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle genre deletion
  const handleDelete = async (genreId) => {
    if (window.confirm('Are you sure you want to delete this genre?')) {
      try {
        setLoading(true);
        const { data } = await axios.delete(`/genre/${genreId}`);
        if (data?.success) {
          toast.success("Genre Deleted Successfully");
          getAllGenres();
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Layout title={"Genres Management"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>Genres Management</h3>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                  disabled={loading}
                >
                  <FaPlus className="me-2" />
                  Add New Genre
                </button>
              </div>

              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {genres?.map((genre) => (
                      <tr key={genre._id}>
                        <td>{genre.name}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(genre._id)}
                            disabled={loading}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Genre Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Genre</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="genreName" className="form-label">
                      Genre Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="genreName"
                      value={genreName}
                      onChange={(e) => setGenreName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      'Add Genre'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop show"></div>}
    </Layout>
  );
};

export default Genres; 