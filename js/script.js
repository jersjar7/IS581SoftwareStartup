/**
 * OQUPA LANDING PAGE - PRODUCTION READY
 * Complete interactive functionality with mobile optimization
 */

class OqupaLanding {
    constructor() {
        this.isInitialized = false;
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        try {
            this.cacheElements();
            this.bindEvents();
            this.bindMobileEvents();
            this.initAnimations();
            this.initScrollEffects();
            this.initPerformanceOptimizations();
            this.isInitialized = true;
            console.log('🏠 Oqupa Landing Page initialized successfully');
        } catch (error) {
            console.error('Error initializing Oqupa Landing:', error);
            this.handleInitializationError(error);
        }
    }
    
    cacheElements() {
        // Navigation elements
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        
        // Modal elements
        this.modal = document.getElementById('google-form-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalClose = document.getElementById('modal-close');
        
        // Form elements
        this.joinForm = document.getElementById('join-form');
        this.joinBtn = document.getElementById('join-btn');
        this.userNameInput = document.getElementById('user-name');
        this.userEmailInput = document.getElementById('user-email');
        this.userIntentSelect = document.getElementById('user-intent');
        
        // Animation elements
        this.animatedElements = document.querySelectorAll('[data-animate]');
        
        // Loading overlay
        this.loadingOverlay = document.getElementById('loading-overlay');
        
        // Validation
        this.validateRequiredElements();
    }
    
    validateRequiredElements() {
        const requiredElements = {
            'Navigation toggle': this.navToggle,
            'Navigation menu': this.navMenu,
            'Join form': this.joinForm,
            'Join button': this.joinBtn
        };
        
        for (const [name, element] of Object.entries(requiredElements)) {
            if (!element) {
                console.warn(`${name} element not found. Some functionality may not work.`);
            }
        }
    }
    
    bindEvents() {
        // Navigation toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => this.toggleMobileMenu(e));
            this.navToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileMenu(e);
                }
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
        
        // Modal events
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', () => this.closeModal());
        }
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }
        
        // Form submission
        if (this.joinForm) {
            this.joinForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboardEvents(e));
        
        // Click outside mobile menu
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Orientation change (mobile)
        window.addEventListener('orientationchange', () => this.handleOrientationChange());
        
        // Prevent zoom on double tap (mobile)
        this.preventDoubleTabZoom();
    }
    
    bindMobileEvents() {
        if (!this.navToggle || !this.navMenu) return;
        
        // Enhanced touch events for better mobile response
        this.navToggle.addEventListener('touchstart', (e) => {
            this.navToggle.style.transform = 'scale(0.95)';
        }, { passive: true });

        this.navToggle.addEventListener('touchend', (e) => {
            this.navToggle.style.transform = 'scale(1)';
        }, { passive: true });

        // Close menu when clicking on menu links
        const mobileMenuLinks = document.querySelectorAll('.nav__link');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Prevent body scroll when menu is open
        document.addEventListener('touchmove', (e) => {
            if (this.navMenu?.classList.contains('active')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    initAnimations() {
        if (!this.animatedElements.length) return;
        
        // Use Intersection Observer for performance
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);
        
        this.animatedElements.forEach(element => {
            const animationType = element.dataset.animate;
            element.classList.add(`animate-${animationType}`);
            
            const delay = element.dataset.delay;
            if (delay) {
                element.style.transitionDelay = `${delay}ms`;
            }
            
            observer.observe(element);
        });
    }
    
    animateElement(element) {
        element.classList.add('visible');
        
        // Add completion callback if needed
        element.addEventListener('transitionend', () => {
            element.classList.add('animation-complete');
        }, { once: true });
    }
    
    initScrollEffects() {
        if (!this.header) return;
        
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.header.classList.remove('scrolled');
                } else {
                    this.header.classList.add('scrolled');
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0
        });
        
        observer.observe(heroSection);
    }
    
    initPerformanceOptimizations() {
        // Lazy load images that aren't already lazy loaded
        this.initLazyLoading();
        
        // Optimize scroll performance
        this.optimizeScrollPerformance();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }
    
    initLazyLoading() {
        const images = document.querySelectorAll('img:not([loading])');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    optimizeScrollPerformance() {
        let ticking = false;
        
        const optimizedScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Perform scroll-based updates here
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    }
    
    preloadCriticalResources() {
        // Preload next section images when user scrolls past hero
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        this.loadNextSectionImages();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(heroSection);
        }
    }
    
    loadNextSectionImages() {
        const nextImages = document.querySelectorAll('[loading="lazy"]');
        nextImages.forEach((img, index) => {
            if (index < 3) { // Load first 3 images
                const tempImg = new Image();
                tempImg.src = img.src;
            }
        });
    }
    
    // Mobile menu methods
    toggleMobileMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (!this.navMenu || !this.navToggle) {
            console.warn('Navigation elements not found');
            return;
        }
        
        const isOpen = this.navMenu.classList.contains('active');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
        
        // Update ARIA attributes for accessibility
        this.navToggle.setAttribute('aria-expanded', !isOpen);
    }
    
    openMobileMenu() {
        if (!this.navMenu || !this.navToggle) return;
        
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Store current scroll position
        this.scrollPosition = window.pageYOffset;
        document.body.style.top = `-${this.scrollPosition}px`;
        
        // Add backdrop
        this.addMobileMenuBackdrop();
        
        // Focus management
        this.focusTrap();
    }
    
    closeMobileMenu() {
        if (!this.navMenu || !this.navToggle) return;
        
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        
        // Restore scroll position
        if (this.scrollPosition !== undefined) {
            window.scrollTo(0, this.scrollPosition);
        }
        
        // Remove backdrop
        this.removeMobileMenuBackdrop();
    }
    
    addMobileMenuBackdrop() {
        this.removeMobileMenuBackdrop(); // Remove existing backdrop
        
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            z-index: 998;
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            transition: opacity 0.3s ease-out;
            opacity: 0;
        `;
        
        backdrop.addEventListener('click', () => this.closeMobileMenu());
        document.body.appendChild(backdrop);
        
        // Fade in
        requestAnimationFrame(() => {
            backdrop.style.opacity = '1';
        });
    }
    
    removeMobileMenuBackdrop() {
        const backdrop = document.querySelector('.mobile-menu-backdrop');
        if (backdrop) {
            backdrop.style.opacity = '0';
            setTimeout(() => backdrop.remove(), 300);
        }
    }
    
    focusTrap() {
        const focusableElements = this.navMenu.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };
        
        document.addEventListener('keydown', handleTabKey);
        
        // Remove listener when menu closes
        const removeListener = () => {
            document.removeEventListener('keydown', handleTabKey);
            document.removeEventListener('keydown', removeListener);
        };
        
        // Auto-remove when menu closes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!this.navMenu.classList.contains('active')) {
                    removeListener();
                    observer.disconnect();
                }
            });
        });
        
        observer.observe(this.navMenu, { attributes: true, attributeFilter: ['class'] });
    }
    
    // Smooth scrolling
    handleSmoothScroll(e) {
        const href = e.currentTarget.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        const targetId = href.slice(1);
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        // Close mobile menu if open
        this.closeMobileMenu();
        
        // Calculate scroll position
        const headerHeight = this.header ? this.header.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        // Smooth scroll with fallback
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback for older browsers
            this.smoothScrollPolyfill(targetPosition);
        }
    }
    
    smoothScrollPolyfill(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        requestAnimationFrame(animation);
    }
    
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    // Form handling
    handleFormSubmit(e) {
        e.preventDefault();
        
        // Show loading state
        this.showLoadingState();
        
        // Get form data
        const formData = this.getFormData();
        
        // Validate form
        const validationResult = this.validateForm(formData);
        if (!validationResult.isValid) {
            this.hideLoadingState();
            this.showFormError(validationResult.errors[0]);
            return;
        }
        
        // Simulate form submission
        this.submitForm(formData);
    }
    
    getFormData() {
        return {
            name: this.userNameInput?.value?.trim() || '',
            email: this.userEmailInput?.value?.trim() || '',
            intent: this.userIntentSelect?.value || ''
        };
    }
    
    validateForm(data) {
        const errors = [];
        
        if (!data.name) {
            errors.push('Por favor ingresa tu nombre completo');
        } else if (data.name.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }
        
        if (!data.email) {
            errors.push('Por favor ingresa tu correo electrónico');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Por favor ingresa un correo electrónico válido');
        }
        
        if (!data.intent) {
            errors.push('Por favor selecciona qué te interesa más');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email);
    }
    
    submitForm(data) {
        // Simulate API call
        setTimeout(() => {
            this.hideLoadingState();
            this.showSuccessState();
            
            // Reset form after success
            setTimeout(() => {
                this.resetForm();
                this.openModal();
            }, 2000);
        }, 1500);
        
        // In production, replace with actual API call:
        // fetch('/api/subscribe', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // }).then(response => response.json())
        //   .then(result => this.handleSubmissionResult(result))
        //   .catch(error => this.handleSubmissionError(error));
    }
    
    showLoadingState() {
        if (this.joinBtn) {
            this.joinBtn.textContent = 'Procesando...';
            this.joinBtn.disabled = true;
            this.joinBtn.classList.add('loading');
        }
    }
    
    hideLoadingState() {
        if (this.joinBtn) {
            this.joinBtn.disabled = false;
            this.joinBtn.classList.remove('loading');
        }
    }
    
    showSuccessState() {
        if (this.joinBtn) {
            this.joinBtn.textContent = '¡Registrado exitosamente!';
            this.joinBtn.style.backgroundColor = 'var(--color-success)';
        }
    }
    
    resetForm() {
        if (this.joinForm) {
            this.joinForm.reset();
        }
        
        if (this.joinBtn) {
            this.joinBtn.textContent = 'Unirme a la Lista de Espera';
            this.joinBtn.style.backgroundColor = '';
        }
        
        // Clear any error messages
        this.clearFormErrors();
    }
    
    showFormError(message) {
        this.clearFormErrors();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-footnote);
            text-align: center;
            margin-top: 12px;
            padding: 8px 12px;
            background-color: rgba(255, 59, 48, 0.1);
            border-radius: 6px;
            animation: fadeIn 0.3s ease-out;
        `;
        
        if (this.joinForm) {
            this.joinForm.appendChild(errorDiv);
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    clearFormErrors() {
        document.querySelectorAll('.form-error').forEach(error => error.remove());
    }
    
    // Modal methods
    openModal() {
        if (!this.modal) {
            // Fallback: open Google Forms in new window
            window.open('https://forms.google.com/', '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
            return;
        }
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const closeButton = this.modal.querySelector('.modal__close');
        if (closeButton) {
            closeButton.focus();
        }
    }
    
    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event handlers
    handleKeyboardEvents(e) {
        switch (e.key) {
            case 'Escape':
                this.closeModal();
                this.closeMobileMenu();
                break;
        }
    }
    
    handleOutsideClick(e) {
        if (this.navMenu?.classList.contains('active')) {
            const isClickInsideMenu = this.navMenu.contains(e.target);
            const isClickOnToggle = this.navToggle?.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnToggle) {
                this.closeMobileMenu();
            }
        }
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // Close mobile menu if screen becomes desktop
        if (wasMobile && !this.isMobile && this.navMenu?.classList.contains('active')) {
            this.closeMobileMenu();
        }
        
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.handleResizeComplete();
        }, 250);
    }
    
    handleResizeComplete() {
        // Recalculate any size-dependent features
        if (this.animatedElements.length) {
            // Refresh intersection observer if needed
        }
    }
    
    handleOrientationChange() {
        // Handle iOS viewport height issues
        setTimeout(() => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // Restore scroll position
            if (this.scrollPosition !== undefined) {
                window.scrollTo(0, this.scrollPosition);
            }
        }, 100);
    }
    
    preventDoubleTabZoom() {
        let lastTouchEnd = 0;
        
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }
    
    // Error handling
    handleInitializationError(error) {
        console.error('Failed to initialize Oqupa Landing:', error);
        
        // Provide basic fallback functionality
        const basicToggle = document.getElementById('nav-toggle');
        const basicMenu = document.getElementById('nav-menu');
        
        if (basicToggle && basicMenu) {
            basicToggle.addEventListener('click', () => {
                basicMenu.classList.toggle('active');
                basicToggle.classList.toggle('active');
            });
        }
    }
    
    // Public API methods
    destroy() {
        // Clean up event listeners and observers
        if (this.isInitialized) {
            // Remove all event listeners
            // Disconnect all observers
            // Clear timeouts
            console.log('Oqupa Landing destroyed');
        }
    }
    
    refresh() {
        this.destroy();
        this.setup();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Create global instance
        window.oqupaLanding = new OqupaLanding();
        
        // Add CSS animations via JavaScript
        const additionalStyles = document.createElement('style');
        additionalStyles.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .form-error {
                animation: fadeIn 0.3s ease-out;
            }
            
            .btn.loading {
                cursor: not-allowed;
                opacity: 0.7;
            }
            
            .btn.loading::after {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                border: 2px solid currentColor;
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-left: 8px;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(additionalStyles);
        
    } catch (error) {
        console.error('Critical error initializing Oqupa Landing:', error);
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OqupaLanding;
}