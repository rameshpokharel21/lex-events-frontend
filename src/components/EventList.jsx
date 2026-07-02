
import { deleteEvent, fetchUpcomingEvents } from "../services/api";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import formatDisplayDate from "../utils/formatDisplayDate";
import { getEventImageSrc } from "../utils/eventImages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EventList = () => {

  const { user, loading } = useAuth();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const queryClient = useQueryClient();

  const {data: events = [], isPending, isError, error, refetch} = useQuery({
    queryKey: ["events"],
    queryFn: async ({signal}) => {
      return await fetchUpcomingEvents(signal);
    },
    staleTime: 2*60*1000,
  });

  const {mutate, isPending: isDeleting} = useMutation({
    mutationFn: deleteEvent,
    onMutate: async(eventId) => {
      await queryClient.cancelQueries({queryKey: ["events"]});
      const previousEvents = queryClient.getQueryData(["events"]);
      queryClient.setQueryData(["events"], old => old ? old.filter(event => event.eventId !== eventId) : []);
      return {previousEvents};
    },
    onError: (err, eventId, context) => {
      queryClient.setQueryData(["events"], context.previousEvents);
      alert("Event could not be deleted");
      console.error(err.response?.data?.message || err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ["events"]});
    },
  });

  const handleDeleteEvent = (eventId) => {
    if(window.confirm("Are you sure to delete this event?")){
      mutate(eventId);
    }
  };

  if (loading || isPending) return <Spinner />;

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Failed to load events</p>
          <p className="text-gray-600 mb-4">{error?.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const accentColors = [
    "border-blue-300",
    "border-green-300",
    "border-yellow-300",
    "border-pink-300",
    "border-purple-300",
    "border-orange-300",
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Upcoming Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming events.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event, index) => {
            const imageSrc = getEventImageSrc(event.imageKey);
            const accentBorder = accentColors[index % accentColors.length];
            return (
              <div
                key={event.eventId}
                className={`bg-white border-2 ${accentBorder} rounded-xl shadow hover:shadow-lg hover:scale-105 transition transform overflow-hidden flex flex-col`}
              >
                {/* Thumbnail */}
                <Link to={`/events/${event.eventId}`} className="block flex-shrink-0">
                  <img
                    src={imageSrc}
                    alt={event.title}
                    className="w-full h-44 object-cover"
                  />
                </Link>

                {/* Card body */}
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-lg font-bold mb-1">
                    <Link
                      to={`/events/${event.eventId}`}
                      className="text-blue-700 hover:underline"
                    >
                      {event.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-600 mb-0.5">
                    By: {event.creator?.userName}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {formatDisplayDate(event.date)}
                  </p>

                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteEvent(event.eventId)}
                      disabled={isDeleting}
                      className="mt-auto bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      Delete Event
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
