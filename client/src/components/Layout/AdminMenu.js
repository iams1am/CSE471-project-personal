import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div>
      <div className="text-center">
        <div className="list-group">
          <h4>Admin Panel</h4>
          <NavLink
            to="/dashboard/admin/profile"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${
                isActive ? "active" : ""
              }`
            }
            style={{
              textDecoration: "none",
              color: "#fff",
              position: "relative",
              padding: "10px 15px",
              transition: "all 0.3s ease",
              backgroundColor: "#2d2d2d",
              fontWeight: "bold",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/admin/movies"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${
                isActive ? "active" : ""
              }`
            }
            style={{
              textDecoration: "none",
              color: "#fff",
              position: "relative",
              padding: "10px 15px",
              transition: "all 0.3s ease",
              backgroundColor: "#2d2d2d",
              fontWeight: "bold",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            Movies
          </NavLink>
          <NavLink
            to="/dashboard/admin/users"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${
                isActive ? "active" : ""
              }`
            }
            style={{
              textDecoration: "none",
              color: "#fff",
              position: "relative",
              padding: "10px 15px",
              transition: "all 0.3s ease",
              backgroundColor: "#2d2d2d",
              fontWeight: "bold",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            User List
          </NavLink>
          <NavLink
            to="/dashboard/admin/bookings"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${
                isActive ? "active" : ""
              }`
            }
            style={{
              textDecoration: "none",
              color: "#fff",
              position: "relative",
              padding: "10px 15px",
              transition: "all 0.3s ease",
              backgroundColor: "#2d2d2d",
              fontWeight: "bold",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            User Bookings
          </NavLink>
          <NavLink
            to="/dashboard/admin/orders"
            className={({ isActive }) =>
              `list-group-item list-group-item-action ${
                isActive ? "active" : ""
              }`
            }
            style={{
              textDecoration: "none",
              color: "#fff",
              position: "relative",
              padding: "10px 15px",
              transition: "all 0.3s ease",
              backgroundColor: "#2d2d2d",
              fontWeight: "bold",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            All Orders
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;