import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { login, getUser } from "../services/api";

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
      //1.Login api call
      await login(form);
      //2.Fetch User details
      const res = await getUser();
      //console.log("From Login: user: ", res.data);
      //3.update with auth context
      setAuth((prev) => ({ ...prev, isAuthenticated: true, user: res.data }));
      //4.Redirect based on role
      if (res.data.roles.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
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
        autoComplete="username"
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
        autoComplete="current-password"
        onChange={handleChange}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex justify-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit
        </button>
        </div>
      )}
    </form>
  );
};

export default Login;
