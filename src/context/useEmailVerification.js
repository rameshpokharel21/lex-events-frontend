import { useQuery } from "@tanstack/react-query";
import { isEmailVerified } from "../services/api";

/**
 * Asks the backend whether the current user verified their email within the last 10 minutes.
 * The backend is the only source of truth (it also enforces the rule when an event is created),
 * so nothing is cached in sessionStorage.
 * Returns { verified: boolean, expiresAt: ISO string | null }.
 */
export const useEmailVerification = (enabled = true) => {
  return useQuery({
    queryKey: ["email-verification"],
    queryFn: ({ signal }) => isEmailVerified(signal),
    enabled,
    retry: 1,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
