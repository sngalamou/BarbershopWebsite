/**
 * Service Table Component Functionality
 */

// Services data
let servicesData = [];

// Current active filter
let currentFilter = 'all';

// Initialize the services page
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('services-table-body')) return;
    
    // Load services data
    loadServicesData();
    
    // Set up event listeners
    setupServiceEventListeners();
    
    // Set up filter tabs
    setupFilterTabs();
});

/**
 * Load services data from API
 */
function loadServicesData() {
    // Show loading state
    const tableBody = document.getElementById('services-table-body');
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">Loading services...</td>
        </tr>
    `;
    
    // Fetch services data
    serviceService.getAllServices()
        .then(services => {
            // Store services data
            servicesData = services;
            
            // Render services table
            renderServicesTable(services);
        })
        .catch(error => {
            console.error('Error loading services:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Error loading services. Please try again.</td>
                </tr>
            `;
        });
}

/**
 * Render services table
 */
function renderServicesTable(services) {
    const tableBody = document.getElementById('services-table-body');
    
    // Clear table body
    tableBody.innerHTML = '';
    
    // Filter services if needed
    if (currentFilter !== 'all') {
        services = services.filter(service => service.category.toLowerCase() === currentFilter);
    }
    
    // Check if there are services to display
    if (services.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No services found.</td>
            </tr>
        `;
        return;
    }
    
    // Render each service row
    services.forEach(service => {
        const row = document.createElement('tr');
        row.dataset.id = service._id;
        
        row.innerHTML = `
            <td>${service.name}</td>
            <td>${service.category}</td>
            <td>${service.duration} mins</td>
            <td>$${service.price.toFixed(2)}</td>
            <td><span class="status-badge status-${service.active ? 'active' : 'inactive'}">${service.active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <div class="admin-table-actions">
                    <a href="#" class="admin-action-btn admin-action-view" title="View" data-id="${service._id}"><i class="fas fa-eye"></i></a>
                    <a href="#" class="admin-action-btn admin-action-edit" title="Edit" data-id="${service._id}"><i class="fas fa-edit"></i></a>
                    <a href="#" class="admin-action-btn admin-action-delete" title="Delete" data-id="${service._id}"><i class="fas fa-trash"></i></a>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Set up service event listeners
 */
function setupServiceEventListeners() {
    // Add service button
    const addServiceBtn = document.getElementById('add-service-btn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function() {
            openServiceModal();
        });
    }
    
    // Service form submission
    const serviceForm = document.getElementById('service-form');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveService();
        });
    }
    
    // Cancel button
    const cancelServiceBtn = document.getElementById('cancel-service-btn');
    if (cancelServiceBtn) {
        cancelServiceBtn.addEventListener('click', function() {
            closeServiceModal();
        });
    }
    
    // Close modal button
    const closeModal = document.querySelector('#service-modal .close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeServiceModal();
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('service-search');
    const searchBtn = document.getElementById('service-search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchServices(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchServices(searchInput.value);
            }
        });
    }
    
    // Table action buttons (View, Edit, Delete)
    document.addEventListener('click', function(e) {
        // View service
        if (e.target.closest('.admin-action-view')) {
            e.preventDefault();
            const button = e.target.closest('.admin-action-view');
            const serviceId = button.dataset.id;
            viewService(serviceId);
        }
        
        // Edit service
        if (e.target.closest('.admin-action-edit')) {
            e.preventDefault();
            const button = e.target.closest('.admin-action-edit');
            const serviceId = button.dataset.id;
            editService(serviceId);
        }
        
        // Delete service
        if (e.target.closest('.admin-action-delete')) {
            e.preventDefault();
            const button = e.target.closest('.admin-action-delete');
            const serviceId = button.dataset.id;
            deleteService(serviceId);
        }
    });
}

/**
 * Set up filter tabs
 */
function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.admin-view-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update current filter
            currentFilter = this.dataset.view;
            
            // Re-render table with filter
            renderServicesTable(servicesData);
        });
    });
}

/**
 * Open service modal for adding a new service
 */
function openServiceModal(service = null) {
    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('service-modal-title');
    const form = document.getElementById('service-form');
    
    if (!modal || !modalTitle || !form) return;
    
    // Reset form
    form.reset();
    
    if (service) {
        // Edit mode
        modalTitle.textContent = 'Edit Service';
        
        // Fill form with service data
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-category').value = service.category;
        document.getElementById('service-duration').value = service.duration;
        document.getElementById('service-price').value = service.price.toFixed(2);
        document.getElementById('service-description').value = service.description;
        document.getElementById('service-status').value = service.active.toString();
        
        // Set service ID as data attribute
        form.dataset.serviceId = service._id;
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Service';
        
        // Clear service ID
        delete form.dataset.serviceId;
    }
    
    // Show modal
    modal.classList.add('active');
}

/**
 * Close service modal
 */
function closeServiceModal() {
    const modal = document.getElementById('service-modal');
    
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Save service (add or edit)
 */
function saveService() {
    const form = document.getElementById('service-form');
    
    if (!form) return;
    
    // Get form data
    const formData = {
        name: document.getElementById('service-name').value,
        category: document.getElementById('service-category').value,
        duration: parseInt(document.getElementById('service-duration').value),
        price: parseFloat(document.getElementById('service-price').value),
        description: document.getElementById('service-description').value,
        active: document.getElementById('service-status').value === 'true'
    };
    
    // Validate form data
    if (!formData.name || !formData.category || isNaN(formData.duration) || isNaN(formData.price) || !formData.description) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Check if editing or adding
    const serviceId = form.dataset.serviceId;
    
    if (serviceId) {
        // Edit existing service
        serviceService.updateService(serviceId, formData)
            .then(updatedService => {
                // Update service in data
                const index = servicesData.findIndex(s => s._id === serviceId);
                
                if (index !== -1) {
                    servicesData[index] = updatedService;
                }
                
                // Re-render table
                renderServicesTable(servicesData);
                
                // Close modal
                closeServiceModal();
                
                // Show success message
                alert('Service updated successfully.');
            })
            .catch(error => {
                console.error('Error updating service:', error);
                alert('Error updating service. Please try again.');
            });
    } else {
        // Add new service
        serviceService.createService(formData)
            .then(newService => {
                // Add service to data
                servicesData.push(newService);
                
                // Re-render table
                renderServicesTable(servicesData);
                
                // Close modal
                closeServiceModal();
                
                // Show success message
                alert('Service added successfully.');
            })
            .catch(error => {
                console.error('Error adding service:', error);
                alert('Error adding service. Please try again.');
            });
    }
}

/**
 * View service details
 */
function viewService(serviceId) {
    // Find service
    const service = servicesData.find(s => s._id === serviceId);
    
    if (!service) {
        alert('Service not found.');
        return;
    }
    
    // You could show a read-only modal with service details
    // For simplicity, we'll use the edit modal in read-only mode
    openServiceModal(service);
    
    // Make form read-only
    const form = document.getElementById('service-form');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.setAttribute('readonly', true);
        input.setAttribute('disabled', true);
    });
    
    // Hide save button
    document.getElementById('save-service-btn').style.display = 'none';
}

/**
 * Edit service
 */
function editService(serviceId) {
    // Find service
    const service = servicesData.find(s => s._id === serviceId);
    
    if (!service) {
        alert('Service not found.');
        return;
    }
    
    // Open edit modal
    openServiceModal(service);
}

/**
 * Delete service
 */
function deleteService(serviceId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this service?')) {
        return;
    }
    
    // Find service
    const service = servicesData.find(s => s._id === serviceId);
    
    if (!service) {
        alert('Service not found.');
        return;
    }
    
    // Delete service
    serviceService.deleteService(serviceId)
        .then(() => {
            // Remove service from data
            servicesData = servicesData.filter(s => s._id !== serviceId);
            
            // Re-render table
            renderServicesTable(servicesData);
            
            // Show success message
            alert('Service deleted successfully.');
        })
        .catch(error => {
            console.error('Error deleting service:', error);
            alert('Error deleting service. Please try again.');
        });
}

/**
 * Search services
 */
function searchServices(searchTerm) {
    if (!searchTerm) {
        // If empty search term, show all services
        renderServicesTable(servicesData);
        return;
    }
    
    // Filter services by name
    const filteredServices = servicesData.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Render filtered services
    renderServicesTable(filteredServices);
}