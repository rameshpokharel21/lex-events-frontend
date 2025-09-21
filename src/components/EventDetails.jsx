import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { fetchEventById } from "../services/api";
import Spinner from "./Spinner";
import useAuth from "../hooks/useAuth"

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {user} = useAuth();
  

  useEffect(() => {
    fetchEventById(id)
      .then((res) =>{
     
        setEvent(res.data);
    })
      .catch((err) => console.error("Error fetching event:", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Spinner />;
  if (!event) return <div>Event not found.</div>;

  const canEdit = user && event.creator && 
          (user.userId === event.creator.userId || user.roles.includes("ROLE_ADMIN"));


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div
        className="max-w-3xl mx-auto p-4 sm:p-6 rounded-xl shadow-lg 
                bg-white/90 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Gradient Accent */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400
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
            {new Date(event.date).toLocaleString()}
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
