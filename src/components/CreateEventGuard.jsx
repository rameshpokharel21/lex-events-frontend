import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect} from "react";
import Spinner from "./Spinner";
import { useEmailVerification } from "../context/useEmailVerification";

const CreateEventGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {data: verificationStatus, isLoading, isFetched} = useEmailVerification(isAuthenticated);
  const isVerified = verificationStatus?.verified === true;

  useEffect(() => {
    const checkOtp = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      //if data not feteched yet
      if(!isFetched) return;

      //only redirect after loading completes and we know it's definitely false
      if(isVerified === false){
        sessionStorage.setItem("createEventFlow", "true");
        navigate("/send-otp", {state: {fromCreateEvent: true}});
      }
    };

    checkOtp();
  }, [isAuthenticated, isLoading, isVerified, isFetched, navigate]);

  if (isLoading) return <Spinner />;
  return <>{children}</>;
};
export default CreateEventGuard;
