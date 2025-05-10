import express from "express";
import {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  searchMovies,
} from "../controllers/movieController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/get-movies", getAllMovies);
router.get("/get-movie/:id", getMovie);
router.get("/search", searchMovies);

// Admin routes
router.post("/create-movie", requireSignIn, isAdmin, createMovie);
router.put("/update-movie/:id", requireSignIn, isAdmin, updateMovie);
router.delete("/delete-movie/:id", requireSignIn, isAdmin, deleteMovie);

export default router; 