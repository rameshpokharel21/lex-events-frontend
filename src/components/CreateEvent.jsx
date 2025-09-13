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

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    const now = new Date();
    const selectedDate = new Date(form.date);
    const minAllowedDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.description.trim())
      errors.description = "Description is required";
    if (!form.location.trim()) errors.location = "Location is requried.";

    if (!form.isFree && (!form.entryFee || parseFloat(form.entryFee) < 0)) {
      errors.entryFee = "Entry fee must be greater than $0.00 for paid events.";
    }

    if (!form.date) {
      errors.date = "Date is required.";
    } else if (selectedDate < minAllowedDate) {
      errors.date = "Date must be  at least 1 day in the future.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setFormErrors({});

      const payload = { ...form };
      if (form.isFree) {
        payload.entryFee = null;
      }

      await createEvent(payload); //backend will reject if email not recently verified

      //reset form
      setForm({
        title: "",
        description: "",
        location: "",
        date: "",
        isFree: true,
        entryFee: "",
        showContactInfo: false,
      });
      //for multiple event creation within expiry time, don't remove session.
      //sessionStorage.removeItem("emailVerifiedForEvent");
      //sessionStorage.removeItem("emailVerifiedAt");

      navigate("/events");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Event creation failed.";
      setFormErrors({ general: errorMessage });
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

      {formErrors.general && (
        <div className="text-red-600 font-semibold mb-4">
          {formErrors.general}
        </div>
      )}

      <input
        className="w-full border p-2 mb-3 rounded"
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />
      {formErrors.title && (
        <div className="text-red-500 mb-2">{formErrors.title}</div>
      )}

      <label className="block mb-3">
        <textarea
          className="w-full border p-2 mb-3 rounded resize-none"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
        />
      </label>
      {formErrors.description && (
        <div className="text-red-500 mb-2">{formErrors.description}</div>
      )}

      <input
        className="w-full border p-2 mb-3 rounded"
        type="text"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
      />
      {formErrors.location && (
        <div className="text-red-500 mb-2">{formErrors.location}</div>
      )}

      <label className="block mb-3">
        <input
          className="w-full border p-2 mb-3 rounded"
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          min={new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 16)}
        />
      </label>
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
        <>
          <input
            className="w-full border p-2 mb-3 rounded"
            type="number"
            step="0.01"
            name="entryFee"
            placeholder="Entry Fee"
            value={form.entryFee}
            onChange={handleChange}
          />
          {formErrors.entryFee && (
            <div className="text-red-500 mb-2">{formErrors.entryFee}</div>
          )}
        </>
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
