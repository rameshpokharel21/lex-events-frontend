import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";
import api from "../services/api";

const Navbar = () => {
  const { isAuthenticated, user, loading, setAuth } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setAuth({ isAuthenticated: false, user: null, loading: false });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed: ", err);
    }
  };
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      <NavLink to="/" className="text-xl font-bold hover:underline">
        Home
      </NavLink>

      {loading ? (
        <Spinner />
      ) : (
        <div className="space-x-4 flex items-center">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline">
                Welcome, {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : "hover:underline"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "underline font-semibold" : "hover:underline"
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
