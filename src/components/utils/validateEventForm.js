
const validateEventForm = (form) => {
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

        return errors;
}

export default validateEventForm;