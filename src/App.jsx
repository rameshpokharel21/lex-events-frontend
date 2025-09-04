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

function App() {
  const { isAuthenticated } = useAuth();
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
            path="/events"
            element={isAuthenticated ? <EventList /> : <Navigate to="/login" />}
          />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route
            path="/events/create"
            element={
              isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
