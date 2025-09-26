import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/api";

import EventForm from "./EventForm";
import validateEventForm from "../utils/validateEventForm";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateEventForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setFormErrors({});
      const payload = { ...form, date: form.date ? `${form.date}:00` : null};
      console.log('form.date before sending: ', form.date);
      console.log("payload.date being sent: ", form.date ? `${form.date}:00` : null);
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
        err.response?.data.error || err.response?.data?.message;
      if (
        err.response?.status === 403 &&
        typeof errorMessage === "string" &&
        errorMessage.includes("OTP expired")
      ) {
        navigate("/send-otp");
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Event creation failed.";
        setFormErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Event
          </h1>
          <p className="text-gray-600">
            Fill out the details below to create your event
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-sm"></div>
        <EventForm
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          isEditMode={false}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
