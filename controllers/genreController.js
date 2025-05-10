import Genre from "../models/Genre.js";

// Get all genres
export const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find({}).sort({ name: 1 });
    res.status(200).json({
      success: true,
      genres
    });
  } catch (error) {
    console.error("Error in getting genres:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting genres",
      error: error.message
    });
  }
};

// Create genre
export const createGenre = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Genre name is required"
      });
    }

    // Check if genre already exists
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res.status(400).json({
        success: false,
        message: "Genre already exists"
      });
    }

    const genre = await Genre.create({ name });
    res.status(201).json({
      success: true,
      message: "Genre created successfully",
      genre
    });
  } catch (error) {
    console.error("Error in creating genre:", error);
    res.status(500).json({
      success: false,
      message: "Error in creating genre",
      error: error.message
    });
  }
};

// Delete genre
export const deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    
    if (!genre) {
      return res.status(404).json({
        success: false,
        message: "Genre not found"
      });
    }

    await genre.deleteOne();
    res.status(200).json({
      success: true,
      message: "Genre deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleting genre:", error);
    res.status(500).json({
      success: false,
      message: "Error in deleting genre",
      error: error.message
    });
  }
}; 