import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventById } from "../services/api";
import Spinner from "./Spinner";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventById(id)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("Error fetching event:", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Spinner />;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div
        className="max-w-3xl mx-auto p-6 rounded-xl shadow-lg 
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                text-white"
      >
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="mb-2">{event.description}</p>
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

      <div className="flex justify-center mb-4">
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 "
          onClick={() => navigate("/events")}
        >
          Back to Event List
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
