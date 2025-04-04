/**
 * Staff Service
 * Handles barber-related API operations
 */

const staffService = {
    /**
     * Get all barbers
     */
    getAllStaff: async function() {
        try {
            // Use the barbers endpoint from your API
            return await apiService.get('barbers');
        } catch (error) {
            console.error('Get Barbers Error:', error);
            throw error;
        }
    },
    
    /**
     * Get a specific barber by ID
     */
    getStaffById: async function(id) {
        try {
            return await apiService.get(`barbers/${id}`);
        } catch (error) {
            console.error(`Get Barber ${id} Error:`, error);
            throw error;
        }
    },
    
    /**
     * Create a new barber (admin function)
     */
    createStaff: async function(barberData) {
        try {
            return await apiService.post('barbers', barberData);
        } catch (error) {
            console.error('Create Barber Error:', error);
            throw error;
        }
    },
    
    /**
     * Update a barber (admin function)
     */
    updateStaff: async function(id, barberData) {
        try {
            return await apiService.put(`barbers/${id}`, barberData);
        } catch (error) {
            console.error(`Update Barber ${id} Error:`, error);
            throw error;
        }
    },
    
    /**
     * Delete a barber (admin function)
     */
    deleteStaff: async function(id) {
        try {
            return await apiService.delete(`barbers/${id}`);
        } catch (error) {
            console.error(`Delete Barber ${id} Error:`, error);
            throw error;
        }
    },
    
    /**
     * Get available time slots for a barber on a specific date
     */
    getAvailability: async function(barberId, date) {
        try {
            // First get appointments for this barber on this date
            const appointments = await apiService.get(`barbers/${barberId}/appointments`);
            
            // Business hours (9AM to 7PM, 30-minute intervals)
            const hours = [];
            for (let i = 9; i < 19; i++) {
                hours.push(`${i}:00`);
                hours.push(`${i}:30`);
            }
            
            // Filter out booked slots
            if (appointments && appointments.length) {
                // Convert appointment times to the same format as our hours array
                const bookedHours = appointments
                    .filter(app => {
                        const appDate = new Date(app.appointmentDate);
                        const checkDate = new Date(date);
                        return appDate.toDateString() === checkDate.toDateString();
                    })
                    .map(app => {
                        const appTime = new Date(app.appointmentDate);
                        return `${appTime.getHours()}:${appTime.getMinutes() === 0 ? '00' : '30'}`;
                    });
                
                // Return available hours
                return hours.filter(hour => !bookedHours.includes(hour));
            }
            
            return hours;
        } catch (error) {
            console.error(`Get Barber Availability Error:`, error);
            throw error;
        }
    }
};