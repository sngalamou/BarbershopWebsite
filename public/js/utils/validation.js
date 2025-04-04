/**
 * Validation Utilities
 * Common form validation functions
 */

const validation = {
    /**
     * Validate email format
     */
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * Validate phone number format
     * Accepts formats: (555) 123-4567, 555-123-4567, 5551234567
     */
    isValidPhone: function(phone) {
        const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        return phoneRegex.test(phone);
    },
    
    /**
     * Check if a string is empty or just whitespace
     */
    isEmpty: function(str) {
        return !str || str.trim() === '';
    },
    
    /**
     * Check if value has minimum length
     */
    hasMinLength: function(str, minLength) {
        return str && str.length >= minLength;
    },
    
    /**
     * Validate form input
     */
    validateInput: function(input, rules) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Apply validation rules
        if (rules.required && this.isEmpty(value)) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (rules.email && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (rules.phone && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        } else if (rules.minLength && !this.hasMinLength(value, rules.minLength)) {
            isValid = false;
            errorMessage = `This field must be at least ${rules.minLength} characters`;
        }
        
        // Update input UI
        if (!isValid) {
            input.classList.add('invalid');
            
            // Create or update error message
            let errorElement = input.nextElementSibling;
            if (!errorElement || !errorElement.classList.contains('error-message')) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                input.parentNode.insertBefore(errorElement, input.nextSibling);
            }
            
            errorElement.textContent = errorMessage;
        } else {
            input.classList.remove('invalid');
            
            // Remove error message if exists
            const errorElement = input.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        }
        
        return isValid;
    },
    
    /**
     * Validate entire form
     */
    validateForm: function(form, rulesMap) {
        let isFormValid = true;
        
        // Validate each field
        Object.keys(rulesMap).forEach(fieldName => {
            const input = form.elements[fieldName];
            const rules = rulesMap[fieldName];
            
            if (input) {
                const isFieldValid = this.validateInput(input, rules);
                isFormValid = isFormValid && isFieldValid;
            }
        });
        
        return isFormValid;
    }
};