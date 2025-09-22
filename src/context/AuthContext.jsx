import { createContext, useEffect, useState } from "react";
import getUser from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null, //{username, roles: []}
    loading: true,
  });

  //check user authenticated when mounted
  useEffect(() => {
    //console.log("AuthProvider mounted");
    getUser()
      .then((res) => {
        //console.log("Fetched user:", res.data);
        setAuth((prev) => ({
          ...prev,
          isAuthenticated: true,
          user: res.data,
        }));
      })
      .catch(() => {
        // console.log(
        //   "AuthContext: user not logged in.",
        //   err.response?.data || err.message
        // );
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
