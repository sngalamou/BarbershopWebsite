/**
 * Staff Table Component Functionality
 */

// Staff data
let staffData = [];

// Initialize the staff page
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('staff-table-body')) return;
    
    // Load staff data
    loadStaffData();
    
    // Set up event listeners
    setupStaffEventListeners();
    
    // Load services for staff form
    loadServicesForStaffForm();
});

/**
 * Load staff data from API
 */
function loadStaffData() {
    // Show loading state
    const tableBody = document.getElementById('staff-table-body');
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">Loading staff members...</td>
        </tr>
    `;
    
    // Fetch staff data
    staffService.getAllStaff()
        .then(staff => {
            // Store staff data
            staffData = staff;
            
            // Render staff table
            renderStaffTable(staff);
        })
        .catch(error => {
            console.error('Error loading staff:', error);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">Error loading staff members. Please try again.</td>
                </tr>
            `;
        });
}

/**
 * Render staff table
 */
function renderStaffTable(staff) {
    const tableBody = document.getElementById('staff-table-body');
    
    // Clear table body
    tableBody.innerHTML = '';
    
    // Check if there are staff members to display
    if (staff.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No staff members found.</td>
            </tr>
        `;
        return;
    }
    
    // Render each staff row
    staff.forEach(staffMember => {
        const row = document.createElement('tr');
        row.dataset.id = staffMember._id;
        
        row.innerHTML = `
            <td><img src="../assets/images/staff/${staffMember.image || 'default.jpg'}" alt="${staffMember.name}" class="admin-staff-thumbnail"></td>
            <td>${staffMember.name}</td>
            <td>${staffMember.title}</td>
            <td>${staffMember.email}</td>
            <td>${staffMember.phone || '-'}</td>
            <td><span class="status-badge status-${staffMember.active ? 'active' : 'inactive'}">${staffMember.active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <div class="admin-table-actions">
                    <a href="#" class="admin-action-btn admin-action-view" title="View" data-id="${staffMember._id}"><i class="fas fa-eye"></i></a>
                    <a href="#" class="admin-action-btn admin-action-edit" title="Edit" data-id="${staffMember._id}"><i class="fas fa-edit"></i></a>
                    <a href="#" class="admin-action-btn admin-action-delete" title="Delete" data-id="${staffMember._id}"><i class="fas fa-trash"></i></a>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Set up staff event listeners
 */
function setupStaffEventListeners() {
    // Add staff button
    const addStaffBtn = document.getElementById('add-staff-btn');
    if (addStaffBtn) {
        addStaffBtn.addEventListener('click', function() {
            openStaffModal();
        });
    }
    
    // Staff form submission
    const staffForm = document.getElementById('staff-form');
    if (staffForm) {
        staffForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveStaff();
        });
    }
    
    // Cancel button
    const cancelStaffBtn = document.getElementById('cancel-staff-btn');
    if (cancelStaffBtn) {
        cancelStaffBtn.addEventListener('click', function() {
            closeStaffModal();
        });
    }
    
    // Close modal button
    const closeModal = document.querySelector('#staff-modal .close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeStaffModal();
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('staff-search');
    const searchBtn = document.getElementById('staff-search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchStaff(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchStaff(searchInput.value);
            }
        });
    }
    
    // Table action buttons (View, Edit, Delete)
    document.addEventListener('click', function(e) {
        // View staff
        if (e.target.closest('.admin-action-view')) {
            e.preventDefault();
            const button = e.target.closest('.admin-action-view');
            const staffId = button.dataset.id;
            viewStaff(staffId);
        }
        
        // Edit staff
        if (e.target.closest('.admin-action-edit')) {
            e.preventDefault();
            const button = e.target.closest('.admin-action-edit');
            const staffId = button.dataset.id;
            editStaff(staffId);
        }
        
        // Delete staff
        if (e.target.closest('.admin-action-delete')) {
            e.preventDefault();
            const button = e.target.closest('.admin-action-delete');
            const staffId = button.dataset.id;
            deleteStaff(staffId);
        }
    });
}

/**
 * Load services for staff form
 */
function loadServicesForStaffForm() {
    const servicesContainer = document.getElementById('services-checkboxes');
    
    if (!servicesContainer) return;
    
    // Fetch services
    serviceService.getAllServices()
        .then(services => {
            // Create checkboxes for each service
            let checkboxesHTML = '';
            
            services.forEach(service => {
                checkboxesHTML += `
                    <label class="checkbox-label">
                        <input type="checkbox" name="services" value="${service._id}"> ${service.name}
                    </label>
                `;
            });
            
            // Update container
            servicesContainer.innerHTML = checkboxesHTML;
        })
        .catch(error => {
            console.error('Error loading services for staff form:', error);
            servicesContainer.innerHTML = '<p>Error loading services. Please try again.</p>';
        });
}

/**
 * Open staff modal for adding a new staff member
 */
function openStaffModal(staffMember = null) {
    const modal = document.getElementById('staff-modal');
    const modalTitle = document.getElementById('staff-modal-title');
    const form = document.getElementById('staff-form');
    
    if (!modal || !modalTitle || !form) return;
    
    // Reset form
    form.reset();
    
    if (staffMember) {
        // Edit mode
        modalTitle.textContent = 'Edit Staff Member';
        
        // Fill form with staff data
        document.getElementById('staff-name').value = staffMember.name;
        document.getElementById('staff-title').value = staffMember.title;
        document.getElementById('staff-email').value = staffMember.email;
        document.getElementById('staff-phone').value = staffMember.phone || '';
        document.getElementById('staff-bio').value = staffMember.bio || '';
        document.getElementById('staff-status').value = staffMember.active ? 'active' : 'inactive';
        
        // Check specialties
        const specialtyCheckboxes = document.querySelectorAll('input[name="specialties"]');
        if (staffMember.specialties && specialtyCheckboxes.length > 0) {
            specialtyCheckboxes.forEach(checkbox => {
                if (staffMember.specialties.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
        
        // Check services
        const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
        if (staffMember.services && serviceCheckboxes.length > 0) {
            serviceCheckboxes.forEach(checkbox => {
                if (staffMember.services.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
        
        // Set schedule
        if (staffMember.schedule) {
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            
            days.forEach(day => {
                const daySchedule = staffMember.schedule[day];
                
                if (daySchedule) {
                    const enabledCheckbox = document.querySelector(`input[name="schedule_${day}_enabled"]`);
                    const startInput = document.getElementById(`${day}_start`);
                    const endInput = document.getElementById(`${day}_end`);
                    
                    if (enabledCheckbox && startInput && endInput) {
                        enabledCheckbox.checked = true;
                        startInput.value = daySchedule.start || '';
                        endInput.value = daySchedule.end || '';
                    }
                } else {
                    const enabledCheckbox = document.querySelector(`input[name="schedule_${day}_enabled"]`);
                    
                    if (enabledCheckbox) {
                        enabledCheckbox.checked = false;
                    }
                }
            });
        }
        
        // Set staff ID as data attribute
        form.dataset.staffId = staffMember._id;
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Staff Member';
        
        // Clear staff ID
        delete form.dataset.staffId;
    }
    
    // Show modal
    modal.classList.add('active');
}

/**
 * Close staff modal
 */
function closeStaffModal() {
    const modal = document.getElementById('staff-modal');
    
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Save staff member (add or edit)
 */
function saveStaff() {
    const form = document.getElementById('staff-form');
    
    if (!form) return;
    
    // Get form data
    const formData = {
        name: document.getElementById('staff-name').value,
        title: document.getElementById('staff-title').value,
        email: document.getElementById('staff-email').value,
        phone: document.getElementById('staff-phone').value,
        bio: document.getElementById('staff-bio').value,
        active: document.getElementById('staff-status').value === 'active'
    };
    
    // Get specialties
    const specialtyCheckboxes = document.querySelectorAll('input[name="specialties"]:checked');
    formData.specialties = Array.from(specialtyCheckboxes).map(checkbox => checkbox.value);
    
    // Get services
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
    formData.services = Array.from(serviceCheckboxes).map(checkbox => checkbox.value);
    
    // Get schedule
    formData.schedule = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    days.forEach(day => {
        const enabledCheckbox = document.querySelector(`input[name="schedule_${day}_enabled"]`);
        const startInput = document.getElementById(`${day}_start`);
        const endInput = document.getElementById(`${day}_end`);
        
        if (enabledCheckbox && enabledCheckbox.checked) {
            formData.schedule[day] = {
                start: startInput.value,
                end: endInput.value
            };
        }
    });
    
    // Validate form data
    if (!formData.name || !formData.title || !formData.email) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Check if editing or adding
    const staffId = form.dataset.staffId;
    
    if (staffId) {
        // Edit existing staff member
        staffService.updateStaffMember(staffId, formData)
            .then(updatedStaff => {
                // Update staff in data
                const index = staffData.findIndex(s => s._id === staffId);
                
                if (index !== -1) {
                    staffData[index] = updatedStaff;
                }
                
                // Re-render table
                renderStaffTable(staffData);
                
                // Close modal
                closeStaffModal();
                
                // Show success message
                alert('Staff member updated successfully.');
            })
            .catch(error => {
                console.error('Error updating staff member:', error);
                alert('Error updating staff member. Please try again.');
            });
    } else {
        // Add new staff member
        staffService.createStaffMember(formData)
            .then(newStaff => {
                // Add staff to data
                staffData.push(newStaff);
                
                // Re-render table
                renderStaffTable(staffData);
                
                // Close modal
                closeStaffModal();
                
                // Show success message
                alert('Staff member added successfully.');
            })
            .catch(error => {
                console.error('Error adding staff member:', error);
                alert('Error adding staff member. Please try again.');
            });
    }
}

/**
 * View staff member details
 */
function viewStaff(staffId) {
    // Find staff member
    const staffMember = staffData.find(s => s._id === staffId);
    
    if (!staffMember) {
        alert('Staff member not found.');
        return;
    }
    
    // Open modal with staff details
    openStaffModal(staffMember);
    
    // Make form read-only
    const form = document.getElementById('staff-form');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.setAttribute('readonly', true);
        input.setAttribute('disabled', true);
    });
    
    // Hide save button
    document.getElementById('save-staff-btn').style.display = 'none';
}

/**
 * Edit staff member
 */
function editStaff(staffId) {
    // Find staff member
    const staffMember = staffData.find(s => s._id === staffId);
    
    if (!staffMember) {
        alert('Staff member not found.');
        return;
    }
    
    // Open edit modal
    openStaffModal(staffMember);
}

/**
 * Delete staff member
 */
function deleteStaff(staffId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this staff member?')) {
        return;
    }
    
    // Find staff member
    const staffMember = staffData.find(s => s._id === staffId);
    
    if (!staffMember) {
        alert('Staff member not found.');
        return;
    }
    
    // Delete staff member
    staffService.deleteStaffMember(staffId)
        .then(() => {
            // Remove staff from data
            staffData = staffData.filter(s => s._id !== staffId);
            
            // Re-render table
            renderStaffTable(staffData);
            
            // Show success message
            alert('Staff member deleted successfully.');
        })
        .catch(error => {
            console.error('Error deleting staff member:', error);
            alert('Error deleting staff member. Please try again.');
        });
}

/**
 * Search staff members
 */
function searchStaff(searchTerm) {
    if (!searchTerm) {
        // If empty search term, show all staff
        renderStaffTable(staffData);
        return;
    }
    
    // Filter staff by name, title, or email
    const filteredStaff = staffData.filter(staff => 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Render filtered staff
    renderStaffTable(filteredStaff);
}