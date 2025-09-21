import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editEvent, fetchEventById } from "../services/api";
import Spinner from "./Spinner";
import EventForm from "./EventForm";
import validateEventForm from "./utils/validateEventForm";

const EditEvent = () => {

    const [form, setForm] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {id} = useParams();
    useEffect(() => {
      const loadEvent = async () => {
        try{
            
            setIsLoading(true);
            const res = await fetchEventById(id);
            const eventData = res.data;
            setForm({
                title: eventData.title,
                description: eventData.description,
                location: eventData.location,
                date: eventData.date.slice(0,16),
                isFree: eventData.isFree,
                entryFee: eventData.entryFee || null,
                showContactInfo: eventData.showContactInfo,
            });
        }catch(err){
            setFormErrors(err.response?.data?.messeage || "fetching event failed.")
        }finally{
            setIsLoading(false);
        }
      };

      loadEvent();

    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateEventForm(form);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try{
            setIsLoading(true);
            const isoDate = form.date ? new Date(form.date).toISOString() : null;
            const payload = {
                ...form, date: isoDate,
                entryFee: form.isFree ? null : form.entryFee,
            };
            //console.log(payload);
            await editEvent(id, payload);

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

            navigate(`/events/${id}`);
        }catch(err){
            setFormErrors({general: err.response?.data?.message || "Update failed"});
            console.error(err);
        }finally{
            setIsLoading(false);
        }
    };

    if(!form || isLoading) return <Spinner />
    

    return(
         <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Update Event
                    </h1>
                    <p className="text-gray-600">
                        Modify the details below to update your event
                    </p>
                </div>
                <EventForm
                    form={form}
                    setForm={setForm}
                    formErrors={formErrors}
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                    isEditMode={true}
                />
            </div>
        </div>
    )

}

export default EditEvent;