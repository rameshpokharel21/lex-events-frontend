import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/api";
import Spinner from "./Spinner";

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    isFree: true,
    entryFee: "",
    showContactInfo: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const now = new Date();
    const selectedDate = new Date(form.date);
    if (selectedDate < now) {
      setFormErrors((prev) => ({
        ...prev,
        date: "Date must be in the future.",
      }));
      return;
    }
    setIsLoading(true);
    try {
      const payload = { ...form };
      if (form.isFree) {
        payload.entryFee = null;
      }

      await createEvent(payload);
      sessionStorage.removeItem("phoneVerifiedForEvent");
      navigate("/events");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Event creation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Create New Event</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        className="w-full border p-2 mb-3 rounded"
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        className="w-full border p-2 mb-3 rounded"
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        className="w-full border p-2 mb-3 rounded"
        type="text"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        required
      />
      <input
        className="w-full border p-2 mb-3 rounded"
        type="datetime-local"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        min={new Date().toISOString().slice(0, 16)}
      />
      {formErrors.date && (
        <div className="text-red-500 mb-2">{formErrors.date}</div>
      )}

      <label className="block mb-3">
        <input
          type="checkbox"
          name="isFree"
          checked={form.isFree}
          onChange={handleChange}
        />{" "}
        This event is free
      </label>
      {!form.isFree && (
        <input
          className="w-full border p-2 mb-3 rounded"
          type="number"
          step="0.01"
          name="entryFee"
          placeholder="Entry Fee"
          value={form.entryFee}
          onChange={handleChange}
          required
        />
      )}
      <label className="block mb-3">
        <input
          type="checkbox"
          name="showContactInfo"
          checked={form.showContactInfo}
          onChange={handleChange}
        />{" "}
        Show my contact info publicly
      </label>

      {isLoading ? (
        <Spinner />
      ) : (
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Create Event
        </button>
      )}
    </form>
  );
};

export default CreateEvent;
