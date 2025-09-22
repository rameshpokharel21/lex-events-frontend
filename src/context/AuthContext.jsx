import { createContext, useCallback, useEffect, useState } from "react";
import getUser from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null, //{username, roles: []}
    loading: true,
    error: null,
  });

  const fetchUser = useCallback(async() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try{
      const res = await getUser();
      setAuth({isAuthenticated: true, user: res.data, loading: false, error: null});
    }catch{
      setAuth({isAuthenticated: false, user: null, loading: false, error: "Unable to connect."});
    }finally{
      clearTimeout(timeout);
    }
  }, []);

  //check user authenticated when mounted
  useEffect(() => {
    fetchUser();
    
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ ...auth, setAuth,fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
