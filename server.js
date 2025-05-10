import express from "express";
import colors from "colors/safe.js";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";

//configure env - must be first
dotenv.config();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", movieRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/genre", genreRoutes);

//rest api
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Movie Ticketing System</h1>");
});

//port
const PORT = process.env.PORT || 8080;

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(
        colors.cyan(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`)
      );
      console.log(colors.cyan(`http://localhost:${PORT}`));
    });
  } catch (err) {
    console.error(colors.red("Server Error:"), err);
    process.exit(1);
  }
};

startServer();