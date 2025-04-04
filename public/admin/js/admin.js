/**
 * Main Admin JavaScript file
 * Controls authentication, navigation, and shared functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    checkAuth();
    
    // Handle admin login
    setupLogin();
    
    // Handle logout
    setupLogout();
    
    // Initialize page-specific functionality
    initPageFunctionality();
    
    // Set current date
    setCurrentDate();
});

/**
 * Check if user is authenticated
 * Redirect to login page if not
 */
function checkAuth() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Skip auth check for login page
    if (currentPage === 'login.html') {
        return;
    }
    
    if (!authService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user has admin role
    authService.getCurrentUser()
        .then(user => {
            if (!user || user.role !== 'admin') {
                authService.logout();
                window.location.href = 'login.html';
            } else {
                // Set admin name
                const adminNameEl = document.getElementById('admin-name');
                if (adminNameEl) {
                    adminNameEl.textContent = user.name;
                }
            }
        })
        .catch(error => {
            console.error('Auth check error:', error);
            authService.logout();
            window.location.href = 'login.html';
        });
}

/**
 * Set up login form submission
 */
function setupLogin() {
    const loginForm = document.getElementById('admin-login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');
            
            // Validate inputs
            if (!validation.isValidEmail(email)) {
                errorElement.textContent = 'Please enter a valid email address';
                return;
            }
            
            if (validation.isEmpty(password)) {
                errorElement.textContent = 'Please enter your password';
                return;
            }
            
            // Clear error
            errorElement.textContent = '';
            
            // Attempt login
            authService.login(email, password)
                .then(success => {
                    if (success) {
                        window.location.href = 'index.html';
                    } else {
                        errorElement.textContent = 'Login failed. Please check your credentials.';
                    }
                })
                .catch(error => {
                    console.error('Login error:', error);
                    errorElement.textContent = 'An error occurred during login. Please try again.';
                });
        });
    }
}

/**
 * Set up logout functionality
 */
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    const sidebarLogout = document.getElementById('sidebar-logout');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authService.logout();
        });
    }
    
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', function(e) {
            e.preventDefault();
            authService.logout();
        });
    }
}

/**
 * Initialize page-specific functionality
 */
function initPageFunctionality() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
            // Dashboard page
            if (typeof initDashboard === 'function') {
                initDashboard();
            }
            break;
            
        case 'appointments.html':
            // Appointments page
            if (typeof initAppointmentsPage === 'function') {
                initAppointmentsPage();
            }
            break;
            
        case 'services.html':
            // Services page
            if (typeof initServicesPage === 'function') {
                initServicesPage();
            }
            break;
            
        case 'staff.html':
            // Staff page
            if (typeof initStaffPage === 'function') {
                initStaffPage();
            }
            break;
    }
}

/**
 * Set current date in header
 */
function setCurrentDate() {
    const dateEl = document.getElementById('current-date');
    
    if (dateEl) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
}