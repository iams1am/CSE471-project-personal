import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Form, Button, Table, Modal } from "react-bootstrap";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";

const Movies = () => {
  const [auth] = useAuth();
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
    genre: "",
    director: "",
    cast: "",
    duration: "",
    poster: "",
    status: "now_showing",
    price: "",
    showtimes: [
      {
        date: "",
        time: "",
        seats: 100
      }
    ]
  });

  // Fetch all movies
  const getAllMovies = async () => {
    try {
      const { data } = await axios.get("/movie/get-movies");
      if (data?.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting movies");
    }
  };

  useEffect(() => {
    getAllMovies();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert genre and cast strings to arrays
      const movieData = {
        ...formData,
        genre: formData.genre.split(",").map(g => g.trim()),
        cast: formData.cast.split(",").map(c => c.trim()),
        showtimes: formData.showtimes.map(st => ({
          ...st,
          date: new Date(st.date),
          seats: parseInt(st.seats)
        })),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration)
      };

      const { data } = await axios.post("/movie/create-movie", movieData);
      
      if (data?.success) {
        toast.success("Movie Created Successfully");
        setShowModal(false);
        getAllMovies();
        setFormData({
          title: "",
          description: "",
          releaseDate: "",
          genre: "",
          director: "",
          cast: "",
          duration: "",
          poster: "",
          status: "now_showing",
          price: "",
          showtimes: [
            {
              date: "",
              time: "",
              seats: 100
            }
          ]
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Handle movie deletion
  const handleDelete = async (movieId) => {
    try {
      const { data } = await axios.delete(`/movie/delete-movie/${movieId}`);
      if (data?.success) {
        toast.success("Movie Deleted Successfully");
        getAllMovies();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Add new showtime
  const addShowtime = () => {
    setFormData({
      ...formData,
      showtimes: [
        ...formData.showtimes,
        { date: "", time: "", seats: 100 }
      ]
    });
  };

  // Remove showtime
  const removeShowtime = (index) => {
    setFormData({
      ...formData,
      showtimes: formData.showtimes.filter((_, i) => i !== index)
    });
  };

  // Update showtime
  const updateShowtime = (index, field, value) => {
    const newShowtimes = [...formData.showtimes];
    newShowtimes[index] = { ...newShowtimes[index], [field]: value };
    setFormData({ ...formData, showtimes: newShowtimes });
  };

  return (
    <Layout title={"Movies Management"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h3>Movies Management</h3>
            <Button
              variant="primary"
              className="mb-3"
              onClick={() => setShowModal(true)}
            >
              Add New Movie
            </Button>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies?.map((movie) => (
                  <tr key={movie._id}>
                    <td>{movie.title}</td>
                    <td>{movie.genre.join(", ")}</td>
                    <td>{movie.status}</td>
                    <td>${movie.price}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(movie._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add/Edit Movie Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter movie title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter movie description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.releaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, releaseDate: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Genre (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Action, Drama, Comedy"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter director name"
                value={formData.director}
                onChange={(e) =>
                  setFormData({ ...formData, director: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cast (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Actor 1, Actor 2, Actor 3"
                value={formData.cast}
                onChange={(e) =>
                  setFormData({ ...formData, cast: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter duration in minutes"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Poster URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter poster URL"
                value={formData.poster}
                onChange={(e) =>
                  setFormData({ ...formData, poster: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                required
              >
                <option value="now_showing">Now Showing</option>
                <option value="coming_soon">Coming Soon</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter ticket price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Showtimes</Form.Label>
              {formData.showtimes.map((showtime, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <Form.Control
                    type="date"
                    value={showtime.date}
                    onChange={(e) => updateShowtime(index, "date", e.target.value)}
                    required
                  />
                  <Form.Control
                    type="time"
                    value={showtime.time}
                    onChange={(e) => updateShowtime(index, "time", e.target.value)}
                    required
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeShowtime(index)}
                    disabled={formData.showtimes.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={addShowtime}
                className="mt-2"
              >
                Add Showtime
              </Button>
            </Form.Group>

            <Button variant="primary" type="submit">
              {editingMovie ? "Update Movie" : "Add Movie"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default Movies; 