import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import Spinner from "./Spinner";

const Dashboard = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading){
  
      if (!isAuthenticated) {
        navigate("/login", {replace: true});
      }else if (user?.roles?.includes("ROLE_ADMIN")) {
        navigate("/admin", {replace: true});
      
      }
    }
  }, [loading, isAuthenticated, navigate, user])

  if(loading) return <Spinner />; //show while checking auth;
  if(!isAuthenticated) return null; //waiting for redirect
  if(user?.roles?.includes("ROLE_ADMIN")) return null;//redirecting to admin
  
    return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg text-gray">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-center">
          Welcome to Lex Events Dashboard!
        </h2>
        
        <div className="p-4 md:p-8 font-sans leading-relaxed text-gray-800">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800">
            🎉 Bhetau Event Hub (
            <span className="font-nepali text-xl md:text-2xl">भेटौं</span>)
          </h2>

          <p className="text-base md:text-lg mb-3 md:mb-4">
            Step into the dashboard of our event sharing app—a vibrant space
            designed to keep you connected, inspired, and in control. Whether
            you're browsing for exciting happenings or ready to host your own,
            everything starts here.
          </p>

          <h3 className="text-lg md:text-xl font-bold mt-4 md:mt-6 mb-2 md:mb-3 text-gray-700">
            ✨ What You Can Do:
          </h3>
          <ul className="list-disc pl-4 md:pl-6 mb-3 md:mb-4 space-y-2">
            <li>
              <strong>Discover Events:</strong> Instantly view a curated list of
              upcoming events tailored to your interests.
            </li>
            <li>
              <strong>Share Your Event:</strong> Got something special to share?
              Start by verifying your email—it's quick and secure. Once
              verified, you'll be guided straight to our intuitive event
              creation form.
            </li>
          </ul>

          <p className="text-base md:text-lg font-medium mt-4 md:mt-6">
            So go ahead—explore, create, and connect. Your next great event
            starts right here.
          </p>
        </div>

        {isAuthenticated && user && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <button
                onClick={() => navigate("/events")}
                className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 w-full text-base"
              >
                View Events
              </button>
              <button
                onClick={() => navigate("/events/create")}
                className="bg-green-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-green-700 transition duration-300 w-full text-base"
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
