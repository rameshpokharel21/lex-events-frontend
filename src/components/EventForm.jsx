
import Spinner from "./Spinner";
import { NavLink } from "react-router-dom";
import getLocalDateTimeString from "../utils/getLocalDateTimeString";
import { EVENT_IMAGES } from "../utils/eventImages";

const EventForm = ({form, setForm, formErrors, isLoading, onSubmit, isEditMode}) => {

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageSelect = (key) => {
    setForm({ ...form, imageKey: form.imageKey === key ? "" : key });
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
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            autoFocus
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
              min={getLocalDateTimeString(new Date(Date.now() + 24 * 60 * 60 * 1000))}
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

          {/* Image picker */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Event image{" "}
              <span className="text-gray-400 font-normal">(optional — defaults to City Center)</span>
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {EVENT_IMAGES.map(({ key, label, src }) => {
                const selected = form.imageKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleImageSelect(key)}
                    className={`relative rounded overflow-hidden border-2 transition-all focus:outline-none
                      ${selected
                        ? "border-blue-500 ring-2 ring-blue-300"
                        : "border-transparent hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={src}
                      alt={label}
                      className="w-full h-20 object-cover"
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 truncate px-1">
                      {label}
                    </span>
                    {selected && (
                      <span className="absolute top-1 right-1 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {isLoading ? (
            <Spinner />
          ) : (
           <div className="flex justify-between gap-4">
             <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEditMode ? "Update Event" : "Create Event"}
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
