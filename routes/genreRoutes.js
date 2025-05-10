import express from "express";
import { getAllGenres, createGenre, deleteGenre } from "../controllers/genreController.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllGenres);

// Admin routes
router.post("/", isAdmin, createGenre);
router.delete("/:id", isAdmin, deleteGenre);

export default router; 