/**
 * Header Component Functionality
 */

// Initialize header functionality
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    highlightActiveLink();
    setupScrollEffects();
});

/**
 * Set up mobile menu toggle
 */
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.navigation');
    const closeMenu = document.querySelector('.close-menu');
    
    if (menuToggle && mobileNav) {
        // Open mobile menu
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
        
        // Close mobile menu
        if (closeMenu) {
            closeMenu.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(event.target) && 
                event.target !== menuToggle) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Highlight the active navigation link based on current page
 */
function highlightActiveLink() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.navigation a');
    
    navLinks.forEach(link => {
        // Get the link's href attribute
        const linkPath = link.getAttribute('href');
        
        // Check if the current page matches the link
        if (currentPage.endsWith(linkPath) || 
            (currentPage.endsWith('/') && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Set up scroll effects for the header
 */
function setupScrollEffects() {
    const header = document.getElementById('main-header');
    
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow when scrolled
            if (scrollTop > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide when scrolling down (on mobile only)
            if (window.innerWidth <= 768) {
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.style.transform = '';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

/**
 * Update header based on page section (for single-page layouts)
 * @param {string} section - Current active section ID
 */
function updateHeaderForSection(section) {
    const navLinks = document.querySelectorAll('.navigation a');
    
    navLinks.forEach(link => {
        const linkSection = link.getAttribute('href').replace('#', '');
        
        if (linkSection === section) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Optional: Change header background based on section
    const header = document.getElementById('main-header');
    
    if (header) {
        switch (section) {
            case 'hero':
                header.classList.add('transparent');
                break;
            default:
                header.classList.remove('transparent');
                break;
        }
    }
}

/**
 * Smooth scroll to section when clicking navigation links
 * (for single-page layouts)
 */
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.navigation a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const mobileNav = document.querySelector('.navigation');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for header height
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}