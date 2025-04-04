/**
 * Service Service
 * Manages service-related API operations
 */

const serviceService = {
    /**
     * Get all services
     */
    getAllServices: async function() {
        try {
            return await apiService.get('services');
        } catch (error) {
            console.error('Get Services Error:', error);
            throw error;
        }
    },
    
    /**
     * Get a specific service by ID
     */
    getServiceById: async function(id) {
        try {
            return await apiService.get(`services/${id}`);
        } catch (error) {
            console.error(`Get Service ${id} Error:`, error);
            throw error;
        }
    },
    
    /**
     * Create a new service (admin function)
     */
    createService: async function(serviceData) {
        try {
            return await apiService.post('services', serviceData);
        } catch (error) {
            console.error('Create Service Error:', error);
            throw error;
        }
    },
    
    /**
     * Update a service (admin function)
     */
    updateService: async function(id, serviceData) {
        try {
            return await apiService.put(`services/${id}`, serviceData);
        } catch (error) {
            console.error(`Update Service ${id} Error:`, error);
            throw error;
        }
    },
    
    /**
     * Delete a service (admin function)
     */
    deleteService: async function(id) {
        try {
            return await apiService.delete(`services/${id}`);
        } catch (error) {
            console.error(`Delete Service ${id} Error:`, error);
            throw error;
        }
    }
};