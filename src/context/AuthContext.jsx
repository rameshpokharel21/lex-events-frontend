import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  //check user authenticated when mounted
  useEffect(() => {
    api
      .get("/auth/user")
      .then((res) => {
        setAuth((prev) => ({
          ...prev,
          isAuthenticated: true,
          user: res.data,
        }));
      })
      .catch(() => {
        console.log("user not logged in.");
        setAuth((prev) => ({ ...prev, isAuthenticated: false, user: null }));
      })
      .finally(() => {
        setAuth((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
