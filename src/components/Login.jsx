import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import api from "../services/api";

const Login = () => {
  const { setAuth } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      setIsLoading(() => true);
      await api.post("/auth/login", form);
      const res = await api.get("auth/user");
      setAuth((prev) => ({ ...prev, isAuthenticated: true, user: res.data }));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(() => err.response?.data?.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded mt-10"
    >
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <input
        className="block w-full border px-3 py-2 mb-4 rounded"
        type="text"
        placeholder="username"
        value={form.username}
        key="username"
        id="username"
        name="username"
        onChange={handleChange}
      />

      <input
        className="block w-full border px-3 py-2 mb-4 rounded"
        type="password"
        placeholder="password"
        value={form.password}
        key="password"
        id="password"
        name="password"
        onChange={handleChange}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit
        </button>
      )}
    </form>
  );
};

export default Login;
