import axios from "axios";

const api = axios.create({
  //baseURL: "/api",
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  config => {
    return config;
  }
);

export const register = (payload) => api.post("/auth/register", payload).then(res => res.data);
export const login = (payload) => api.post("/auth/login", payload).then(res => res.data);
export const fetchUpcomingEvents = (signal) => api.get("/events/upcoming", {signal}).then(res => res.data);
export const fetchEventById = (id, signal) => api.get(`/events/${id}`, {signal}).then(res => res.data);
export const createEvent = (eventData) => api.post("/events", eventData).then(res => res.data);
export const editEvent = (id, payload) => api.put(`/events/${id}`, payload).then(res => res.data);
export const sendOtp = () => api.post("/email/send-otp");
export const verifyOtp = (payload) => api.post("/email/verify-otp", payload).then(res => res.data);
//payload = {otp: "123456"}

export const isEmailVerified = (signal) => api.get("/email/is-verified", {signal}).then(res => res.data);
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`).then(res => res.data);
export const fetchAllUsers = (signal) => api.get("/admin/users", {signal}).then(res => res.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then(res => res.data);

export const getUser = ({signal, timeout} = {}) =>
  api.get("/auth/user", {signal, ...(timeout && {timeout})}).then(res => res.data);

// Fire-and-forget: silently wakes the Render backend without affecting UI state
export const warmupBackend = () => {
  api.get("/auth/user", {timeout: 180000}).catch(() => {});
};

export default api;
