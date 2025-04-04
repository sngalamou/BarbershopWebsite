/**
 * Date Utilities
 * Helper functions for date manipulation and formatting
 */

const dateUtils = {
    /**
     * Format date as YYYY-MM-DD
     */
    formatDateYMD: function(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    },
    
    /**
     * Format date in a friendly format
     * e.g., "Tuesday, January 1, 2023"
     */
    formatDateLong: function(date) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        return new Date(date).toLocaleDateString('en-US', options);
    },
    
    /**
     * Format time in 12-hour format
     * e.g., "2:30 PM"
     */
    formatTime12Hour: function(timeString) {
        // Handle already formatted time
        if (timeString.includes('AM') || timeString.includes('PM')) {
            return timeString;
        }
        
        // Handle 24-hour format
        if (timeString.includes(':')) {
            const [hours, minutes] = timeString.split(':').map(Number);
            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12;
            
            return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
        }
        
        return timeString;
    },
    
    /**
     * Get an array of dates for the next N days
     */
    getNextNDays: function(n, startDate = new Date()) {
        const dates = [];
        const start = new Date(startDate);
        
        for (let i = 0; i < n; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        
        return dates;
    },
    
    /**
     * Check if a date is in the past
     */
    isPastDate: function(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        
        return checkDate < today;
    },
    
    /**
     * Check if date is today
     */
    isToday: function(date) {
        const today = new Date();
        const checkDate = new Date(date);
        
        return (
            today.getDate() === checkDate.getDate() &&
            today.getMonth() === checkDate.getMonth() &&
            today.getFullYear() === checkDate.getFullYear()
        );
    },
    
    /**
     * Add minutes to a time string
     * e.g., addMinutesToTime("10:00 AM", 30) => "10:30 AM"
     */
    addMinutesToTime: function(timeString, minutes) {
        // Parse time
        let hours, mins, period;
        
        if (timeString.includes('AM') || timeString.includes('PM')) {
            // Format: "10:00 AM"
            const timeParts = timeString.split(' ');
            period = timeParts[1];
            [hours, mins] = timeParts[0].split(':').map(Number);
            
            // Convert to 24-hour
            if (period === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }
        } else {
            // Format: "10:00" (24-hour)
            [hours, mins] = timeString.split(':').map(Number);
        }
        
        // Create date object with today's date and the specified time
        const date = new Date();
        date.setHours(hours, mins, 0, 0);
        
        // Add minutes
        date.setMinutes(date.getMinutes() + minutes);
        
        // Format back to 12-hour time
        let newHours = date.getHours();
        const newMins = date.getMinutes();
        let newPeriod = 'AM';
        
        if (newHours >= 12) {
            newPeriod = 'PM';
            if (newHours > 12) {
                newHours -= 12;
            }
        }
        
        if (newHours === 0) {
            newHours = 12;
        }
        
        return `${newHours}:${String(newMins).padStart(2, '0')} ${newPeriod}`;
    }
};