import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import useAuth from "./hooks/useAuth";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import CreateEvent from "./components/CreateEvent";
import SendOtp from "./components/SendOtp";
import VerifyOtp from "./components/VerifyOtp";
import CreateEventGuard from "./components/CreateEventGuard";

import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserList from "./components/admin/UserList";
import ErrorPage from "./components/ErrorPage";
import EditEvent from "./components/EditEvent";
import Spinner from "./components/Spinner";
import HomePage from "./components/HomePage";

function App() {
  const { isAuthenticated, loading, error, fetchUser} = useAuth();
  

  //only show loading when explicitly checking auth
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <Spinner />
        <p className="mt-4 text-gray-600">Connecting to server...may take upto 2 minutes...</p>
        {error &&
         <button
            onClick={fetchUser}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
        </button>
        }
      </div>
    );
  }

  //console.log(user);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={
            !isAuthenticated ? <HomePage /> : <Navigate to="/dashboard" replace />
            } 
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace/>}
          />

          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace/>}
          />

          <Route
            path="/register"
            element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" replace/> }
          />
          
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserList />
              </AdminRoute>
            }
          />
          <Route
            path="/events"
            element={isAuthenticated ? <EventList /> : <Navigate to="/login" replace/>}
          />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route
            path="/events/create"
            element={
              <CreateEventGuard>
                <CreateEvent />
              </CreateEventGuard>
            }
          />

          <Route path="/events/:id/edit" element={isAuthenticated ? <EditEvent /> : <Navigate to="/login" replace />} />
          <Route path="/send-otp" element={isAuthenticated ? <SendOtp /> : <Navigate to="/login" replace/>} />
          <Route path="/verify-otp" element={isAuthenticated ? <VerifyOtp /> : <Navigate to="/login" replace />} />

          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
