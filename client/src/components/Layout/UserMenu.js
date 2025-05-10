import React from "react";
import { NavLink } from "react-router-dom";
const UserMenu = () => {
  return (
    <div>
      <div className="text-center">
        <div className="list-group">
          <h4>Dashboard</h4>
          <NavLink
            to="/dashboard/user/profile"
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
            to="/dashboard/user/orders"
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
            Orders
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;