/**
 * UBIQA LANDING PAGE - INTERACTIVE FUNCTIONALITY
 * Modern JavaScript for animations, modal handling, and user interactions
 */

class UbiqaLanding {
    constructor() {
        this.isLoaded = false;
        this.observers = new Map();
        this.modal = null;
        this.mobileMenu = null;
        this.header = null;
        
        // Configuration
        this.config = {
            googleFormUrl: 'REPLACE_WITH_GOOGLE_FORM_EMBED_URL',
            animationDelay: 100,
            scrollOffset: 80,
            modalCloseKeys: ['Escape'],
            debounceDelay: 16
        };
        
        this.init();
    }
    
    /**
     * Initialize all functionality
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    /**
     * Main setup function
     */
    setup() {
        this.cacheDOM();
        this.bindEvents();
        this.initAnimations();
        this.initScrollEffects();
        this.hideLoadingOverlay();
        this.isLoaded = true;
        
        console.log('🏠 Ubiqa Landing Page initialized successfully');
    }
    
    /**
     * Cache DOM elements for better performance
     */
    cacheDOM() {
        // Navigation elements
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        
        // Modal elements
        this.modal = document.getElementById('google-form-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalClose = document.getElementById('modal-close');
        this.modalIframe = document.getElementById('google-form-iframe');
        
        // Form elements
        this.joinForm = document.getElementById('join-form');
        this.joinBtn = document.getElementById('join-btn');
        this.userName = document.getElementById('user-name');
        this.userEmail = document.getElementById('user-email');
        this.userIntent = document.getElementById('user-intent');
        
        // CTA buttons
        this.ctaButtons = document.querySelectorAll('[id$="-cta"]');
        
        // Loading overlay
        this.loadingOverlay = document.getElementById('loading-overlay');
        
        // Animated elements
        this.animatedElements = document.querySelectorAll('[data-animate]');
    }
    
    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Navigation events
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => this.toggleMobileMenu(e));
        }
        
        // Navigation links smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
        
        // Modal events
        this.bindModalEvents();
        
        // Form events
        if (this.joinBtn) {
            this.joinBtn.addEventListener('click', (e) => this.handleJoinForm(e));
        }
        
        // CTA button events
        this.ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCTAClick(e));
        });
        
        // Window events
        window.addEventListener('scroll', this.debounce(() => this.handleScroll(), this.config.debounceDelay));
        window.addEventListener('resize', this.debounce(() => this.handleResize(), this.config.debounceDelay));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }
    
    /**
     * Bind modal-specific events
     */
    bindModalEvents() {
        if (!this.modal) return;
        
        // Close modal events
        [this.modalOverlay, this.modalClose].forEach(element => {
            if (element) {
                element.addEventListener('click', () => this.closeModal());
            }
        });
        
        // Prevent modal content clicks from closing modal
        const modalContainer = this.modal.querySelector('.modal__container');
        if (modalContainer) {
            modalContainer.addEventListener('click', (e) => e.stopPropagation());
        }
    }
    
    /**
     * Initialize scroll-based animations using Intersection Observer
     */
    initAnimations() {
        if (!this.animatedElements.length) return;
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        this.animatedElements.forEach(element => {
            // Add initial animation class
            const animationType = element.dataset.animate;
            element.classList.add(`animate-${animationType}`);
            
            // Apply delay if specified
            const delay = element.dataset.delay;
            if (delay) {
                element.style.animationDelay = `${delay}ms`;
                element.style.transitionDelay = `${delay}ms`;
            }
            
            animationObserver.observe(element);
        });
        
        this.observers.set('animation', animationObserver);
    }
    
    /**
     * Initialize scroll effects for header
     */
    initScrollEffects() {
        if (!this.header) return;
        
        const scrollObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.header.classList.remove('scrolled');
                    } else {
                        this.header.classList.add('scrolled');
                    }
                });
            },
            { 
                root: null,
                rootMargin: '0px 0px -60px 0px',
                threshold: 0 
            }
        );
        
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            scrollObserver.observe(heroSection);
            this.observers.set('scroll', scrollObserver);
        }
    }
    
    /**
     * Animate element when it comes into view
     */
    animateElement(element) {
        element.classList.add('visible');
        
        // Add ripple effect for special elements
        if (element.classList.contains('trust-strip__item') || 
            element.classList.contains('pricing__feature')) {
            this.addRippleEffect(element);
        }
    }
    
    /**
     * Add subtle ripple effect to elements
     */
    addRippleEffect(element) {
        element.style.transform = 'scale(1.02)';
        element.style.transition = 'transform 0.3s ease-out';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    }
    
    /**
     * Toggle mobile navigation menu
     */
    toggleMobileMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!this.navMenu || !this.navToggle) return;
        
        const isOpen = this.navMenu.classList.contains('active');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    /**
     * Open mobile menu
     */
    openMobileMenu() {
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        const menuItems = this.navMenu.querySelectorAll('.nav__link');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 50}ms`;
            item.classList.add('slide-in');
        });
    }
    
    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove animation classes
        const menuItems = this.navMenu.querySelectorAll('.nav__link');
        menuItems.forEach(item => {
            item.classList.remove('slide-in');
            item.style.animationDelay = '';
        });
    }
    
    /**
     * Handle smooth scrolling for anchor links
     */
    handleSmoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (!href || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        const targetId = href.slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (!targetElement) return;
        
        // Close mobile menu if open
        if (this.navMenu && this.navMenu.classList.contains('active')) {
            this.closeMobileMenu();
        }
        
        // Calculate scroll position
        const headerHeight = this.header ? this.header.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        // Smooth scroll
        this.smoothScrollTo(targetPosition);
    }
    
    /**
     * Smooth scroll to position
     */
    smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) * 0.5, 1000);
        let startTime = null;
        
        const scrollAnimation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (easeInOutCubic)
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(scrollAnimation);
            }
        };
        
        requestAnimationFrame(scrollAnimation);
    }
    
    /**
     * Handle CTA button clicks
     */
    handleCTAClick(e) {
        const buttonId = e.currentTarget.id;
        
        // Show loading state
        this.showLoadingOverlay();
        
        // Handle different CTA types
        switch (buttonId) {
            case 'map-cta':
            case 'pricing-cta':
            case 'join-btn':
                this.openModal();
                break;
            default:
                this.openModal();
        }
        
        // Hide loading after modal opens
        setTimeout(() => this.hideLoadingOverlay(), 500);
    }
    
    /**
     * Handle join form submission
     */
    handleJoinForm(e) {
        e.preventDefault();
        
        // Validate form
        const validation = this.validateJoinForm();
        if (!validation.isValid) {
            this.showFormErrors(validation.errors);
            return;
        }
        
        // Show success state
        this.showFormSuccess();
        
        // Open modal after short delay
        setTimeout(() => {
            this.openModal();
        }, 1000);
    }
    
    /**
     * Validate join form
     */
    validateJoinForm() {
        const errors = [];
        
        // Name validation
        const name = this.userName?.value?.trim();
        if (!name || name.length < 2) {
            errors.push({ field: 'name', message: 'Ingresa tu nombre completo' });
        }
        
        // Email validation
        const email = this.userEmail?.value?.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push({ field: 'email', message: 'Ingresa un correo válido' });
        }
        
        // Intent validation
        const intent = this.userIntent?.value;
        if (!intent) {
            errors.push({ field: 'intent', message: 'Selecciona una opción' });
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Show form validation errors
     */
    showFormErrors(errors) {
        // Clear previous errors
        this.clearFormErrors();
        
        errors.forEach(error => {
            const field = error.field === 'name' ? this.userName :
                         error.field === 'email' ? this.userEmail :
                         this.userIntent;
            
            if (field) {
                field.style.borderColor = 'var(--color-error)';
                field.style.backgroundColor = 'rgba(255, 59, 48, 0.1)';
                
                // Create error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'form-error';
                errorDiv.textContent = error.message;
                errorDiv.style.color = 'var(--color-error)';
                errorDiv.style.fontSize = 'var(--font-size-footnote)';
                errorDiv.style.marginTop = '4px';
                
                field.parentNode.insertBefore(errorDiv, field.nextSibling);
            }
        });
        
        // Shake animation
        this.joinForm.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.joinForm.style.animation = '';
        }, 500);
    }
    
    /**
     * Clear form errors
     */
    clearFormErrors() {
        [this.userName, this.userEmail, this.userIntent].forEach(field => {
            if (field) {
                field.style.borderColor = '';
                field.style.backgroundColor = '';
            }
        });
        
        // Remove error messages
        document.querySelectorAll('.form-error').forEach(error => error.remove());
    }
    
    /**
     * Show form success state
     */
    showFormSuccess() {
        this.joinBtn.textContent = '¡Registro exitoso!';
        this.joinBtn.style.backgroundColor = 'var(--color-success)';
        
        setTimeout(() => {
            this.joinBtn.textContent = 'Crear mi Cuenta';
            this.joinBtn.style.backgroundColor = '';
        }, 3000);
    }
    
    /**
     * Open modal with Google Form
     */
    openModal() {
        if (!this.modal) return;
        
        // Set iframe src if not already set
        if (this.modalIframe && this.modalIframe.src.includes('REPLACE_WITH')) {
            // Try to open in new window as fallback
            this.openGoogleFormInNewWindow();
            return;
        }
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        this.trapFocus(this.modal);
        
        // Track modal open
        this.trackEvent('modal_open', 'engagement');
    }
    
    /**
     * Close modal
     */
    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Track modal close
        this.trackEvent('modal_close', 'engagement');
    }
    
    /**
     * Open Google Form in new window as fallback
     */
    openGoogleFormInNewWindow() {
        const fallbackUrl = 'https://forms.google.com/'; // Replace with actual form URL
        window.open(fallbackUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        this.trackEvent('form_external_open', 'engagement');
    }
    
    /**
     * Trap focus within modal
     */
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }
    
    /**
     * Handle scroll events
     */
    handleScroll() {
        // Additional scroll-based animations can be added here
        const scrollY = window.pageYOffset;
        
        // Parallax effect for hero section
        const hero = document.getElementById('hero');
        if (hero && scrollY < hero.offsetHeight) {
            const parallaxElements = hero.querySelectorAll('.hero__mockup');
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.navMenu?.classList.contains('active')) {
            this.closeMobileMenu();
        }
    }
    
    /**
     * Handle keyboard events
     */
    handleKeyDown(e) {
        // Close modal on Escape key
        if (this.config.modalCloseKeys.includes(e.key) && this.modal?.classList.contains('active')) {
            this.closeModal();
        }
        
        // Close mobile menu on Escape key
        if (e.key === 'Escape' && this.navMenu?.classList.contains('active')) {
            this.closeMobileMenu();
        }
    }
    
    /**
     * Handle clicks outside mobile menu
     */
    handleOutsideClick(e) {
        if (!this.navMenu?.classList.contains('active')) return;
        
        const isClickInsideMenu = this.navMenu.contains(e.target);
        const isClickOnToggle = this.navToggle?.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnToggle) {
            this.closeMobileMenu();
        }
    }
    
    /**
     * Show loading overlay
     */
    showLoadingOverlay() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('active');
        }
    }
    
    /**
     * Hide loading overlay
     */
    hideLoadingOverlay() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('active');
        }
    }
    
    /**
     * Track events (placeholder for analytics)
     */
    trackEvent(eventName, category, value = 1) {
        // Placeholder for Google Analytics or other tracking
        console.log(`📊 Event tracked: ${eventName} (${category})`, value);
        
        // Example implementation:
        // gtag('event', eventName, {
        //     event_category: category,
        //     value: value
        // });
    }
    
    /**
     * Debounce function for performance optimization
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Cleanup method for removing event listeners and observers
     */
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('click', this.handleOutsideClick);
        
        console.log('🧹 Ubiqa Landing Page cleaned up');
    }
}

// CSS for additional animations
const additionalStyles = `
    <style>
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .slide-in {
            animation: slideIn 0.3s ease-out forwards;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-error {
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Smooth scroll polyfill for older browsers */
        html {
            scroll-behavior: smooth;
        }
    </style>
`;

// Initialize the application when DOM is ready
let ubiqaApp;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    // Add additional styles
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
    
    // Initialize the main application
    ubiqaApp = new UbiqaLanding();
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            ubiqaApp.trackEvent('page_hidden', 'engagement');
        } else {
            ubiqaApp.trackEvent('page_visible', 'engagement');
        }
    });
    
    // Handle before unload for cleanup
    window.addEventListener('beforeunload', () => {
        if (ubiqaApp) {
            ubiqaApp.destroy();
        }
    });
}

// Error handling for uncaught errors
window.addEventListener('error', (e) => {
    console.error('🚨 Uncaught error in Ubiqa Landing:', e.error);
    
    // Track error (optional)
    if (ubiqaApp) {
        ubiqaApp.trackEvent('javascript_error', 'error');
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UbiqaLanding;
}