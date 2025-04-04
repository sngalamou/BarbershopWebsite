/**
 * Staff Carousel Component Functionality
 */

/**
 * Initialize the staff carousel/display
 */
function initializeStaffCarousel() {
    const barberContainer = document.getElementById('barbers-container');
    if (!barberContainer) return;
    
    // Show loading state
    barberContainer.innerHTML = '<div class="barber-loading">Loading our barbers...</div>';
    
    // Fetch staff data
    staffService.getAllStaff()
        .then(staff => {
            // Render staff cards
            renderStaffCards(barberContainer, staff);
            
            // Initialize carousel for mobile view
            initMobileCarousel();
        })
        .catch(error => {
            console.error('Error loading staff data:', error);
            barberContainer.innerHTML = `
                <div class="error-message">
                    <p>Sorry, we couldn't load our barbers information. Please try again later.</p>
                </div>
            `;
        });
}

/**
 * Render staff cards
 */
function renderStaffCards(container, staff) {
    // Check if staff data exists
    if (!staff || staff.length === 0) {
        container.innerHTML = '<p>No barbers information available at the moment.</p>';
        return;
    }
    
    // Desktop view - Grid layout
    const cardsHTML = staff.map(barber => `
        <div class="barber-card">
            <div class="barber-image">
                <img src="assets/images/staff/${barber.image || 'default.jpg'}" alt="${barber.name}">
            </div>
            <div class="barber-info">
                <h3 class="barber-name">${barber.name}</h3>
                <p class="barber-title">${barber.title}</p>
                <p class="barber-bio">${barber.bio || 'Our skilled barber with years of experience in classic and modern cuts.'}</p>
                
                <div class="barber-specialties">
                    <h4>Specialties</h4>
                    <div class="specialty-tags">
                        ${renderSpecialties(barber.specialties)}
                    </div>
                </div>
                
                <div class="barber-cta">
                    <a href="booking.html" class="btn btn-primary">Book with ${barber.name.split(' ')[0]}</a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Mobile view - Carousel layout
    const carouselHTML = `
        <div class="barbers-carousel">
            <div class="carousel-container">
                <div class="carousel-track">
                    ${staff.map(barber => `
                        <div class="carousel-slide">
                            <div class="barber-card">
                                <div class="barber-image">
                                    <img src="assets/images/staff/${barber.image || 'default.jpg'}" alt="${barber.name}">
                                </div>
                                <div class="barber-info">
                                    <h3 class="barber-name">${barber.name}</h3>
                                    <p class="barber-title">${barber.title}</p>
                                    <p class="barber-bio">${barber.bio || 'Our skilled barber with years of experience in classic and modern cuts.'}</p>
                                    
                                    <div class="barber-specialties">
                                        <h4>Specialties</h4>
                                        <div class="specialty-tags">
                                            ${renderSpecialties(barber.specialties)}
                                        </div>
                                    </div>
                                    
                                    <div class="barber-cta">
                                        <a href="booking.html" class="btn btn-primary">Book with ${barber.name.split(' ')[0]}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="carousel-nav">
                ${staff.map((_, index) => `
                    <div class="carousel-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Combine both layouts
    container.innerHTML = `
        <div class="barbers-grid">
            ${cardsHTML}
        </div>
        ${carouselHTML}
    `;
}

/**
 * Render specialties tags
 */
function renderSpecialties(specialties) {
    if (!specialties || specialties.length === 0) {
        return `
            <span class="specialty-tag">Classic Cuts</span>
            <span class="specialty-tag">Modern Styles</span>
        `;
    }
    
    return specialties.map(specialty => `
        <span class="specialty-tag">${specialty}</span>
    `).join('');
}

/**
 * Initialize mobile carousel functionality
 */
function initMobileCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!track || !slides.length || !dots.length) return;
    
    // Set slide width based on container
    const slideWidth = slides[0].getBoundingClientRect().width;
    
    // Set track width
    track.style.width = `${slideWidth * slides.length}px`;
    
    // Add click event to dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.dataset.slide);
            
            // Update active dot
            dots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            
            // Move to selected slide
            track.style.transform = `translateX(-${slideWidth * slideIndex}px)`;
        });
    });
}