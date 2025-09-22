import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import Spinner from "./Spinner";

const Dashboard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <Spinner />;
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (user?.roles?.includes("ROLE_ADMIN")) {
    navigate("/admin");
    return null;
  }

  
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 text-white">
      <div className="max-2-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          Welcome to Lex Events Dashboard!
        </h2>
        <div
          style={{
            padding: "2rem",
            fontFamily: "Segoe UI, sans-serif",
            lineHeight: "1.6",
            color: "#333",
          }}
        >
          <h2
            style={{ fontSize: "2rem", marginBottom: "1rem", color: "#2c3e50" }}
          >
            🎉 Welcome to Bhetau event hub (
            <span className="font-nepali text-2xl">भेटाैं</span>)
          </h2>

          <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            Step into the dashboard of our event sharing app—a vibrant space
            designed to keep you connected, inspired, and in control. Whether
            you're browsing for exciting happenings or ready to host your own,
            everything starts here.
          </p>

          <h3
            style={{
              fontSize: "1.5rem",
              marginTop: "2rem",
              marginBottom: "1rem",
              color: "#34495e",
            }}
          >
            ✨ What You Can Do:
          </h3>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Discover Events:</strong> Instantly view a curated list of
              upcoming events tailored to your interests.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Share Your Event:</strong> Got something special to share?
              Start by verifying your email—it’s quick and secure. Once
              verified, you’ll be guided straight to our intuitive event
              creation form.
            </li>
          </ul>

          <p
            style={{ fontSize: "1.1rem", fontWeight: "500", marginTop: "2rem" }}
          >
            So go ahead—explore, create, and connect. Your next great event
            starts right here.
          </p>
        </div>

        {isAuthenticated && user && (
          <>
            <p className="mb-6 text-lg text-center">
              Hello, <strong>{user.username}</strong>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-2 justify-items-center gap-4 mb-6">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
