import { useEffect, useState } from "react";
import { fetchUpcomingEvents } from "../services/api";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {events.map((event) => (
        <div
          key={event.eventId}
          className="border p-4 rounded shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-bold mb-2">
            <Link
              to={`/events/${event.eventId}`}
              className="text-blue-600 hover:underline"
            >
              {event.title}
            </Link>
          </h2>
          <p className="text-sm text-gray-700">By: {event.creator?.userName}</p>
          <p className="text-sm text-gray-700">
            Date: {new Date(event.date).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default EventList;
