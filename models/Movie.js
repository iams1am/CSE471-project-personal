import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  genre: [{
    type: String,
    required: true
  }],
  director: {
    type: String,
    required: true
  },
  cast: [{
    type: String,
    required: true
  }],
  duration: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['now_showing', 'coming_soon'],
    required: true
  },
  showtimes: [{
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    seats: {
      type: Number,
      default: 100
    }
  }],
  price: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema); 