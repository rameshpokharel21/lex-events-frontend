import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendOtp } from "../services/api";

const SendOtp = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fromCreateEvent = location.state?.fromCreateEvent || false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      await sendOtp();
      navigate("/verify-otp", { state: { fromCreateEvent } });
    } catch (err) {
      if (err.response?.status === 429) {
        // A code was sent less than a minute ago and is still valid: go enter it.
        navigate("/verify-otp", {
          state: { fromCreateEvent, notice: err.response.data.message },
        });
        return;
      }
      setError(err.response?.data?.message || "Failed to send the verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded text-center">
      <h2 className="text-xl font-bold mb-2">Verify your Email</h2>
      <p className="text-gray-600 mb-4 text-sm">
        To create an event, confirm your email with a 6-digit code.
        After verifying, you can create events for 10 minutes.
      </p>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full disabled:opacity-60"
      >
        {isLoading ? "Sending..." : "Send code"}
      </button>
    </div>
  );
};

export default SendOtp;
