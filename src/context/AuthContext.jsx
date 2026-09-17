import { createContext, useEffect } from "react";
import { getUser, setSessionExpiredHandler } from "../services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const queryClient = useQueryClient();

  // If the refresh token is expired or revoked, forget the user; protected routes redirect to /login.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== "user" });
    });
    return () => setSessionExpiredHandler(() => {});
  }, [queryClient]);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async ({ signal }) => {
      try {
        // 8-second timeout: if the Render backend is sleeping, fail fast and show
        // the page as unauthenticated rather than blocking for ~2 minutes.
        // warmupBackend() in App.jsx keeps the wake-up request alive in background.
        // A 401 here (expired access token) is refreshed automatically by the api interceptor.
        const response = await getUser({ signal, timeout: 8000 });
        return {
          ...response,
          id: response.userId,
        };
      } catch (err) {
        if (err.response?.status === 401) {
          return null;
        }
        // Timeout or cancelled while backend sleeps — treat as unauthenticated
        if (err.code === "ECONNABORTED" || err.name === "CanceledError") {
          return null;
        }
        throw err;
      }
    },
    retry: (failureCount, error) => {
      if (error.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const fetchUser = () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  const value = {
    isAuthenticated: !!user,
    user: user,
    fetchUser,
    loading: isLoading,
    error,
  };

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  );
};
