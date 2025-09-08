import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventById } from "../services/api";
import Spinner from "./Spinner";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEventById(id)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("Error fetching event:", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Spinner />;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
      <p className="mb-2 text-gray-700">{event.description}</p>
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
          <p>
            <strong>Phone: </strong>
            {event.creator?.phoneNumber}
          </p>
        </>
      )}
    </div>
  );
};

export default EventDetails;
