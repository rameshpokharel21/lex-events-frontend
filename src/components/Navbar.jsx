import { NavLink,  useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";
import api from "../services/api";
import EventShareLogo from "./EventShareLogo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => await api.post("/auth/logout"),
    onSettled: () => {
      queryClient.setQueryData(["user"], null);
      navigate("/login", {replace: true});
    },

    onError: err => {
      console.error("Logout failed: ", err);
    },
  });

  const handleLogout = () => logoutMutation.mutate();

  return (
    <div>
      <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <NavLink to={isAuthenticated ? "/dashboard" : "/" }
          className="text-xl font-bold hover:underline">
          {isAuthenticated ? "Dashboard" : "Home"}
        </NavLink>

        <EventShareLogo
          size="small"
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
                  disabled={logoutMutation.isPending}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
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
