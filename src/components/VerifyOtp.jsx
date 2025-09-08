import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingEmailVerification");
    if (!pending) {
      navigate("/send-otp");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await verifyOtp({ otp: otp });
      sessionStorage.setItem("emailVerifiedForEvent", "true");
      sessionStorage.removeItem("pendingEmailVerification");
      navigate("/events/create");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        pattern="\d{6}"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="block w-full border p-2 mb-4 rounded"
        required
      />
      <button type="submit">
        {isLoading ? "Verifying OTP..." : "Verify OTP"}
      </button>
    </form>
  );
};

export default VerifyOtp;
