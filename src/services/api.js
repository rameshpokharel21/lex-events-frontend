import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000/api",
  withCredentials: true,
});

export const fetchUpcomingEvents = () => api.get("/events/upcoming");
export const fetchEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (eventData) => api.post("/events", eventData);
export const sendOtp = () => api.post("/email/send-otp");
export const verifyOtp = (payload) => api.post("/email/verify-otp", payload);
//payload = {otp: "123456"}

//export const isEmailVerified = () => api.get("auth/email/is-verified");

export default api;
