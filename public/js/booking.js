// public/js/booking.js
/**
 * Booking JavaScript file
 * Handles appointment booking functionality
 */

// Initialize the booking form
function initializeBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    const barberSelect = document.getElementById('barber');
    const serviceSelect = document.getElementById('service');
    
    if (!bookingForm || !barberSelect || !serviceSelect) return;
    
    // Load barbers from API
    fetch('/api/barbers')
        .then(response => response.json())
        .then(barbers => {
            barberSelect.innerHTML = '<option value="">Select a barber</option>';
            
            barbers.forEach(barber => {
                const option = document.createElement('option');
                option.value = barber.id;
                option.textContent = `${barber.firstName} ${barber.lastName}`;
                barberSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading barbers:', error);
            barberSelect.innerHTML = '<option value="">Unable to load barbers</option>';
        });
    
    // Load services from API
    fetch('/api/services')
        .then(response => response.json())
        .then(services => {
            serviceSelect.innerHTML = '<option value="">Select a service</option>';
            
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.id;
                option.textContent = `${service.name} - $${service.price} (${service.duration} min)`;
                serviceSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading services:', error);
            serviceSelect.innerHTML = '<option value="">Unable to load services</option>';
        });
    
    // Handle form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            barberId: barberSelect.value,
            serviceId: serviceSelect.value,
            appointmentDate: new Date(document.getElementById('date').value + 'T' + document.getElementById('time').value).toISOString(),
            notes: document.getElementById('notes').value
        };
        
        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
            !formData.barberId || !formData.serviceId || !document.getElementById('date').value || 
            !document.getElementById('time').value) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Create a client record first
        fetch('/api/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone
            })
        })
        .then(response => response.json())
        .then(client => {
            // Now create the appointment using the client ID
            return fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: client.id,
                    barberId: formData.barberId,
                    serviceId: formData.serviceId,
                    appointmentDate: formData.appointmentDate,
                    notes: formData.notes,
                    status: 'scheduled'
                })
            });
        })
        .then(response => response.json())
        .then(appointment => {
            // Show success message
            const formContainer = document.querySelector('.booking-form-container');
            formContainer.innerHTML = `
                <div class="booking-success">
                    <h2>Appointment Confirmed!</h2>
                    <p>Thank you for booking with Classic Cuts Barbershop.</p>
                    <p>Your appointment has been scheduled for:</p>
                    <p class="appointment-date">${new Date(appointment.appointmentDate).toLocaleString()}</p>
                    <p>We'll send a confirmation email to ${formData.email}.</p>
                    <p>See you soon!</p>
                    <a href="index.html" class="btn">Return to Home</a>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error booking appointment:', error);
            alert('There was an error booking your appointment. Please try again later.');
        });
    });
}