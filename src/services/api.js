import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000/api",
  withCredentials: true,
});

export const fetchUpcomingEvents = () => api.get("/events/upcoming");
export const fetchEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (eventData) => api.post("/events", eventData);
export const sendOtp = (data) => api.post("/user/send-otp", data);
export const verifyOtp = (payload) => api.post("/user/verify-phone", payload);
export default api;
