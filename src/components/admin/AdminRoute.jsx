import useAuth from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  //console.log("From AdminRoute user: ", user);
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default AdminRoute;
