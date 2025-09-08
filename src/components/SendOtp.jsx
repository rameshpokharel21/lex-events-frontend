import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/api";

const SendOtp = () => {
  //const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await sendOtp();
      sessionStorage.setItem("pendingEmailVerification", "true");
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={isLoading}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
    >
      {isLoading ? "Sending..." : "Send OTP"}
    </button>
  );
};

export default SendOtp;
