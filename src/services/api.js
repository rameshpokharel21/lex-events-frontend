import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000/api",
  withCredentials: true,
});

export const fetchUpcomingEvents = () => api.get("/events/upcoming");
export const fetchEventById = (id) => api.get(`/events/${id}`);

export default api;
