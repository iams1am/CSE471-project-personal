import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPasssword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Profile from "./pages/user/Profile";
import AddMovies from "./pages/Admin/AddMovies";
import Users from './pages/Admin/Users';
import Orders from './pages/user/Orders';
import MovieDetails from './pages/MovieDetails';
import Showtimes from "./pages/Showtimes";
import SearchResults from "./pages/SearchResults";
import Movies from "./pages/Admin/Movies";
import Bookings from "./pages/Admin/Bookings";
import AdminProfile from './pages/Admin/AdminProfile';
import AdminOrders from './pages/Admin/AdminOrders';

function App() {
  return (
    <Container fluid className="p-0">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
        <Route path="user" element={<Dashboard />} />
        <Route path="user/profile" element={<Profile />} />
          <Route path="user/orders" element={<Orders />} />
        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/profile" element={<AdminProfile />} />
          <Route path="admin/movies" element={<Movies />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/bookings" element={<Bookings />} />
          <Route path="admin/orders" element={<AdminOrders />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasssword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/showtimes" element={<Showtimes />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </Container>
  );
}

export default App;