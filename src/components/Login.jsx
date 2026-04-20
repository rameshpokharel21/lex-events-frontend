import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { login } from "../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    //clear error on typing
    if(error) setError("");
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (loginResponse) => {
      queryClient.setQueryData(["user"], {
        id: loginResponse.userId,
        username: loginResponse.username,
        roles: loginResponse.roles,
      });

      if(loginResponse.roles?.includes("ROLE_ADMIN")){
        navigate("/admin");
      }else{
        navigate("/");
      }
    },

    onError: (err) => {
      console.log("Login error details: ", err);
       if(err.code === "ECONNABORTED" || err.response?.status === 502){
        setError("Server is starting up. Please try again!");
      }else if(err.response?.status === 401){
        setError("Invalid username or password");
      }else{
        setError(() => err.response?.data?.message || "Login failed");
      }
    },

  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded mt-10"
    >
      <h2 className="text-xl font-semibold mb-4">Log In</h2>
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

      {loginMutation.isPending ? (
        <div>
          <Spinner />
          <p className="text-gray-600 px-8 pb-4">
            Server is starting up... may take longer...
          </p>
        </div>
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
