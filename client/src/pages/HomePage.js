import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";

const HomePage = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState({ nowShowing: [], comingSoon: [] });
  const navigate = useNavigate();

  // Get all movies and extract unique genres
  const getAllMovies = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/movie/get-movies");
      if (data?.success) {
        const movies = data.movies;
        const nowShowingMovies = movies.filter(movie => movie.status === "now_showing");
        const comingSoonMovies = movies.filter(movie => movie.status === "coming_soon");
        setNowShowing(nowShowingMovies);
        setComingSoon(comingSoonMovies);
        setFilteredMovies({ nowShowing: nowShowingMovies, comingSoon: comingSoonMovies });
        
        // Extract unique genres from all movies
        const genres = [...new Set(movies.flatMap(movie => movie.genre))];
        setAvailableGenres(genres.sort());
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleGenreSelect = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const removeGenre = (genre) => {
    setSelectedGenres(selectedGenres.filter(g => g !== genre));
  };

  const handleSearch = () => {
    if (selectedGenres.length === 0) {
      setFilteredMovies({ nowShowing, comingSoon });
    } else {
      const filteredNowShowing = nowShowing.filter(movie => 
        selectedGenres.some(genre => movie.genre.includes(genre))
      );
      const filteredComingSoon = comingSoon.filter(movie => 
        selectedGenres.some(genre => movie.genre.includes(genre))
      );
      setFilteredMovies({ nowShowing: filteredNowShowing, comingSoon: filteredComingSoon });
    }
    setIsDropdownOpen(false);
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

  return (
    <Layout title={"Home - Movie Ticketing"}>
      <div className="container" style={{ marginTop: "-20px" }}>
        {/* Genre Filter */}
        <div className="row mb-2">
          <div className="col-md-12">
            <div className="d-flex gap-2" style={{ alignItems: 'flex-end' }}>
              <div className="genre-filter-container" style={{ position: 'relative', flex: 1 }}>
                <div 
                  className="form-select genre-filter"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ cursor: 'pointer', minHeight: '38px' }}
                >
                  {selectedGenres.length === 0 ? (
                    <span>Select Genres</span>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {selectedGenres.map(genre => (
                        <span 
                          key={genre} 
                          className="badge bg-primary d-flex align-items-center"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.2) !important',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '5px 10px',
                            borderRadius: '15px'
                          }}
                        >
                          {genre}
                          <button
                            className="btn-close btn-close-white ms-2"
                            style={{ fontSize: '0.5rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGenre(genre);
                            }}
                          />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {isDropdownOpen && (
                  <div 
                    className="genre-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      zIndex: 1000,
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    {availableGenres.map(genre => (
                      <div
                        key={genre}
                        className="genre-option"
                        onClick={() => handleGenreSelect(genre)}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          backgroundColor: selectedGenres.includes(genre) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                          color: '#fff'
                        }}
                      >
                        {genre}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleSearch}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '0.375rem 0.75rem',
                  height: '38px',
                  minWidth: '80px',
                  fontSize: '0.9rem',
                  margin: '0',
                  transform: 'translateY(0)',
                  transition: 'all 0.2s ease-in-out',
                  ':hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  ':active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(1px)'
                  }
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(1px)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="bi bi-search"></i>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Now Showing Section */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="section-title">Now Showing</h2>
          </div>
          {filteredMovies.nowShowing.length === 0 ? (
            <div className="col-12 text-center">
              <p>No movies currently showing</p>
            </div>
          ) : (
            filteredMovies.nowShowing.map((movie) => (
              <div key={movie._id} className="col-md-3 mb-4">
                <div 
                  className="card movie-card" 
                  onClick={() => handleMovieClick(movie._id)}
                  style={{ cursor: 'pointer' }}
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Coming Soon Section */}
        <div className="row">
          <div className="col-12 text-center">
            <h2 className="section-title">Coming Soon</h2>
          </div>
          {filteredMovies.comingSoon.length === 0 ? (
            <div className="col-12 text-center">
              <p>No upcoming movies</p>
            </div>
          ) : (
            filteredMovies.comingSoon.map((movie) => (
              <div key={movie._id} className="col-md-3 mb-4">
                <div 
                  className="card movie-card" 
                  onClick={() => handleMovieClick(movie._id)}
                  style={{ cursor: 'pointer' }}
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;