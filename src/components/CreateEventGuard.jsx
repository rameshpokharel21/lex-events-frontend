import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import Spinner from "./Spinner";

const CreateEventGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const pending = sessionStorage.getItem("pendingEmailVerification");
  const emailVerified = sessionStorage.getItem("emailVerifiedForEvent");
  const requireEmailVerification =
    import.meta.env.VITE_REQUIRE_EMAIL_VERIFICATION === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (requireEmailVerification && !pending && !emailVerified) {
      navigate("/send-otp");
    }
  }, [
    isAuthenticated,
    emailVerified,
    pending,
    navigate,
    requireEmailVerification,
  ]);

  return isAuthenticated && (!requireEmailVerification || emailVerified) ? (
    children
  ) : (
    <Spinner />
  );
};

export default CreateEventGuard;
