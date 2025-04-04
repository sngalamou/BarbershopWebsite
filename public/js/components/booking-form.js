/**
 * Booking Form Component Functionality
 */

// Services and staff data will be fetched from the API
let services = [];
let staff = [];
let availableTimeSlots = [];

// Selected booking options
let selectedService = null;
let selectedStaff = null;
let selectedDate = null;
let selectedTime = null;

/**
 * Initialize the booking form
 */
function initializeBookingForm() {
    const bookingFormContainer = document.getElementById('booking-form-container');
    if (!bookingFormContainer) return;
    
    // Load services and staff data
    Promise.all([
        serviceService.getAllServices(),
        staffService.getAllStaff()
    ])
    .then(([servicesData, staffData]) => {
        services = servicesData;
        staff = staffData;
        
        // Render the booking form
        renderBookingForm(bookingFormContainer);
        
        // Set up form navigation and validation
        setupFormNavigation();
    })
    .catch(error => {
        console.error('Error loading booking data:', error);
        bookingFormContainer.innerHTML = `
            <div class="error-message">
                <p>Sorry, we couldn't load the booking form. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    });
}

/**
 * Render the booking form
 */
function renderBookingForm(container) {
    container.innerHTML = `
        <form id="booking-form" class="booking-form">
            <div id="step-1" class="booking-step active">
                <h3>Step 1: Select a Service</h3>
                <div class="service-options">
                    ${renderServiceOptions()}
                </div>
                <div class="form-buttons">
                    <div></div>
                    <button type="button" id="next-step-1" class="btn btn-primary" disabled>Next</button>
                </div>
            </div>
            
            <div id="step-2" class="booking-step">
                <h3>Step 2: Choose Your Barber</h3>
                <div class="staff-options">
                    ${renderStaffOptions()}
                </div>
                <div class="form-buttons">
                    <button type="button" id="prev-step-2" class="btn btn-secondary">Back</button>
                    <button type="button" id="next-step-2" class="btn btn-primary" disabled>Next</button>
                </div>
            </div>
            
            <div id="step-3" class="booking-step">
                <h3>Step 3: Select Date & Time</h3>
                <div class="date-picker">
                    <div id="calendar" class="calendar">
                        ${renderCalendar()}
                    </div>
                </div>
                
                <div id="time-slots-container" class="time-slots-container">
                    <h4>Available Times</h4>
                    <div id="time-slots" class="time-slots">
                        <p>Please select a date first</p>
                    </div>
                </div>
                
                <div class="form-buttons">
                    <button type="button" id="prev-step-3" class="btn btn-secondary">Back</button>
                    <button type="button" id="next-step-3" class="btn btn-primary" disabled>Next</button>
                </div>
            </div>
            
            <div id="step-4" class="booking-step">
                <h3>Step 4: Your Information</h3>
                
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                
                <div class="form-group">
                    <label for="notes">Special Requests (Optional)</label>
                    <textarea id="notes" name="notes" rows="3"></textarea>
                </div>
                
                <div class="form-buttons">
                    <button type="button" id="prev-step-4" class="btn btn-secondary">Back</button>
                    <button type="button" id="submit-booking" class="btn btn-primary">Book Appointment</button>
                </div>
            </div>
        </form>
    `;
}

/**
 * Render service options
 */
function renderServiceOptions() {
    return services.map(service => `
        <div class="service-option" data-service-id="${service._id}">
            <h4>${service.name}</h4>
            <p class="service-price">$${service.price.toFixed(2)}</p>
            <p class="service-duration">${service.duration} mins</p>
        </div>
    `).join('');
}

/**
 * Render staff options
 */
function renderStaffOptions() {
    return staff.map(barber => `
        <div class="staff-option" data-staff-id="${barber._id}">
            <img src="assets/images/staff/${barber.image || 'default.jpg'}" alt="${barber.name}" class="staff-image">
            <div class="staff-name">${barber.name}</div>
            <div class="staff-title">${barber.title}</div>
        </div>
    `).join('');
}

/**
 * Render calendar for date selection
 */
function renderCalendar() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return generateCalendarHTML(currentMonth, currentYear);
}

/**
 * Generate calendar HTML for a specific month
 */
function generateCalendarHTML(month, year) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    let calendarHTML = `
        <div class="calendar-header">
            <button type="button" class="calendar-prev" data-month="${month - 1}" data-year="${month === 0 ? year - 1 : year}">&lt;</button>
            <div class="calendar-title">${monthNames[month]} ${year}</div>
            <button type="button" class="calendar-next" data-month="${month + 1}" data-year="${month === 11 ? year + 1 : year}">&gt;</button>
        </div>
        
        <div class="calendar-days">
            <div class="calendar-day">Sun</div>
            <div class="calendar-day">Mon</div>
            <div class="calendar-day">Tue</div>
            <div class="calendar-day">Wed</div>
            <div class="calendar-day">Thu</div>
            <div class="calendar-day">Fri</div>
            <div class="calendar-day">Sat</div>
        </div>
        
        <div class="calendar-dates">
    `;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        calendarHTML += `<div class="calendar-date disabled"></div>`;
    }
    
    // Add cells for each day of the month
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        const isPast = date < new Date(today.setHours(0, 0, 0, 0));
        const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
        
        const dateClass = isPast || isWeekend ? 'disabled' : '';
        const todayClass = isToday ? 'today' : '';
        
        calendarHTML += `
            <div class="calendar-date ${dateClass} ${todayClass}" data-date="${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}">
                ${i}
            </div>
        `;
    }
    
    calendarHTML += `</div>`;
    
    return calendarHTML;
}

/**
 * Setup form navigation and validation
 */
function setupFormNavigation() {
    // Step 1: Service selection
    const serviceOptions = document.querySelectorAll('.service-option');
    const nextStep1 = document.getElementById('next-step-1');
    
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            serviceOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store selected service ID
            selectedService = this.dataset.serviceId;
            
            // Enable next button
            nextStep1.disabled = false;
        });
    });
    
    nextStep1.addEventListener('click', function() {
        document.getElementById('step-1').classList.remove('active');
        document.getElementById('step-2').classList.add('active');
    });
    
    // Step 2: Staff selection
    const staffOptions = document.querySelectorAll('.staff-option');
    const prevStep2 = document.getElementById('prev-step-2');
    const nextStep2 = document.getElementById('next-step-2');
    
    staffOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            staffOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store selected staff ID
            selectedStaff = this.dataset.staffId;
            
            // Enable next button
            nextStep2.disabled = false;
        });
    });
    
    prevStep2.addEventListener('click', function() {
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-1').classList.add('active');
    });
    
    nextStep2.addEventListener('click', function() {
        document.getElementById('step-2').classList.remove('active');
        document.getElementById('step-3').classList.add('active');
    });
    
    // Step 3: Date and time selection
    const calendar = document.getElementById('calendar');
    const prevStep3 = document.getElementById('prev-step-3');
    const nextStep3 = document.getElementById('next-step-3');
    
    // Calendar navigation
    calendar.addEventListener('click', function(e) {
        if (e.target.classList.contains('calendar-prev')) {
            const month = parseInt(e.target.dataset.month);
            const year = parseInt(e.target.dataset.year);
            calendar.innerHTML = generateCalendarHTML(month, year);
        } else if (e.target.classList.contains('calendar-next')) {
            const month = parseInt(e.target.dataset.month);
            const year = parseInt(e.target.dataset.year);
            calendar.innerHTML = generateCalendarHTML(month, year);
        } else if (e.target.classList.contains('calendar-date') && !e.target.classList.contains('disabled')) {
            // Remove selected class from all dates
            document.querySelectorAll('.calendar-date').forEach(date => date.classList.remove('selected'));
            
            // Add selected class to clicked date
            e.target.classList.add('selected');
            
            // Store selected date
            selectedDate = e.target.dataset.date;
            
            // Fetch and display available time slots
            fetchAvailableTimeSlots(selectedService, selectedStaff, selectedDate);
        }
    });
    
    prevStep3.addEventListener('click', function() {
        document.getElementById('step-3').classList.remove('active');
        document.getElementById('step-2').classList.add('active');
    });
    
    nextStep3.addEventListener('click', function() {
        document.getElementById('step-3').classList.remove('active');
        document.getElementById('step-4').classList.add('active');
    });
    
    // Step 4: User information
    const prevStep4 = document.getElementById('prev-step-4');
    const submitBooking = document.getElementById('submit-booking');
    
    prevStep4.addEventListener('click', function() {
        document.getElementById('step-4').classList.remove('active');
        document.getElementById('step-3').classList.add('active');
    });
    
    submitBooking.addEventListener('click', function() {
        // Validate form
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!name || !email || !phone) {
            alert('Please fill out all required fields.');
            return;
        }
        
        // Collect booking data
        const bookingData = {
            service: selectedService,
            staff: selectedStaff,
            date: selectedDate,
            time: selectedTime,
            client: {
                name: name,
                email: email,
                phone: phone
            },
            notes: document.getElementById('notes').value.trim()
        };
        
        // Submit booking
        bookingService.createBooking(bookingData)
            .then(booking => {
                showConfirmation(booking);
            })
            .catch(error => {
                console.error('Error creating booking:', error);
                alert('Sorry, we could not complete your booking. Please try again.');
            });
    });
}

/**
 * Fetch available time slots for selected service, staff, and date
 */
function fetchAvailableTimeSlots(serviceId, staffId, date) {
    const timeSlotsContainer = document.getElementById('time-slots');
    timeSlotsContainer.innerHTML = '<p>Loading available times...</p>';
    
    // In a real application, this would make an API call to fetch available slots
    // For this example, we'll simulate some available times
    setTimeout(() => {
        // Simulate API response
        availableTimeSlots = [
            '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
            '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
            '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
        ];
        
        renderTimeSlots(availableTimeSlots);
    }, 500);
}

/**
 * Render available time slots
 */
function renderTimeSlots(slots) {
    const timeSlotsContainer = document.getElementById('time-slots');
    
    if (slots.length === 0) {
        timeSlotsContainer.innerHTML = '<p>No available times for this date. Please select another date.</p>';
        return;
    }
    
    timeSlotsContainer.innerHTML = slots.map(time => `
        <div class="time-slot" data-time="${time}">${time}
        <div class="time-slot" data-time="${time}">${time}</div>
    `).join('');
    
    // Add event listeners to time slots
    const timeSlotElements = document.querySelectorAll('.time-slot');
    const nextStep3 = document.getElementById('next-step-3');
    
    timeSlotElements.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selected class from all time slots
            timeSlotElements.forEach(s => s.classList.remove('selected'));
            
            // Add selected class to clicked time slot
            this.classList.add('selected');
            
            // Store selected time
            selectedTime = this.dataset.time;
            
            // Enable next button
            nextStep3.disabled = false;
        });
    });
}

/**
 * Show booking confirmation
 */
function showConfirmation(booking) {
    // Get service and staff details
    const service = services.find(s => s._id === booking.service);
    const barber = staff.find(s => s._id === booking.staff);
    
    // Format date
    const bookingDate = new Date(booking.date);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Show confirmation modal
    const modal = document.getElementById('confirmation-modal');
    const confirmationDetails = document.getElementById('confirmation-details');
    
    confirmationDetails.innerHTML = `
        <div class="confirmation-details">
            <div class="confirmation-detail">
                <div class="confirmation-label">Service:</div>
                <div class="confirmation-value">${service.name}</div>
            </div>
            <div class="confirmation-detail">
                <div class="confirmation-label">Barber:</div>
                <div class="confirmation-value">${barber.name}</div>
            </div>
            <div class="confirmation-detail">
                <div class="confirmation-label">Date:</div>
                <div class="confirmation-value">${formattedDate}</div>
            </div>
            <div class="confirmation-detail">
                <div class="confirmation-label">Time:</div>
                <div class="confirmation-value">${booking.time}</div>
            </div>
            <div class="confirmation-detail">
                <div class="confirmation-label">Duration:</div>
                <div class="confirmation-value">${service.duration} minutes</div>
            </div>
            <div class="confirmation-detail">
                <div class="confirmation-label">Price:</div>
                <div class="confirmation-value">$${service.price.toFixed(2)}</div>
            </div>
        </div>
        <p>We've sent a confirmation email to ${booking.client.email}.</p>
        <p>You can cancel or reschedule your appointment up to 24 hours in advance.</p>
    `;
    
    // Show modal
    modal.classList.add('active');
    
    // Set up close button
    const closeConfirmation = document.getElementById('close-confirmation');
    closeConfirmation.addEventListener('click', function() {
        modal.classList.remove('active');
        window.location.href = 'index.html';
    });
    
    // Close modal when clicking X
    const closeModal = document.querySelector('.close-modal');
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
        window.location.href = 'index.html';
    });
}