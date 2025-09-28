import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { isEmailVerified } from "../services/api";

const CreateEventGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOtp = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      const verified = sessionStorage.getItem("emailVerifiedForEvent");
      const verifiedUntil = sessionStorage.getItem("emailVerifiedUntil");

      if (verified === "true" && verifiedUntil) {
        const expiryTime = parseInt(verifiedUntil, 5);
        if (Date.now() < expiryTime) {
          setIsLoading(false);
          return;
        } else {
          //expired, clean up
          sessionStorage.removeItem("emailVerifiedForEvent");
          sessionStorage.removeItem("emailVerifiedUntil");
        }
      }

      //Fallback to backend
      try {
        const res = await isEmailVerified(); //expects 'verified' and 'expiresAt' from VerificationStatusResponse dto
        if (res.data.verified && res.data.expiresAt) {
          const expiryTime = new Date(res.data.expiresAt).getTime();
          sessionStorage.setItem("emailVerifiedForEvent", "true");
          sessionStorage.setItem("emailVerifiedUntil", expiryTime.toString());
          setIsLoading(false);
        } else {
          navigate("/send-otp");
        }
      } catch (err) {
        console.error("Error verifying email", err);
        navigate("/send-otp");
      }
    };

    checkOtp();
  }, [isAuthenticated, navigate]);

  if (isLoading) return <Spinner />;
  return <>{children}</>;
};
export default CreateEventGuard;
