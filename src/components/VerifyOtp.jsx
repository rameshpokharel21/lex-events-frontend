import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const phone = sessionStorage.getItem("pendingPhone");

  useEffect(() => {
    if (!phone) {
      navigate("/send-otp");
    }
  }, [phone, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({ phoneNumber: phone, otp: otp });
      sessionStorage.setItem("phoneVerifiedForEvent", "true");
      sessionStorage.removeItem("pendingPhone");
      navigate("/events/create");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
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
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="block w-full border p-2 mb-4 rounded"
        required
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
      >
        Verify OTP
      </button>
    </form>
  );
};

export default VerifyOtp;
