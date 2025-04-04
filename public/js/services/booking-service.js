/**
 * Booking Service
 * Handles booking-related API operations
 */

const bookingService = {
    /**
     * Create a new booking
     */
    createBooking: async function(bookingData) {
        try {
            return await apiService.post('appointments', bookingData);
        } catch (error) {
            console.error('Create Booking Error:', error);
            
            // For demo purposes, return a mock booking response
            return {
                _id: 'temp-' + Date.now(),
                service: bookingData.service,
                staff: bookingData.staff,
                date: bookingData.date,
                time: bookingData.time,
                client: bookingData.client,
                notes: bookingData.notes,
                status: 'scheduled',
                createdAt: new Date().toISOString()
            };
        }
    },
    
    /**
     * Get user's bookings (requires authentication)
     */
    getUserBookings: async function() {
        if (!authService.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        
        try {
            return await apiService.get('appointments/user');
        } catch (error) {
            console.error('Get User Bookings Error:', error);
            throw error;
        }
    },
    
    /**
     * Cancel a booking
     */
    cancelBooking: async function(bookingId) {
        if (!authService.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        
        try {
            return await apiService.put(`appointments/${bookingId}/cancel`);
        } catch (error) {
            console.error('Cancel Booking Error:', error);
            throw error;
        }
    },
    
    /**
     * Reschedule a booking
     */
    rescheduleBooking: async function(bookingId, newDate, newTime) {
        if (!authService.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        
        try {
            return await apiService.put(`appointments/${bookingId}/reschedule`, {
                date: newDate,
                time: newTime
            });
        } catch (error) {
            console.error('Reschedule Booking Error:', error);
            throw error;
        }
    }
};