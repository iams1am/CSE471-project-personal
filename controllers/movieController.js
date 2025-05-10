import Movie from "../models/Movie.js";

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error("Error in getting movies:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting movies",
      error,
    });
  }
};

// Get single movie
export const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }
    res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error("Error in getting movie:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting movie",
      error,
    });
  }
};

// Create movie
export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie,
    });
  } catch (error) {
    console.error("Error in creating movie:", error);
    res.status(500).json({
      success: false,
      message: "Error in creating movie",
      error,
    });
  }
};

// Update movie
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    console.error("Error in updating movie:", error);
    res.status(500).json({
      success: false,
      message: "Error in updating movie",
      error,
    });
  }
};

// Delete movie
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleting movie:", error);
    res.status(500).json({
      success: false,
      message: "Error in deleting movie",
      error,
    });
  }
};

// Search movies
export const searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    const movies = await Movie.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { genre: { $regex: q, $options: "i" } },
        { director: { $regex: q, $options: "i" } },
        { cast: { $regex: q, $options: "i" } },
      ],
    });
    res.status(200).json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error("Error in searching movies:", error);
    res.status(500).json({
      success: false,
      message: "Error in searching movies",
      error,
    });
  }
}; 