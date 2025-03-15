import React, { createContext, useReducer, useContext } from 'react';
import { fetchAPI, submitAPI } from '../utils/api';

// Initial state
const initialState = {
  availableTimes: [],
  date: new Date(),
  bookings: []
};

// Reducer function
function bookingReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_TIMES':
      return {
        ...state,
        availableTimes: action.payload
      };
    case 'SET_DATE':
      return {
        ...state,
        date: action.payload
      };
    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [...state.bookings, action.payload]
      };
    default:
      return state;
  }
}

// Create context
const BookingContext = createContext();

// Provider component
export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Initialize available times when the component mounts
  React.useEffect(() => {
    const times = fetchAPI(new Date());
    dispatch({ type: 'UPDATE_TIMES', payload: times });
  }, []);

  // Update available times when date changes
  const updateTimes = (date) => {
    const times = fetchAPI(date);
    dispatch({ type: 'SET_DATE', payload: date });
    dispatch({ type: 'UPDATE_TIMES', payload: times });
  };

  // Submit booking
  const submitBooking = (formData) => {
    const success = submitAPI(formData);
    if (success) {
      dispatch({ type: 'ADD_BOOKING', payload: formData });
    }
    return success;
  };

  return (
    <BookingContext.Provider value={{ state, updateTimes, submitBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

// Custom hook to use the booking context
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
