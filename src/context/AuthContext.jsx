import { createContext} from "react";
import {getUser} from "../services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const queryClient = useQueryClient();

  const {data:user, isLoading} = useQuery({
    queryKey: ["user"],
    queryFn: async ({signal}) => {
      try{
        const response = await getUser(signal);
        return {
          ...response,
          id: response.userId,
        }
      }catch(err){
        console.log("X User fetch error: ", err);
        console.log(err.response?.data);
        console.log(err.message);
        if(err.response?.status === 401){
          return null;
        }
        throw err;
      }
    },
    retry: (failureCount, error) => {
      if(error.response?.status === 401){
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5*60*1000,
    refetchOnWindowFocus: true,
  });

  const fetchUser = () => {
    queryClient.invalidateQueries({queryKey: ["user"]})
  }

  const value = {
    isAuthenticated: !!user,
    user: user,
    fetchUser,
    loading: isLoading,
  }

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  );
};
