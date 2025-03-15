// Simulated API for fetching available times
export function fetchAPI(date) {
  // In a real app, this would be an API call
  const availableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  
  // Simulate some times being booked based on the day of week
  const day = date.getDay();
  if (day === 5 || day === 6) { // Weekend
    return availableTimes.filter((_, index) => index % 2 === 0);
  }
  
  return availableTimes;
}

// Simulated API for submitting form data
export function submitAPI(formData) {
  // In a real app, this would be an API call
  console.log('Booking submitted:', formData);
  
  // Simulate a successful submission
  return true;
}
