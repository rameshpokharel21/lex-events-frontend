import { useState } from "react";
import Spinner from "./Spinner";
import { register } from "../services/api";
import { NavLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: (registerInfo) => register(registerInfo),
    onSuccess: () => {
      setForm({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    },
  })

  const getApiError = err => {
    if(err?.code === "ECONNABORTED" || err?.response?.status === 502){
          return "Server is starting up. Please try again!";
    }
      
    return err.response?.data?.message || "Registration failed.";
        
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    mutation.reset();

    // Basic validation
    if (
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim
    ) {
      setValidationError("All fields are Required except phone number.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (form.phoneNumber.trim() && !/^\d{10}$/.test(form.phoneNumber.trim())) {
      setValidationError("Phone number must be 10 digits.");
      return;
    }

    if (form.password.trim().length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    const {confirmPassword: _confirmPassword, ...data} = form;
    mutation.mutate(data);
    
  };

  return (
   <div className="max-w-md mx-auto mt-10">
     <form
      onSubmit={handelSubmit}
      className="bg-white shadow-md p-6 rounded mt-10"
    >
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {validationError && <div className="text-red-500 mb-2">{validationError}</div>}
      {mutation.error && <div className="text-red-500 mb-2">{getApiError(mutation.error)}</div>}
      {mutation.isSuccess && <div className="text-green-600 mb-2">Registered successfully! You can log in now.</div>}

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
      {mutation.isPending ? (
        <div>
          <Spinner />
          <p className="text-gray-600 px-8">
            Server is starting up... may take longer...
          </p>
        </div>
      ) : (
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
          Submit
        </button>
      )}
    </form>
    <div className="flex justify-center mt-4">
      <NavLink to="/login"
        className="w-full max-w-xs px-4 py-2 text-center text-white bg-blue-400 hover:bg-blue-500 rounded transition duration-300"
        >
          Back to Login form
        </NavLink>
    </div>
   </div>
  );
};

export default SignUp;
