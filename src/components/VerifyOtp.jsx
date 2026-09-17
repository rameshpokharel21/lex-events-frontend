import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const [notice, setNotice] = useState(location.state?.notice || "");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    try {
      setIsLoading(true);
      // Backend returns { verified: true, expiresAt } — the 10-minute window starts now
      const status = await verifyOtp({ otp: otp.trim() });
      queryClient.setQueryData(["email-verification"], status);
      await queryClient.invalidateQueries({ queryKey: ["email-verification"] });

      const fromCreateEvent =
        location.state?.fromCreateEvent || sessionStorage.getItem("createEventFlow") === "true";
      sessionStorage.removeItem("createEventFlow");

      navigate(fromCreateEvent ? "/events/create" : "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setNotice("");
    try {
      setIsResending(true);
      await sendOtp();
      setOtp("");
      setNotice("A new code was sent to your email.");
    } catch (err) {
      // 429 = cooldown; 503 = email could not be sent
      setError(err.response?.data?.message || "Failed to resend the code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Enter verification code</h2>
      {notice && <p className="text-green-600 mb-2">{notice}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        placeholder="Enter 6-digit code"
        className="block w-full border p-2 mb-4 rounded"
        autoFocus
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
        {isLoading ? "Verifying..." : "Verify"}
      </button>
      <button
        type="button"
        onClick={handleResend}
        disabled={isResending}
        className="w-full mt-3 text-sm text-blue-600 hover:underline disabled:opacity-60"
      >
        {isResending ? "Sending..." : "Didn't get a code? Resend"}
      </button>
    </form>
  );
};

export default VerifyOtp;
