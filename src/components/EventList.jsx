import { useEffect, useState } from "react";
import { deleteEvent, fetchUpcomingEvents } from "../services/api";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user, loading } = useAuth();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  //console.log("logged in user: ", user);
  //console.log("user roles:", user?.roles);
  const colors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-pink-200",
    "bg-purple-200",
    "bg-orange-200",
  ];

  useEffect(() => {
    fetchUpcomingEvents()
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => console.error("Failed to fetch events: ", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDeleteEvent = async (eventId) => {
    try {
      setIsLoading(true);
      await deleteEvent(eventId);
      setEvents(events.filter((e) => e.eventId !== eventId)); //update UI
    } catch (err) {
      alert("user could not be deleted!");
      console.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) return <Spinner />;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Upcoming Events
      </h1>

      {isLoading ? (
        <Spinner />
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming events.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event, index) => {
            const bgColor = colors[index % colors.length];
            return (
              <div
                key={event.eventId}
                className={`${bgColor} border p-4 rounded-lg shadow hover:shadow-lg hover:scale-105 transition transform`}
              >
                <h2 className="text-lg font-bold mb-2">
                  <Link
                    to={`/events/${event.eventId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {event.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-700">
                  By: {event.creator?.userName}
                </p>
                <p className="text-sm text-gray-700">
                  Date: {new Date(event.date).toLocaleString()}
                </p>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteEvent(event.eventId)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete Event
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
