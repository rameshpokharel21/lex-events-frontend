import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/api";

import EventForm from "./EventForm";
import validateEventForm from "../utils/validateEventForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    isFree: true,
    entryFee: "",
    showContactInfo: false,
    imageKey: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {mutate, isPending} = useMutation({
    mutationFn: async(formData) => {
      const payload = { ...form, date: form.date ? `${form.date}:00` : null};
       if (form.isFree) {
        payload.entryFee = null;
      } else if(formData.entryFee){
        payload.entryFee = parseFloat(formData.entryFee);
      }

      //backend rejects with 403 EMAIL_VERIFICATION_REQUIRED if email not verified in the last 10 minutes
      return createEvent(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["events"]});
      setForm({
        title: "",
        description: "",
        location: "",
        date: "",
        isFree: true,
        entryFee: "",
        showContactInfo: false,
        imageKey: "",
      });
      navigate("/events");
    },

    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Event creation failed.";
      if (err.response?.status === 403 && errorMessage === "EMAIL_VERIFICATION_REQUIRED") {
        // verification window expired while filling the form
        sessionStorage.setItem("createEventFlow", "true");
        navigate("/send-otp", { state: { fromCreateEvent: true } });
      } else {
        setFormErrors({ general: errorMessage });
      }
    },
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateEventForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    mutate(form);
  
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
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
          isLoading={isPending}
          onSubmit={handleSubmit}
          isEditMode={false}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
