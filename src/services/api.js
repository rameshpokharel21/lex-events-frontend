import axios from "axios";

// e.g. http://localhost:9000/api (local) or https://events-api.lexnepali.com/api (production)
const API_URL = import.meta.env.VITE_API_URL;
// Same host without the trailing /api, used for /actuator/health
const API_ORIGIN = (API_URL || "").replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send the HttpOnly auth cookies
});

// Requests that must never trigger a token refresh
const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

// One shared refresh call: parallel 401s all wait for the same /auth/refresh
let refreshPromise = null;

// AuthProvider registers this so a failed refresh clears the cached user (routes then redirect to /login)
let onSessionExpired = () => {};
export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const data = error.response?.data;
    // Backend errors are ProblemDetail JSON; make sure components can always read data.message
    if (data && typeof data === "object" && !data.message) {
      data.message = data.detail || data.error;
    }

    const original = error.config;
    const status = error.response?.status;
    const url = original?.url ?? "";

    if (status === 401 && original && !original._retry && !NO_REFRESH_PATHS.some((p) => url.includes(p))) {
      original._retry = true;
      try {
        refreshPromise ??= api.post("/auth/refresh").finally(() => {
          refreshPromise = null;
        });
        await refreshPromise;
        return api(original); // retry with the new access cookie
      } catch {
        onSessionExpired();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Auth
export const register = (payload) => api.post("/auth/register", payload).then((res) => res.data);
export const login = (payload) => api.post("/auth/login", payload).then((res) => res.data);
export const logout = () => api.post("/auth/logout").then((res) => res.data);
export const getUser = ({ signal, timeout } = {}) =>
  api.get("/auth/me", { signal, ...(timeout && { timeout }) }).then((res) => res.data);

// Events
export const fetchUpcomingEvents = (signal) => api.get("/events/upcoming", { signal }).then((res) => res.data);
export const fetchEventById = (id, signal) => api.get(`/events/${id}`, { signal }).then((res) => res.data);
export const createEvent = (eventData) => api.post("/events", eventData).then((res) => res.data);
export const editEvent = (id, payload) => api.put(`/events/${id}`, payload).then((res) => res.data);

// Email verification (required before creating an event; valid for 10 minutes)
export const sendOtp = () => api.post("/email/send-otp").then((res) => res.data);
export const verifyOtp = (payload) => api.post("/email/verify-otp", payload).then((res) => res.data); // {otp: "123456"}
export const isEmailVerified = (signal) => api.get("/email/is-verified", { signal }).then((res) => res.data);

// Admin
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`).then((res) => res.data);
export const fetchAllUsers = ({ signal }) => api.get("/admin/users", { signal }).then((res) => res.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then((res) => res.data);

// Fire-and-forget: wakes the Render backend without touching auth state
export const warmupBackend = () => {
  axios.get(`${API_ORIGIN}/actuator/health`, { timeout: 180000 }).catch(() => {});
};

export default api;
