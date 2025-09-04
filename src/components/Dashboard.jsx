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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Welcome to Lex Events Dashboard!
      </h2>
      {isAuthenticated && user && (
        <>
          <p className="mb-4">
            Hello, <strong>{user.username}</strong>
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/events")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Events
            </button>
            <button
              onClick={() => navigate("/events/create")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create Event
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
