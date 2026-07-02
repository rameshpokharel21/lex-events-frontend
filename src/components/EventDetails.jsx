
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { fetchEventById } from "../services/api";
import Spinner from "./Spinner";
import useAuth from "../hooks/useAuth";
import formatDisplayDate from "../utils/formatDisplayDate";
import { getEventImageSrc } from "../utils/eventImages";
import { useQuery } from "@tanstack/react-query";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: event, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: async ({ signal }) => {
      const eventData = await fetchEventById(id, signal);
      return eventData;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  if (isPending) return <Spinner />;
  if (isError) {
    return (
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
    );
  }

  if (!event) return <div>Event not found.</div>;

  const canEdit =
    user && event.creator &&
    (user.id === event.creator.userId || user.roles.includes("ROLE_ADMIN"));

  const imageSrc = getEventImageSrc(event.imageKey);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto rounded-2xl shadow-xl overflow-hidden bg-white">

        {/* Image + details side-by-side */}
        <div className="flex flex-col md:flex-row">

          {/* Image column */}
          <div className="md:w-2/5 flex-shrink-0">
            <img
              src={imageSrc}
              alt={event.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Details column */}
          <div className="flex-1 p-6 sm:p-8 relative overflow-hidden">
            {/* Subtle gradient accent */}
            <div className="absolute inset-0 bg-linear-to-br from-green-50 via-yellow-50 to-red-50 opacity-60 pointer-events-none" />

            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {event.title}
              </h1>

              <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                {event.description}
              </p>

              <div className="space-y-2 text-sm sm:text-base">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-600 min-w-[90px]">Location</span>
                  <span className="text-gray-800">{event.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-600 min-w-[90px]">Date</span>
                  <span className="text-gray-800">{formatDisplayDate(event.date)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-600 min-w-[90px]">Hosted by</span>
                  <span className="text-gray-800">{event.creator?.userName}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-600 min-w-[90px]">Entry</span>
                  <span className={`font-medium ${event.isFree ? "text-green-600" : "text-gray-800"}`}>
                    {event.isFree ? "Free" : `$${Number(event.entryFee).toFixed(2)}`}
                  </span>
                </div>

                {event.showContactInfo && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-600 min-w-[90px]">Email</span>
                      <span className="text-gray-800">{event.creator?.email}</span>
                    </div>
                    {event.creator?.phoneNumber && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-600 min-w-[90px]">Phone</span>
                        <span className="text-gray-800">{event.creator.phoneNumber}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex flex-wrap gap-3 justify-end">
          {canEdit && (
            <NavLink
              to={`/events/${event.eventId}/edit`}
              className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Edit Event
            </NavLink>
          )}
          <button
            className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => navigate("/events")}
          >
            Back to Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
