import { useEffect, useState } from "react";
import { fetchUpcomingEvents } from "../services/api";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <Spinner />;

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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
