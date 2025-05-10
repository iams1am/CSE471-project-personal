import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const query = searchParams.get("q");

  useEffect(() => {
    const searchMovies = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/movie/search?q=${query}`);
        if (data?.success) {
          setMovies(data.movies);
        }
      } catch (error) {
        console.error("Error searching movies:", error);
        toast.error("Failed to search movies");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchMovies();
    } else {
      setLoading(false);
    }
  }, [query]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <Layout title="Searching...">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Search Results for "${query}"`}>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Search Results for "{query}"</h2>
        {!query ? (
          <div className="text-center">
            <h3>No search query provided</h3>
            <p>Please enter a search term in the search bar</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center">
            <h3>No movies found</h3>
            <p>Try searching with different keywords</p>
          </div>
        ) : (
          <div className="row">
            {movies.map((movie) => (
              <div key={movie._id} className="col-md-3 mb-4">
                <div
                  className="card movie-card"
                  onClick={() => handleMovieClick(movie._id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={movie.poster}
                    className="card-img-top"
                    alt={movie.title}
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text">{movie.genre.join(", ")}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        {movie.status === "now_showing" ? "Now Showing" : "Coming Soon"}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults; 