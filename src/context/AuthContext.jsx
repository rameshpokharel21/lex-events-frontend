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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const fetchUser = async() => {
      try{
        const res = await getUser();
        setAuth({isAuthenticated: true, user: res.data, loading: false});
      }catch{
        setAuth({isAuthenticated: false, user: null, loading: false});
      }finally{
        clearTimeout(timeout);
      }
    };

    fetchUser();
    return () => controller.abort();//cleanup
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
