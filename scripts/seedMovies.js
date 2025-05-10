import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/Movie.js';

dotenv.config();

const sampleMovies = [
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseDate: "2008-07-18",
    genre: ["Action", "Crime", "Drama"],
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    duration: "152",
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    status: "now_showing",
    showtimes: [
      {
        date: new Date("2024-03-20"),
        time: "10:00 AM",
        seats: 100
      },
      {
        date: new Date("2024-03-20"),
        time: "2:00 PM",
        seats: 100
      },
      {
        date: new Date("2024-03-20"),
        time: "6:00 PM",
        seats: 100
      },
      {
        date: new Date("2024-03-20"),
        time: "10:00 PM",
        seats: 100
      }
    ],
    price: 12.99
  },
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseDate: "2010-07-16",
    genre: ["Action", "Adventure", "Sci-Fi"],
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    duration: "148",
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    status: "now_showing",
    showtimes: [
      {
        date: new Date("2024-03-20"),
        time: "11:00 AM",
        seats: 100
      },
      {
        date: new Date("2024-03-20"),
        time: "3:00 PM",
        seats: 100
      },
      {
        date: new Date("2024-03-20"),
        time: "7:00 PM",
        seats: 100
      },
      {
        date: new Date("2024-03-20"),
        time: "11:00 PM",
        seats: 100
      }
    ],
    price: 13.99
  },
  {
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseDate: "1999-03-31",
    genre: ["Action", "Sci-Fi"],
    director: "Lana Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    duration: "136",
    poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    status: "coming_soon",
    showtimes: [
      {
        date: new Date("2024-03-25"),
        time: "12:00 PM",
        seats: 100
      },
      {
        date: new Date("2024-03-25"),
        time: "4:00 PM",
        seats: 100
      },
      {
        date: new Date("2024-03-25"),
        time: "8:00 PM",
        seats: 100
      }
    ],
    price: 11.99
  }
];

const seedMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Insert sample movies
    await Movie.insertMany(sampleMovies);
    console.log('Added sample movies');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding movies:', error);
    process.exit(1);
  }
};

seedMovies(); 