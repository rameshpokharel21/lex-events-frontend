import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      await verifyOtp({ otp: otp }); //backend marks EmailVerification as verified
      sessionStorage.setItem("emailVerifiedForEvent", "true");
      sessionStorage.setItem("emailVerifiedAt", Date.now().toString());

      if (location.state?.fromCreateEvent) {
        navigate("/events/create");
      } else {
        navigate("/"); //fallback
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
      sessionStorage.removeItem("emailVerifiedForEvent");
      sessionStorage.removeItem("emailVerifiedAt");
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
        placeholder="Enter 6-digit OTP"
        className="block w-full border p-2 mb-4 rounded"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
          isLoading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isLoading ? "Verifying OTP..." : "Verify OTP"}
      </button>
    </form>
  );
};

export default VerifyOtp;
