import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import Spinner from "./Spinner";


const Dashboard = () => {

  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading){
  
      if (!isAuthenticated) {
        navigate("/login", {replace: true});
      }else if (user?.roles?.includes("ROLE_ADMIN")) {
        navigate("/admin", {replace: true});
      
      }
    }
  }, [loading, isAuthenticated, navigate, user])

  if(loading) return <Spinner />; //show while checking auth;
  if(!isAuthenticated) return null; //waiting for redirect
  if(user?.roles?.includes("ROLE_ADMIN")) return null;//redirecting to admin

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating circles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-400/20 rounded-full blur-xl animate-ping"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 transform rotate-45 translate-x-24 -translate-y-24"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 transform -rotate-45 -translate-x-32 translate-y-32"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Event Dashboard
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Manage your events with ease. Create new events or view existing ones.
          </p>
        </div>

        {/* Action Buttons */}
        {isAuthenticated && user && (
          <div className="flex flex-col sm:flex-row gap-6 mb-16">
            <button
              onClick={() => navigate("/events")}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 min-w-[200px]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Events
            </button>
            
            <button
              onClick={() => navigate("/events/create")}
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 min-w-[200px]"
              >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Event
            </button>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
        </svg>
      </div>
    </div>
  );
};

export default Dashboard;


// const Dashboard = () => {
//   const { isAuthenticated, user, loading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading){
  
//       if (!isAuthenticated) {
//         navigate("/login", {replace: true});
//       }else if (user?.roles?.includes("ROLE_ADMIN")) {
//         navigate("/admin", {replace: true});
      
//       }
//     }
//   }, [loading, isAuthenticated, navigate, user])

//   if(loading) return <Spinner />; //show while checking auth;
//   if(!isAuthenticated) return null; //waiting for redirect
//   if(user?.roles?.includes("ROLE_ADMIN")) return null;//redirecting to admin
  
//     return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400">
//       <div className="max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg text-gray">
//         <h2 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-center">
//           Welcome to Lex Events Dashboard!
//         </h2>
        
//         {isAuthenticated && user && (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
//               <button
//                 onClick={() => navigate("/events")}
//                 className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 w-full text-base"
//               >
//                 View Events
//               </button>
//               <button
//                 onClick={() => navigate("/events/create")}
//                 className="bg-green-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-green-700 transition duration-300 w-full text-base"
//               >
//                 Create Event
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
