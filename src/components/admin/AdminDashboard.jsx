import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Spinner from "../Spinner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user || !user.roles) return <Spinner />;
  //console.log("admnDashboard user: ", user);

  const isAdmin = () => user.roles?.incluedes("ROLE_ADMIN") || false;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="space-y-4">
        <button
          onClick={() => navigate("/events")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          View Events
        </button>

        <button
          onClick={() => navigate("/events/create")}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Create Event
        </button>

        {isAdmin && (
          <button
            onClick={() => navigate("/admin/users")}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded"
          >
            List All Users
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
