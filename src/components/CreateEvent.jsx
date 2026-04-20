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
  });

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {mutate, isPending, error} = useMutation({
    mutationFn: async(formData) => {
      const payload = { ...form, date: form.date ? `${form.date}:00` : null};
       if (form.isFree) {
        payload.entryFee = null;
      } else if(formData.entryFee){
        payload.entryFee = parseFloat(formData.entryFee);
      }

      try{
        //backend will reject if email not recently verified
        const response = await createEvent(payload);
        return response;
      }catch(err){
        console.log("API Error details: ", error);
        console.log("Error response: ", error.response);
        throw err;
      }
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
      });
      navigate("/events");
    },

    onError: (err) => {
      const errorMessage = 
        err.response?.data?.error || err.response?.data?.message || "Event creation failed.";
      if (
        err.response?.status === 403 &&
        typeof errorMessage === "string" &&
        errorMessage.includes("OTP expired")
      ) {
        navigate("/send-otp");
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
          isLoading={isPending}
          onSubmit={handleSubmit}
          isEditMode={false}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
