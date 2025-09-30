import { NavLink,  useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";
import api from "../services/api";
import EventShareLogo from "./EventShareLogo";

const Navbar = () => {
  const { isAuthenticated, user, loading, setAuth } = useAuth();

  const navigate = useNavigate();

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      
    } catch (err) {
      console.error("Logout failed: ", err);
    }finally{
      setAuth({ isAuthenticated: false, user: null, loading: false });
      sessionStorage.clear();
      navigate("/login", {replace: true});
    }
  };
  return (
    <div>
      <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <NavLink to={isAuthenticated ? "/dashboard" : "/" }
          className="text-xl font-bold hover:underline">
          {isAuthenticated ? "Dashboard" : "Home"}
        </NavLink>

        <EventShareLogo
          width={160}
          height={44}
          className="hover:opacity-90 transition-opacity"
        />

        {loading ? (
          <Spinner />
        ) : (
          <div className="space-x-4 flex items-center">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline">
                  Welcome, {user?.username}
                </span>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="bg-purple-500 px-3 py-1 rounded hover:bg-purple-600"
                  >
                    Admin
                  </NavLink>
                )}
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
                  Log In
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
    </div>
  );
};

export default Navbar;
