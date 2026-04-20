
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { fetchEventById } from "../services/api";
import Spinner from "./Spinner";
import useAuth from "../hooks/useAuth"
import formatDisplayDate from "../utils/formatDisplayDate";
import { useQuery } from "@tanstack/react-query";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {user} = useAuth();

  const {data:event, isPending, isError, error} = useQuery({
    queryKey: ["events", id],
    queryFn: async ({signal}) => {
      const eventData = await fetchEventById(id, signal);
      return eventData;
    },
    retry: 1,
    staleTime: 5*60*1000,
  });
  

  if (isPending) return <Spinner />;
  if (isError){
     return(
            <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Event</h2>
                    <p className="text-gray-700 mb-4">
                        {error.response?.data?.message || error.message || "Failed to load event details"}
                    </p>
                    <button
                        onClick={() => navigate("/events")}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        )
  }

  if (!event) return <div>Event not found.</div>;

  const canEdit = user && event.creator && 
          (user.id === event.creator.userId || user.roles.includes("ROLE_ADMIN"));


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div
        className="max-w-3xl mx-auto p-4 sm:p-6 rounded-xl shadow-lg 
                bg-white/90 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Gradient Accent */}
        <div
          className="absolute inset-0 bg-linear-to-r from-green-400 via-yellow-400 to-red-400
            opacity-20 rounded-xl pointer-events-none"
        ></div>

        {/* content */}
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {event.title}
          </h1>
          <p className="mb-4 whitespace-pre-line text-gray-800-relaxed">
            {event.description}
          </p>
          <p className="mb-2">
            <strong>Location: </strong>
            {event.location}
          </p>
          <p className="mb-2">
            <strong>Date: </strong>
            {formatDisplayDate(event.date)}
          </p>
          <p className="mb-2">
            <strong>Created by: </strong>
            {event.creator?.userName}
          </p>
          <p className="mb-2">
            <strong>Entry Fee: </strong>
            {event.isFree ? "Free" : `$${Number(event.entryFee).toFixed(2)}`}
          </p>
          {event.showContactInfo && (
            <>
              <p>
                <strong>Email: </strong>
                {event.creator?.email}
              </p>
              {event.creator?.phoneNumber && (
                <p>
                  <strong>Phone: </strong>
                  {event.creator.phoneNumber}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col sm-flex-row justify-center gap-4 mt-6">
        { canEdit && (
            <NavLink to={`/events/${event.eventId}/edit`} 
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded  hover:bg-blue-600 transition-colors text-center">
              Edit Event
            </NavLink>
          ) 
        }

        <button
          className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 text-center"
          onClick={() => navigate("/events")}
        >
          Back to Event List
        </button>
      </div>

    </div>
  );
};

export default EventDetails;
