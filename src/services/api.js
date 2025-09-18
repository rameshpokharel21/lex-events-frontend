import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const register = (payload) => api.post("/auth/register", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const fetchUpcomingEvents = () => api.get("/events/upcoming");
export const fetchEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (eventData) => api.post("/events", eventData);
export const sendOtp = () => api.post("/email/send-otp");
export const verifyOtp = (payload) => api.post("/email/verify-otp", payload);
//payload = {otp: "123456"}

export const isEmailVerified = () => api.get("/email/is-verified");
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`);
export const fetchAllUsers = () => api.get("/admin/users");
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export const getUser = () => api.get("/auth/user");

export default api;
