// barbershop-frontend/js/services/api.js
/**
 * API Service
 * Handles communication with the backend API
 */

const API_URL = 'http://localhost:5000/api';

/**
 * Base API service with common HTTP methods
 */
const apiService = {
    /**
     * Generic HTTP GET request
     */
    get: async function(endpoint) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`GET Error for ${endpoint}:`, error);
            throw error;
        }
    },
    
    /**
     * Generic HTTP POST request
     */
    post: async function(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token') || ''
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`POST Error for ${endpoint}:`, error);
            throw error;
        }
    },
    
    /**
     * Generic HTTP PUT request
     */
    put: async function(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token') || ''
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`PUT Error for ${endpoint}:`, error);
            throw error;
        }
    },
    
    /**
     * Generic HTTP DELETE request
     */
    delete: async function(endpoint) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': localStorage.getItem('token') || ''
                }
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`DELETE Error for ${endpoint}:`, error);
            throw error;
        }
    }
};