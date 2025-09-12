/**
 * UBIQA LANDING PAGE - SIMPLIFIED INTERACTIVE FUNCTIONALITY
 * Focus on animations and essential interactions only
 */

class UbiqaLanding {
    constructor() {
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
        this.cacheElements();
        this.bindEvents();
        this.initAnimations();
        this.initScrollEffects();
        console.log('🏠 Ubiqa Landing Page initialized');
    }
    
    cacheElements() {
        // Navigation
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        
        // Modal
        this.modal = document.getElementById('google-form-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalClose = document.getElementById('modal-close');
        
        // Form
        this.joinForm = document.getElementById('join-form');
        this.joinBtn = document.getElementById('join-btn');
        
        // Animated elements
        this.animatedElements = document.querySelectorAll('[data-animate]');
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => this.toggleMobileMenu(e));
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
        if (this.joinBtn) {
            this.joinBtn.addEventListener('click', (e) => this.handleFormSubmit(e));
        }
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeMobileMenu();
            }
        });
        
        // Click outside mobile menu
        document.addEventListener('click', (e) => {
            if (this.navMenu?.classList.contains('active')) {
                const isClickInsideMenu = this.navMenu.contains(e.target);
                const isClickOnToggle = this.navToggle?.contains(e.target);
                if (!isClickInsideMenu && !isClickOnToggle) {
                    this.closeMobileMenu();
                }
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navMenu?.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }
    
    initAnimations() {
        if (!this.animatedElements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });
        
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
    
    initScrollEffects() {
        if (!this.header) return;
        
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
        
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }
    
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
    
    openMobileMenu() {
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        if (!this.navMenu || !this.navToggle) return;
        
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
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
        
        // Smooth scroll
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('user-name')?.value?.trim();
        const email = document.getElementById('user-email')?.value?.trim();
        const intent = document.getElementById('user-intent')?.value;
        
        // Basic validation
        if (!name || !email || !intent) {
            this.showFormError('Por favor completa todos los campos');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showFormError('Por favor ingresa un correo válido');
            return;
        }
        
        // Show success state
        this.joinBtn.textContent = '¡Registrado exitosamente!';
        this.joinBtn.style.backgroundColor = 'var(--color-success)';
        
        // Open modal after delay
        setTimeout(() => {
            this.openModal();
        }, 1500);
        
        // Reset button after delay
        setTimeout(() => {
            this.joinBtn.textContent = 'Unirme a la Lista de Espera';
            this.joinBtn.style.backgroundColor = '';
        }, 3000);
    }
    
    showFormError(message) {
        // Remove existing errors
        document.querySelectorAll('.form-error').forEach(error => error.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-footnote);
            text-align: center;
            margin-top: 8px;
            animation: fadeIn 0.3s ease-out;
        `;
        
        this.joinForm.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    openModal() {
        if (!this.modal) {
            // Fallback: open Google Forms in new window
            window.open('https://forms.google.com/', '_blank', 'width=600,height=700');
            return;
        }
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Additional CSS for animations
const additionalStyles = `
    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .form-error {
            animation: fadeIn 0.3s ease-out;
        }
        
        /* Ensure smooth scrolling works */
        html {
            scroll-behavior: smooth;
        }
    </style>
`;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    // Add additional styles
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
    
    // Initialize the app
    new UbiqaLanding();
}

// Basic error handling
window.addEventListener('error', (e) => {
    console.error('Error in Ubiqa Landing:', e.error);
});