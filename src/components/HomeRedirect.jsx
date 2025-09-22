import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"


const HomeRedirect = () => {
  const {isAuthenticated} = useAuth();
  if(isAuthenticated === undefined) return null;
  return isAuthenticated ? <Navigate to="/" /> :
            <Navigate to="/login" />;
}

export default HomeRedirect
