
import Spinner from "./Spinner";
import { NavLink } from "react-router-dom";

const EventForm = ({form, setForm, formErrors, isLoading, onSubmit, isEditMode}) => {
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  return (
      
        <form
          onSubmit={onSubmit}
          className="max-w-xl mx-auto bg-white p-6 shadow rounded"
        >
          {formErrors.general && (
            <div className="text-red-600 font-semibold mb-4">
              {formErrors.general}
            </div>
          )}

          <input
            className="w-full border p-2 mb-3 rounded"
            //className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
              rows={5}
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
                step="0.50"
                name="entryFee"
                placeholder="Entry Fee"
                value={form.entryFee || ""}
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
           <div className="flex justify-between gap-4">
             <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEditMode ? "Upadate Event" : "Create Event"}
            </button>

            <NavLink
              to="/"
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-300"
            >
              Cancel
            </NavLink>
           </div>
          )}
        </form>
  );
};

export default EventForm;