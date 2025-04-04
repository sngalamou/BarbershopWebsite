/**
 * Authentication Service
 * Handles user login, registration, and auth state
 */

const authService = {
    /**
     * Login user with email and password
     */
    login: async function(email, password) {
        try {
            const response = await apiService.post('auth', { email, password });
            
            // Store token in localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    },
    
    /**
     * Register a new user
     */
    register: async function(userData) {
        try {
            const response = await apiService.post('auth/register', userData);
            
            // Store token in localStorage if returned
            if (response.token) {
                localStorage.setItem('token', response.token);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Registration Error:', error);
            throw error;
        }
    },
    
    /**
     * Logout user
     */
    logout: function() {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    },
    
    /**
     * Check if user is authenticated
     */
    isAuthenticated: function() {
        return !!localStorage.getItem('token');
    },
    
    /**
     * Get current user information
     */
    getCurrentUser: async function() {
        if (!this.isAuthenticated()) {
            return null;
        }
        
        try {
            return await apiService.get('auth');
        } catch (error) {
            console.error('Get User Error:', error);
            
            // Token might be invalid or expired
            if (error.message.includes('401')) {
                this.logout();
            }
            
            return null;
        }
    }
};