/**
 * Calendar Component Functionality
 */

// Selected view (month, week, day)
let currentView = 'month';

// Current date being displayed
let currentDate = new Date();

// Appointments data
let calendarAppointments = [];

/**
 * Initialize the calendar
 */
function initializeCalendar() {
    const calendarView = document.getElementById('calendar-view');
    const calendarContainer = document.getElementById('admin-calendar');
    
    if (!calendarView || !calendarContainer) return;
    
    // Set up view options
    setupViewOptions();
    
    // Set up month navigation
    setupMonthNavigation();
    
    // Render initial calendar (month view)
    updateCalendarTitle();
    renderCalendar();
    
    // Switch between list and calendar views
    setupViewTabs();
    
    // Fetch appointments for the calendar
    fetchCalendarAppointments();
}

/**
 * Set up calendar view options (month, week, day)
 */
function setupViewOptions() {
    const viewOptions = document.querySelectorAll('.calendar-view-options button');
    
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            viewOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update current view
            currentView = this.dataset.view;
            
            // Re-render calendar with new view
            renderCalendar();
        });
    });
}

/**
 * Set up month navigation
 */
function setupMonthNavigation() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            navigateCalendar(-1);
        });
        
        nextMonthBtn.addEventListener('click', function() {
            navigateCalendar(1);
        });
    }
}

/**
 * Navigate calendar by specified number of months/weeks/days
 */
function navigateCalendar(delta) {
    switch (currentView) {
        case 'month':
            // Navigate by months
            currentDate.setMonth(currentDate.getMonth() + delta);
            break;
            
        case 'week':
            // Navigate by weeks
            currentDate.setDate(currentDate.getDate() + (delta * 7));
            break;
            
        case 'day':
            // Navigate by days
            currentDate.setDate(currentDate.getDate() + delta);
            break;
    }
    
    // Update calendar title
    updateCalendarTitle();
    
    // Re-render calendar
    renderCalendar();
    
    // Fetch appointments for new date range
    fetchCalendarAppointments();
}

/**
 * Update calendar title based on current view and date
 */
function updateCalendarTitle() {
    const calendarTitle = document.getElementById('calendar-title');
    
    if (!calendarTitle) return;
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    switch (currentView) {
        case 'month':
            calendarTitle.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
            break;
            
        case 'week':
            const weekStart = new Date(currentDate);
            weekStart.setDate(currentDate.getDate() - currentDate.getDay());
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            // Format dates
            const startMonth = months[weekStart.getMonth()].substring(0, 3);
            const endMonth = months[weekEnd.getMonth()].substring(0, 3);
            
            if (weekStart.getMonth() === weekEnd.getMonth()) {
                calendarTitle.textContent = `${startMonth} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
            } else {
                calendarTitle.textContent = `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;
            }
            break;
            
        case 'day':
            const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()];
            calendarTitle.textContent = `${dayOfWeek}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
            break;
    }
}

/**
 * Render calendar based on current view
 */
function renderCalendar() {
    const calendarContainer = document.getElementById('admin-calendar');
    
    if (!calendarContainer) return;
    
    switch (currentView) {
        case 'month':
            renderMonthView(calendarContainer);
            break;
            
        case 'week':
            renderWeekView(calendarContainer);
            break;
            
        case 'day':
            renderDayView(calendarContainer);
            break;
    }
}

/**
 * Render month view
 */
function renderMonthView(container) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Days of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Build calendar HTML
    let calendarHTML = `
        <div class="calendar-month-view">
            <div class="calendar-header">
                ${daysOfWeek.map(day => `<div class="calendar-header-cell">${day}</div>`).join('')}
            </div>
            <div class="calendar-body">
    `;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarHTML += `<div class="calendar-day empty"></div>`;
    }
    
    // Add cells for each day of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        const isToday = date.getTime() === today.getTime();
        const dateString = dateUtils.formatDateYMD(date);
        
        calendarHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateString}">
                <div class="calendar-day-header">
                    <span class="calendar-day-number">${day}</span>
                </div>
                <div class="calendar-day-content" id="day-${dateString}">
                    <!-- Appointments will be loaded here -->
                </div>
            </div>
        `;
    }
    
    // Add empty cells for days after the last day of the month
    const lastDayOfWeek = lastDay.getDay();
    const emptyCellsAfter = 6 - lastDayOfWeek;
    
    for (let i = 0; i < emptyCellsAfter; i++) {
        calendarHTML += `<div class="calendar-day empty"></div>`;
    }
    
    calendarHTML += `
            </div>
        </div>
    `;
    
    container.innerHTML = calendarHTML;
    
    // Add event listeners for day clicks
    const calendarDays = container.querySelectorAll('.calendar-day:not(.empty)');
    
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Set current date to clicked day
            const dateString = this.dataset.date;
            currentDate = new Date(dateString);
            
            // Switch to day view
            currentView = 'day';
            
            // Update view options
            document.querySelectorAll('.calendar-view-options button').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.view === 'day') {
                    btn.classList.add('active');
                }
            });
            
            // Update calendar title
            updateCalendarTitle();
            
            // Re-render calendar
            renderCalendar();
            
            // Fetch appointments for new date
            fetchCalendarAppointments();
        });
    });
}

/**
 * Render week view
 */
function renderWeekView(container) {
    // Clone current date
    const date = new Date(currentDate);
    
    // Get the start of the week (Sunday)
    date.setDate(date.getDate() - date.getDay());
    
    // Days of the week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Time slots (business hours)
    const timeSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour > 12 ? hour - 12 : hour;
        timeSlots.push(`${hour12}:00 ${ampm}`);
    }
    
    // Build calendar HTML
    let calendarHTML = `
        <div class="calendar-week-view">
            <div class="calendar-week-header">
                <div class="calendar-week-time-column"></div>
    `;
    
    // Add day headers
    for (let i = 0; i < 7; i++) {
        const day = new Date(date);
        day.setDate(date.getDate() + i);
        
        const isToday = day.toDateString() === new Date().toDateString();
        const dateString = dateUtils.formatDateYMD(day);
        const dayNumber = day.getDate();
        const dayName = daysOfWeek[day.getDay()];
        
        calendarHTML += `
            <div class="calendar-week-header-day ${isToday ? 'today' : ''}" data-date="${dateString}">
                <div class="calendar-week-header-day-name">${dayName}</div>
                <div class="calendar-week-header-day-number">${dayNumber}</div>
            </div>
        `;
    }
    
    calendarHTML += `
            </div>
            <div class="calendar-week-body">
                <div class="calendar-week-time-column">
    `;
    
    // Add time slots
    timeSlots.forEach(timeSlot => {
        calendarHTML += `
            <div class="calendar-week-time-slot">
                <span>${timeSlot}</span>
            </div>
        `;
    });
    
    calendarHTML += `
                </div>
                <div class="calendar-week-grid">
    `;
    
    // Add grid for appointments
    for (let i = 0; i < timeSlots.length; i++) {
        for (let j = 0; j < 7; j++) {
            const day = new Date(date);
            day.setDate(date.getDate() + j);
            
            const dateString = dateUtils.formatDateYMD(day);
            const timeSlot = timeSlots[i];
            
            calendarHTML += `
                <div class="calendar-week-grid-cell" data-date="${dateString}" data-time="${timeSlot}" id="week-${dateString}-${timeSlot.replace(/\s/g, '')}">
                    <!-- Appointments will be loaded here -->
                </div>
            `;
        }
    }
    
    calendarHTML += `
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = calendarHTML;
    
    // Add event listeners for day header clicks
    const dayHeaders = container.querySelectorAll('.calendar-week-header-day');
    
    dayHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Set current date to clicked day
            const dateString = this.dataset.date;
            currentDate = new Date(dateString);
            
            // Switch to day view
            currentView = 'day';
            
            // Update view options
            document.querySelectorAll('.calendar-view-options button').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.view === 'day') {
                    btn.classList.add('active');
                }
            });
            
            // Update calendar title
            updateCalendarTitle();
            
            // Re-render calendar
            renderCalendar();
            
            // Fetch appointments for new date
            fetchCalendarAppointments();
        });
    });
}

/**
 * Render day view
 */
function renderDayView(container) {
    // Clone current date
    const date = new Date(currentDate);
    
    // Format date
    const dateString = dateUtils.formatDateYMD(date);
    const formattedDate = dateUtils.formatDateLong(date);
    
    // Time slots (business hours)
    const timeSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour > 12 ? hour - 12 : hour;
        timeSlots.push(`${hour12}:00 ${ampm}`);
        timeSlots.push(`${hour12}:30 ${ampm}`);
    }
    
    // Build calendar HTML
    let calendarHTML = `
        <div class="calendar-day-view">
            <div class="calendar-day-header">
                <div class="calendar-day-date">${formattedDate}</div>
            </div>
            <div class="calendar-day-schedule">
    `;
    
    // Add time slots
    timeSlots.forEach(timeSlot => {
        calendarHTML += `
            <div class="calendar-day-time-slot">
                <div class="calendar-day-time">${timeSlot}</div>
                <div class="calendar-day-events" id="day-${dateString}-${timeSlot.replace(/\s/g, '')}">
                    <!-- Appointments will be loaded here -->
                </div>
            </div>
        `;
    });
    
    calendarHTML += `
            </div>
        </div>
    `;
    
    container.innerHTML = calendarHTML;
}

/**
 * Fetch appointments for the calendar
 */
function fetchCalendarAppointments() {
    // Determine date range based on current view
    let startDate, endDate;
    
    switch (currentView) {
        case 'month':
            // First day of the month
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            
            // Last day of the month
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            break;
            
        case 'week':
            // Start of the week (Sunday)
            startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate() - startDate.getDay());
            
            // End of the week (Saturday)
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            break;
            
        case 'day':
            // Current day
            startDate = new Date(currentDate);
            endDate = new Date(currentDate);
            break;
    }
    
    // Format dates for API
    const formattedStartDate = dateUtils.formatDateYMD(startDate);
    const formattedEndDate = dateUtils.formatDateYMD(endDate);
    
    // Fetch appointments
    const filters = {
        startDate: formattedStartDate,
        endDate: formattedEndDate
    };
    
    adminService.getAllAppointments(filters)
        .then(response => {
            // Store appointments
            calendarAppointments = response.appointments;
            
            // Render appointments on calendar
            renderAppointmentsOnCalendar();
        })
        .catch(error => {
            console.error('Error fetching calendar appointments:', error);
        });
}

/**
 * Render appointments on calendar
 */
function renderAppointmentsOnCalendar() {
    // Clear existing appointments
    clearCalendarAppointments();
    
    // Render appointments based on current view
    calendarAppointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.date);
        const dateString = dateUtils.formatDateYMD(appointmentDate);
        const timeString = appointment.time;
        
        switch (currentView) {
            case 'month':
                renderAppointmentInMonthView(appointment, dateString);
                break;
                
            case 'week':
                renderAppointmentInWeekView(appointment, dateString, timeString);
                break;
                
            case 'day':
                renderAppointmentInDayView(appointment, dateString, timeString);
                break;
        }
    });
}

/**
 * Clear existing appointments from calendar
 */
function clearCalendarAppointments() {
    // Clear month view appointments
    const monthDayContents = document.querySelectorAll('.calendar-day-content');
    monthDayContents.forEach(container => {
        container.innerHTML = '';
    });
    
    // Clear week view appointments
    const weekGridCells = document.querySelectorAll('.calendar-week-grid-cell');
    weekGridCells.forEach(cell => {
        cell.innerHTML = '';
    });
    
    // Clear day view appointments
    const dayEvents = document.querySelectorAll('.calendar-day-events');
    dayEvents.forEach(container => {
        container.innerHTML = '';
    });
}

/**
 * Render appointment in month view
 */
function renderAppointmentInMonthView(appointment, dateString) {
    const dayContainer = document.getElementById(`day-${dateString}`);
    
    if (!dayContainer) return;
    
    // Create appointment element
    const appointmentElement = document.createElement('div');
    appointmentElement.className = `calendar-appointment status-${appointment.status}`;
    appointmentElement.dataset.id = appointment._id;
    
    appointmentElement.innerHTML = `
        <div class="calendar-appointment-time">${appointment.time}</div>
        <div class="calendar-appointment-title">${appointment.client.name}</div>
    `;
    
    // Add click event listener
    appointmentElement.addEventListener('click', function(e) {
        e.stopPropagation();
        openAppointmentModal(appointment);
    });
    
    // Add to day container
    dayContainer.appendChild(appointmentElement);
}

/**
 * Render appointment in week view
 */
function renderAppointmentInWeekView(appointment, dateString, timeString) {
    // Find the appropriate cell
    const formattedTime = timeString.replace(/\s/g, '');
    const cellId = `week-${dateString}-${formattedTime}`;
    const cell = document.getElementById(cellId);
    
    if (!cell) return;
    
    // Create appointment element
    const appointmentElement = document.createElement('div');
    appointmentElement.className = `calendar-appointment status-${appointment.status}`;
    appointmentElement.dataset.id = appointment._id;
    
    appointmentElement.innerHTML = `
        <div class="calendar-appointment-title">${appointment.client.name}</div>
        <div class="calendar-appointment-service">${appointment.service.name}</div>
    `;
    
    // Add click event listener
    appointmentElement.addEventListener('click', function(e) {
        e.stopPropagation();
        openAppointmentModal(appointment);
    });
    
    // Add to cell
    cell.appendChild(appointmentElement);
}

/**
 * Render appointment in day view
 */
function renderAppointmentInDayView(appointment, dateString, timeString) {
    // Find the appropriate container
    const formattedTime = timeString.replace(/\s/g, '');
    const containerId = `day-${dateString}-${formattedTime}`;
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    // Create appointment element
    const appointmentElement = document.createElement('div');
    appointmentElement.className = `calendar-appointment status-${appointment.status}`;
    appointmentElement.dataset.id = appointment._id;
    
    appointmentElement.innerHTML = `
        <div class="calendar-appointment-client">${appointment.client.name}</div>
        <div class="calendar-appointment-details">
            <span class="calendar-appointment-service">${appointment.service.name}</span>
            <span class="calendar-appointment-staff">with ${appointment.staff.name}</span>
        </div>
    `;
    
    // Add click event listener
    appointmentElement.addEventListener('click', function() {
        openAppointmentModal(appointment);
    });
    
    // Add to container
    container.appendChild(appointmentElement);
}

/**
 * Open appointment modal with appointment details
 */
function openAppointmentModal(appointment) {
    // Find modal elements
    const modal = document.getElementById('appointment-modal');
    const modalTitle = document.getElementById('appointment-modal-title');
    const form = document.getElementById('appointment-form');
    
    if (!modal || !modalTitle || !form) return;
    
    // Set modal title
    modalTitle.textContent = 'Edit Appointment';
    
    // Fill form with appointment data
    document.getElementById('client-name').value = appointment.client.name;
    document.getElementById('client-email').value = appointment.client.email;
    document.getElementById('client-phone').value = appointment.client.phone;
    document.getElementById('appointment-status').value = appointment.status;
    document.getElementById('appointment-date').value = appointment.date;
    document.getElementById('appointment-time').value = convertTimeFormat(appointment.time);
    document.getElementById('appointment-staff').value = appointment.staff._id;
    document.getElementById('appointment-service').value = appointment.service._id;
    document.getElementById('appointment-notes').value = appointment.notes || '';
    
    // Set appointment ID as data attribute
    form.dataset.appointmentId = appointment._id;
    
    // Show modal
    modal.classList.add('active');
}

/**
 * Convert time from "10:30 AM" format to "10:30" format for time input
 */
function convertTimeFormat(timeString) {
    let [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours < 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Set up list/calendar view tabs
 */
function setupViewTabs() {
    const viewTabs = document.querySelectorAll('.admin-view-tab');
    const views = document.querySelectorAll('.admin-view');
    
    viewTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            viewTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all views
            views.forEach(view => view.classList.remove('active'));
            
            // Show selected view
            const viewId = `${this.dataset.view}-view`;
            const view = document.getElementById(viewId);
            
            if (view) {
                view.classList.add('active');
                
                // Initialize calendar if showing calendar view
                if (viewId === 'calendar-view') {
                    initializeCalendar();
                }
            }
        });
    });
}