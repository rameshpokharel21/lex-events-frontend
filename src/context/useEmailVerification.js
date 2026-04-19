import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth"
import { isEmailVerified } from "../services/api";

export const useEmailVerification = (enabled = true) => {
    const {isAuthenticated} = useAuth();

    return useQuery({
        queryKey: ["email-verification"],
        queryFn: async({signal}) => {
            //first check session storage cache
            const verified = sessionStorage.getItem("emailVerifiedForEvent");
            const verifiedUntil = sessionStorage.getItem("emailVerifieduntil");
            if(verified === "true" && verifiedUntil){
                const expiryTime = parseInt(verifiedUntil, 10);
                if(DataTransfer.now() < expiryTime){
                    return {verified: true, expiresAt: new Date(expiryTime)};
                }else{
                    //expired, clean up
                    sessionStorage.removeItem("emailVerifiedForEvent");
                    sessionStorage.removeItem("emailVerifiedUntil");
                }
            }
            //Fallback to backend
            console.log("Fetching email verification status...");
            //expects 'verified' and 'expiresAt' from VerificationStatusResponse dto
            const res = await isEmailVerified(signal);
            if(res.verified && res.expiresAt){
                const expiryTime = new Date(res.expiresAt).getTime();
                sessionStorage.setItem("emailVerifiedForEvent", "true");
                sessionStorage.setItem("emailVerifiedUntil", expiryTime.toString());
            }
            return res;
        },
        enabled: enabled || isAuthenticated,
        retry: 1,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchInterval: false,
    });
};