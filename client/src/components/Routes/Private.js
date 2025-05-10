import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import Spinner from "../Spinner";
import toast from "react-hot-toast";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("/auth/user-auth");
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setOk(false);
        navigate("/login");
      }
    };
    if (auth?.token) {
      authCheck();
    } else {
      setOk(false);
      navigate("/login");
    }
  }, [auth?.token, navigate]);

  return ok ? <Outlet /> : <Spinner />;
}