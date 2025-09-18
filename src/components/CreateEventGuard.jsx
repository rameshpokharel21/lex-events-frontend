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

      const alreadyVerified = sessionStorage.getItem("emailVerifiedForEvent");
      const verifiedAt = sessionStorage.getItem("emailVerifiedAt");

      //check if alreadyverified flag AND timestamp are available
      if (alreadyVerified === "true" && verifiedAt) {
        const now = Date.now();
        const expiryMillis = 5 * 60 * 1000;
        const verifiedTime = parseInt(verifiedAt, 10);
        if (now - verifiedTime < expiryMillis) {
          setIsLoading(false);
          return;
        } else {
          //expired, clean up
          sessionStorage.removeItem("emailVerifiedForEvent");
          sessionStorage.removeItem("emailVerifiedAt");
        }
      }

      //check with backend if expired or not
      try {
        const res = await isEmailVerified();
        if (res.data.verified) {
          sessionStorage.setItem("emailVerifiedForEvent", "true");
          sessionStorage.setItem("emailVerifiedAt", Date.now().toString());
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
