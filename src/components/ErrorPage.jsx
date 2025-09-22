import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ErrorPage = () => {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found.</h1>
      <p className="mb-6">Sorry, the page you are looking for doesn't exist.</p>
      <NavLink to="/login" className="text-blue-500 underline">
        Go back to Home
      </NavLink>
    </div>
  );
};

export default ErrorPage;
