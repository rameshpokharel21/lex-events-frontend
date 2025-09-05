import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/api";

const SendOtp = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  //const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendOtp({ phoneNumber: phone });
      sessionStorage.setItem("pendingPhone", phone);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Phone Verification</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number"
        className="block-w-full border p-2 mb-4 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        Send OTP
      </button>
    </form>
  );
};

export default SendOtp;
