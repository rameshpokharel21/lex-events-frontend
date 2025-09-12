import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import Spinner from "./Spinner";

const Dashboard = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <Spinner />;
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 text-white">
      <div className="max-2-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          Welcome to Lex Events Dashboard!
        </h2>
        {isAuthenticated && user && (
          <>
            <p className="mb-6 text-lg text-center">
              Hello, <strong>{user.username}</strong>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => navigate("/events")}
                className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                View Events
              </button>
              <button
                onClick={() => navigate("/events/create")}
                className="bg-green-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Create Event
              </button>

              <button
                onClick={() => navigate("/random")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
              >
                Form
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
