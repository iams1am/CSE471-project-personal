import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import toast from "react-hot-toast";

const Showtimes = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getMovies = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/movie/get-movies");
      if (data?.success) {
        setMovies(data.movies.filter(movie => movie.status === "now_showing"));
      } else {
        toast.error(data?.message || "Failed to load movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error(error.response?.data?.message || "Failed to load movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleBookNow = (movieId) => {
    navigate(`/movie/${movieId}`);
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
    <Layout title="Movie Showtimes">
      <Container fluid className="p-4">
        <h1 className="text-center mb-4 text-white">It's ShowTime!</h1>
        <Row className="g-4">
          {movies.map((movie) => (
            <Col key={movie._id} xs={12} md={6} lg={4} xl={3}>
              <Card className="h-100" style={{ backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333' }}>
                <Card.Img
                  variant="top"
                  src={movie.poster}
                  alt={movie.title}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="text-white">{movie.title}</Card.Title>
                  <Card.Text className="text-white-50">
                    {movie.description?.substring(0, 100)}...
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-white-50">Duration: {movie.duration} mins</small>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => handleBookNow(movie._id)}
                    >
                      Book Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
};

export default Showtimes; 