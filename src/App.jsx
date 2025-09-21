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

function App() {
  const { isAuthenticated, user } = useAuth();
  //console.log(user);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
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
            element={isAuthenticated ? <EventList /> : <Navigate to="/login" />}
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

          <Route path="/events/:id/edit" element={<EditEvent />} />
          <Route path="/send-otp" element={<SendOtp />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
