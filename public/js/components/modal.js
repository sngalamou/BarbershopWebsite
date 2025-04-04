/**
 * Modal Component Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modals
    initializeModals();
});

/**
 * Initialize all modals on the page
 */
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        // Get close buttons
        const closeButtons = modal.querySelectorAll('.close-modal, [data-close-modal]');
        
        // Add click event to close buttons
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeModal(modal);
            });
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

/**
 * Open a modal by ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Show modal
    modal.classList.add('active');
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Close a specific modal
 */
function closeModal(modal) {
    // Hide modal
    modal.classList.remove('active');
    
    // Restore scrolling
    document.body.style.overflow = '';
}