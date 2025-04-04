// public/js/services.js
/**
 * Services JavaScript file
 * Connects to the backend API for service-related data
 */

// Function to fetch and display services from the API
function initializeServicesList() {
    const servicesContainer = document.querySelector('.services-container');
    if (!servicesContainer) return;
    
    // Show loading indicator
    servicesContainer.innerHTML = '<div class="loading">Loading services...</div>';
    
    // Fetch services from the API
    fetch('/api/services')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(services => {
            if (services.length === 0) {
                servicesContainer.innerHTML = '<p>No services available at this time.</p>';
                return;
            }
            
            // Clear loading indicator
            servicesContainer.innerHTML = '';
            
            // Display each service
            services.forEach(service => {
                const serviceElement = document.createElement('div');
                serviceElement.className = 'service-card';
                serviceElement.innerHTML = `
                    <h3>${service.name}</h3>
                    <p class="description">${service.description || 'No description available'}</p>
                    <div class="service-details">
                        <span class="price">$${service.price}</span>
                        <span class="duration">${service.duration} min</span>
                    </div>
                `;
                servicesContainer.appendChild(serviceElement);
            });
        })
        .catch(error => {
            console.error('Error fetching services:', error);
            servicesContainer.innerHTML = '<p class="error">Unable to load services. Please try again later.</p>';
        });
}

// Function to fetch and display a preview of services on the home page
function initializeServicesPreview() {
    const previewContainer = document.querySelector('.services-preview');
    if (!previewContainer) return;
    
    // Fetch services from the API
    fetch('/api/services')
        .then(response => response.json())
        .then(services => {
            // Display up to 4 featured services
            const featuredServices = services.slice(0, 4);
            
            // Clear the container
            previewContainer.innerHTML = '';
            
            // Create the service preview HTML
            featuredServices.forEach(service => {
                const serviceElement = document.createElement('div');
                serviceElement.className = 'service-preview';
                serviceElement.innerHTML = `
                    <h3>${service.name}</h3>
                    <p class="description">${service.description || 'No description available'}</p>
                    <span class="price">$${service.price}</span>
                `;
                previewContainer.appendChild(serviceElement);
            });
            
            // Add a "View All" button
            const viewAllButton = document.createElement('div');
            viewAllButton.className = 'view-all-button';
            viewAllButton.innerHTML = '<a href="services.html" class="btn">View All Services</a>';
            previewContainer.appendChild(viewAllButton);
        })
        .catch(error => {
            console.error('Error fetching services preview:', error);
            previewContainer.innerHTML = '<p class="error">Unable to load services. Please try again later.</p>';
        });
}