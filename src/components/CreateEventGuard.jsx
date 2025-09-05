import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CreateEventGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const phoneVerified =
    sessionStorage.getItem("phoneVerifiedForEvent") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (!phoneVerified) {
    return <Navigate to="/send-otp" />;
  }
  return children;
};

export default CreateEventGuard;
