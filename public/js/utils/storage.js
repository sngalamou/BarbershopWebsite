/**
 * Storage Utilities
 * Helper functions for working with localStorage and sessionStorage
 */

const storageUtils = {
    /**
     * Save data to localStorage
     */
    saveToLocal: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    /**
     * Get data from localStorage
     */
    getFromLocal: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error retrieving from localStorage:', error);
            return null;
        }
    },
    
    /**
     * Remove data from localStorage
     */
    removeFromLocal: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    /**
     * Save data to sessionStorage
     */
    saveToSession: function(key, data) {
        try {
            sessionStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
            return false;
        }
    },
    
    /**
     * Get data from sessionStorage
     */
    getFromSession: function(key) {
        try {
            const data = sessionStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error retrieving from sessionStorage:', error);
            return null;
        }
    },
    
    /**
     * Remove data from sessionStorage
     */
    removeFromSession: function(key) {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from sessionStorage:', error);
            return false;
        }
    },
    
    /**
     * Clear all data from localStorage
     */
    clearLocalStorage: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },
    
    /**
     * Clear all data from sessionStorage
     */
    clearSessionStorage: function() {
        try {
            sessionStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing sessionStorage:', error);
            return false;
        }
    },
    
    /**
     * Save booking information temporarily
     */
    saveBookingInfo: function(bookingData) {
        return this.saveToSession('booking_info', bookingData);
    },
    
    /**
     * Get saved booking information
     */
    getBookingInfo: function() {
        return this.getFromSession('booking_info');
    },
    
    /**
     * Clear booking information
     */
    clearBookingInfo: function() {
        return this.removeFromSession('booking_info');
    }
};