import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/api";

const SendOtp = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      await sendOtp();

      navigate("/verify-otp", {
        state: { fromCreateEvent: true },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded text-center">
      <h2 className="text-xl font-bold mb-4">Verify your Email</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </button>
    </div>
  );
};

export default SendOtp;
