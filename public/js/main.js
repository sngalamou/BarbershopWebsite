// barbershop-frontend/public/js/main.js
/**
 * Main JavaScript file for Classic Cuts Barbershop
 * This file initializes global components and functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize header and footer components
    initializeHeader();
    initializeFooter();
    
    // Set up mobile menu functionality
    setupMobileMenu();
    
    // Initialize any page-specific functionality
    initializePageSpecific();
});

/**
 * Initialize the site header
 */
function initializeHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    // Set current page as active in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Header HTML content
    header.innerHTML = `
        <div class="container header-container">
            <div class="logo">
                <a href="index.html">
                    <img src="assets/images/logo.png" alt="Classic Cuts Barbershop Logo">
                </a>
                <h1>Classic Cuts</h1>
            </div>
            
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <i class="fas fa-bars"></i>
            </button>
            
            <nav class="navigation">
                <button class="close-menu">×</button>
                <ul>
                    <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a></li>
                    <li><a href="about.html" class="${currentPage === 'about.html' ? 'active' : ''}">About</a></li>
                    <li><a href="services.html" class="${currentPage === 'services.html' ? 'active' : ''}">Services</a></li>
                    <li><a href="booking.html" class="${currentPage === 'booking.html' ? 'active' : ''}">Book Now</a></li>
                    <li><a href="contact.html" class="${currentPage === 'contact.html' ? 'active' : ''}">Contact</a></li>
                </ul>
            </nav>
        </div>
    `;
}

/**
 * Initialize the site footer
 */
function initializeFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    
    // Footer HTML content
    footer.innerHTML = `
        <div class="container">
            <div class="footer-container">
                <div class="footer-info">
                    <h3>Classic Cuts Barbershop</h3>
                    <p>123 Main Street</p>
                    <p>Anytown, ST 12345</p>
                    <p>Phone: (555) 123-4567</p>
                    <p>Email: info@classiccuts.com</p>
                </div>
                
                <div class="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="services.html">Services</a></li>
                        <li><a href="booking.html">Book Online</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                    </ul>
                </div>
                
                <div class="footer-hours">
                    <h3>Hours of Operation</h3>
                    <ul>
                        <li>
                            <span>Monday - Friday</span>
                            <span>9:00 AM - 7:00 PM</span>
                        </li>
                        <li>
                            <span>Saturday</span>
                            <span>8:00 AM - 5:00 PM</span>
                        </li>
                        <li>
                            <span>Sunday</span>
                            <span>Closed</span>
                        </li>
                    </ul>
                </div>
                
                <div class="footer-social">
                    <h3>Follow Us</h3>
                    <div class="social-icons">
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Yelp"><i class="fab fa-yelp"></i></a>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} Classic Cuts Barbershop. All rights reserved.</p>
            </div>
        </div>
    `;
}

/**
 * Set up mobile menu functionality
 */
function setupMobileMenu() {
    // Toggle mobile menu
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const navigation = document.querySelector('.navigation');
    
    if (menuToggle && closeMenu && navigation) {
        menuToggle.addEventListener('click', function() {
            navigation.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeMenu.addEventListener('click', function() {
            navigation.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

/**
 * Initialize page-specific functionality
 */
function initializePageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
            // Initialize home page components
            if (typeof initializeServicesPreview === 'function') {
                initializeServicesPreview();
            }
            if (typeof initializeStaffCarousel === 'function') {
                initializeStaffCarousel();
            }
            break;
            
        case 'services.html':
            // Initialize services page components
            if (typeof initializeServicesList === 'function') {
                initializeServicesList();
            }
            break;
            
        case 'booking.html':
            // Initialize booking page components
            if (typeof initializeBookingForm === 'function') {
                initializeBookingForm();
            }
            break;
            
        case 'contact.html':
            // Initialize contact page components
            initializeContactForm();
            initializeMap();
            break;
    }
}

/**
 * Initialize contact form validation
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation (could be expanded)
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            alert('Please fill out all required fields.');
            return;
        }
        
        // Here you would normally send the form data to a server
        alert('Thank you for your message. We will get back to you soon!');
        contactForm.reset();
    });
}

/**
 * Initialize Google Maps integration (placeholder)
 */
function initializeMap() {
    const mapContainer = document.querySelector('.map-placeholder');
    if (!mapContainer) return;
    
    // This would be replaced with actual Google Maps implementation
    mapContainer.innerHTML = `
        <div style="background-color: #eee; height: 300px; display: flex; align-items: center; justify-content: center; text-align: center; border-radius: 8px;">
            <div>
                <p>Map of Classic Cuts Barbershop</p>
                <p>123 Main Street, Anytown, ST 12345</p>
            </div>
        </div>
    `;
}