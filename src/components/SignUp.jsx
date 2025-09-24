import { useState } from "react";
import Spinner from "./Spinner";
import { register } from "../services/api";
import { NavLink } from "react-router-dom";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim
    ) {
      setError("All fields are Required except phone number.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.phoneNumber.trim() && !/^\d{10}$/.test(form.phoneNumber.trim())) {
      setError("Phone number must be 10 digits.");
      return;
    }

    if (form.password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword: _confirmPassword, ...data } = form;
      const _res = await register(data);
      setSuccess("Registered successfully! You can login now .");
      
      setForm({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Register failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <>
     <form
      onSubmit={handelSubmit}
      className="max-w-md mx-auto bg-white shadow-md p-6 rounded mt-10"
    >
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}

      <input
        className="block w-full border px-3 py-2 mb-4 rounded"
        type="text"
        placeholder="username"
        value={form.username}
        key="username"
        id="username"
        name="username"
        autoComplete="username"
        onChange={handleChange}
      />
      <input
        className="block w-full border px-3 py-2 mb-4 rounded"
        type="text"
        placeholder="Email"
        value={form.email}
        key="email"
        id="email"
        name="email"
        autoComplete="email"
        onChange={handleChange}
      />
      <input
        className="block w-full border px-3 py-2 mb-4 rounded"
        type="text"
        placeholder="Phone Number"
        value={form.phoneNumber}
        key="phoneNumber"
        id="phoneNumber"
        name="phoneNumber"
        onChange={handleChange}
      />

      <input
        className="block w-full border px-3 py-2 mb-4 rounded"
        type="password"
        placeholder="Password"
        value={form.password}
        key="password"
        id="password"
        name="password"
        autoComplete="new-password"
        onChange={handleChange}
      />

      <input
        className="block w-full border px-3 py-2 mb-4 rounded"
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        key="confirmPassword"
        id="confirmPassword"
        name="confirmPassword"
        autoComplete="new-password"
        onChange={handleChange}
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <button className="bg-green-300 text-white px-4 py-2 rounded hover:bg-green-500 w-full">
          Submit
        </button>
      )}
    </form>
    <div flex justify-center mt-4>
      <NavLink to="/login"
        className="w-full max-w-xs px-4 py-2 text-center text-white bg-blue-400 hover:bg-blue-500 rounded transition duration-300"
        >
          Back to Login
        </NavLink>
    </div>
   </>
  );
};

export default SignUp;
