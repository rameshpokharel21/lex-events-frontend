import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editEvent, fetchEventById } from "../services/api";
import Spinner from "./Spinner";
import EventForm from "./EventForm";
import validateEventForm from "../utils/validateEventForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const EditEvent = () => {

    const [form, setForm] = useState(null);
    const [formErrors, setFormErrors] = useState({});   
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {id} = useParams();

    const {data: eventData, isLoading: isEventLoading, isError, error} = useQuery({
        queryKey: ["events", id],
        queryFn: async ({signal}) => {
            const result = await fetchEventById(id, signal);
            return result; 
            
        },
        enabled: !!id, //only run if id exists
        retry: 1,
        staleTime: 5*60*1000,
    });

    useEffect(() => {
        if(eventData && !form){
            //fix date
            let dateForInput = eventData.date ? eventData.date.slice(0, 16) : "";
            if(dateForInput.endsWith("Z")){
                dateForInput = dateForInput.slice(0, -1);
            }
            
            const formData = {
                title: eventData.title || "",
                description: eventData.description || "",
                location: eventData.location || "",
                date: dateForInput,
                isFree: eventData.isFree !== undefined ? eventData.isFree : true,
                entryFee: eventData.entryFee || "",
                showContactInfo: eventData.showContactInfo,
            };
            setForm(formData);
        }   

    }, [eventData, form]);

    const editMutation = useMutation({
        mutationFn: ({eventId, payload}) => editEvent(eventId, payload),
        onSuccess: (updatedEvent) => {
            queryClient.setQueryData(["events", id], updatedEvent);
            queryClient.invalidateQueries({queryKey: ["events"]});
            navigate(`/events/${id}`);
        },
        onError: (err) => {
            setFormErrors({general: err.response?.data?.message || "Update failed"});
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
        const payload = {
            ...form,
            date: form.date ? `${form.date}:00` : null,
            entryFee: form.isFree ? null : form.entryFee,
        };

        editMutation.mutate({eventId: id, payload});

       
    };

    if(isEventLoading || !form) return <Spinner />
    
    if(isError){
        return(
            <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Event</h2>
                    <p className="text-gray-700 mb-4">
                        {error.response?.data?.message || error.message || "Failed to load event"}
                    </p>
                    <button
                        onClick={() => navigate("/events")}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        )
    }
    return(
         <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
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
                    isLoading={editMutation.isPending}
                    onSubmit={handleSubmit}
                    isEditMode={true}
                />
            </div>
        </div>
    )

}

export default EditEvent;