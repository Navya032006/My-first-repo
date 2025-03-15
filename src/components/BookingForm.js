import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import './BookingForm.css';

const BookingForm = () => {
  const { state, updateTimes, submitBooking } = useBooking();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    occasion: '',
    specialRequests: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set initial date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      date: today
    }));
    updateTimes(new Date());
  }, [updateTimes]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'date') {
      updateTimes(new Date(value));
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Submit booking data
      const success = submitBooking(formData);
      
      if (success) {
        // Navigate to confirmation page
        navigate('/confirmed-booking', { state: { booking: formData } });
      } else {
        alert('There was an error submitting your reservation. Please try again.');
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="booking-form-container" role="form" aria-labelledby="booking-form-title">
      <h2 id="booking-form-title">Book Your Table</h2>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={formErrors.name ? 'error' : ''}
            aria-invalid={formErrors.name ? 'true' : 'false'}
            aria-describedby={formErrors.name ? "name-error" : undefined}
            data-testid="name-input"
          />
          {formErrors.name && <span className="error-message" id="name-error">{formErrors.name}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? 'error' : ''}
              aria-invalid={formErrors.email ? 'true' : 'false'}
              aria-describedby={formErrors.email ? "email-error" : undefined}
              data-testid="email-input"
            />
            {formErrors.email && <span className="error-message" id="email-error">{formErrors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              className={formErrors.phone ? 'error' : ''}
              aria-invalid={formErrors.phone ? 'true' : 'false'}
              aria-describedby={formErrors.phone ? "phone-error" : undefined}
              data-testid="phone-input"
            />
            {formErrors.phone && <span className="error-message" id="phone-error">{formErrors.phone}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={formErrors.date ? 'error' : ''}
              aria-invalid={formErrors.date ? 'true' : 'false'}
              aria-describedby={formErrors.date ? "date-error" : undefined}
              data-testid="date-input"
            />
            {formErrors.date && <span className="error-message" id="date-error">{formErrors.date}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={formErrors.time ? 'error' : ''}
              aria-invalid={formErrors.time ? 'true' : 'false'}
              aria-describedby={formErrors.time ? "time-error" : undefined}
              data-testid="time-select"
            >
              <option value="">Select time</option>
              {state.availableTimes.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {formErrors.time && <span className="error-message" id="time-error">{formErrors.time}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="guests">Number of Guests</label>
            <select
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              aria-label="Number of guests"
              data-testid="guests-select"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(num => (
                <option key={num} value={num.toString()}>{num} {num === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="occasion">Occasion (Optional)</label>
            <select
              id="occasion"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              aria-label="Special occasion"
              data-testid="occasion-select"
            >
              <option value="">Select occasion</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="date">Date Night</option>
              <option value="business">Business Meal</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="specialRequests">Special Requests (Optional)</label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="3"
            placeholder="Allergies, dietary restrictions, seating preferences, etc."
            aria-label="Special requests or accommodations"
            data-testid="requests-textarea"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-submit"
          disabled={isSubmitting}
          aria-label="Submit reservation request"
          data-testid="submit-button"
        >
          {isSubmitting ? 'Processing...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
