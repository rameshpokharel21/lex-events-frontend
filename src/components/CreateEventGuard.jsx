import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

const maxTime = import.meta.env.VITE_OTP_MAX_AGE_MS;

const isOtpStillValid = () => {
  const verified = sessionStorage.getItem("emailVerifiedForEvent");
  const timestamp = sessionStorage.getItem("emailVerifiedAt");
  if (verified !== "true" || !timestamp) return false;
  const age = Date.now() - parseInt(timestamp, 15);
  return age <= maxTime;
};

const CreateEventGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isOtpStillValid()) {
      setIsLoading(false);
    } else {
      sessionStorage.removeItem("emailVerifiedForEvent");
      sessionStorage.removeItem("emailVerifiedAt");

      navigate("/send-otp", {
        state: { fromCreateEvent: true },
      });
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) return <Spinner />;
  return <>{children}</>;
};
export default CreateEventGuard;
