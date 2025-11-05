/**
 * Main JavaScript File
 * 
 * Handles navigation, mobile menu, and other interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        this.setAttribute('aria-expanded', this.classList.contains('active'));
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mainNav.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                // Update active nav link immediately on click
                const clickedNav = document.querySelector('.nav-link[href="' + targetId + '"]');
                if (clickedNav) {
                    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
                    clickedNav.classList.add('active');
                }
            }
        });
    });

    // Update active nav link while scrolling using IntersectionObserver
    (function() {
        const header = document.querySelector('.header');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        if (!('IntersectionObserver' in window) || !sections.length) return;

        let headerHeight = header ? header.offsetHeight : 0;

        const observerOptions = {
            root: null,
            rootMargin: `-${headerHeight}px 0px -40% 0px`,
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
                                if (activeLink) {
                                    navLinks.forEach(n => n.classList.remove('active'));
                                    activeLink.classList.add('active');
                                }
                }
            });
        }, observerOptions);

        sections.forEach(s => observer.observe(s));

        // Recalculate header height on resize (to adjust rootMargin)
        window.addEventListener('resize', () => {
            headerHeight = header ? header.offsetHeight : 0;
        });
    })();

    
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src') || img.src;
                    img.removeAttribute('loading');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            // Only observe if the image has a data-src attribute
            if (img.hasAttribute('data-src')) {
                imageObserver.observe(img);
            }
        });
    }
    
    // Add animation class when elements come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .project-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };
    
    // Run once on load and then on scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Animate section titles when they enter the viewport
    if ('IntersectionObserver' in window) {
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { root: null, threshold: 0.15 });

        document.querySelectorAll('.section-title').forEach(t => titleObserver.observe(t));

        // Fallback: ensure any section titles already in the viewport are revealed immediately.
        // Some browsers or timing conditions can delay the observer callback; this makes
        // visible headings appear without waiting for an intersection event.
        document.querySelectorAll('.section-title').forEach(t => {
            const rect = t.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                t.classList.add('animate');
            }
        });
    } else {
        // Fallback: add class on load
        document.querySelectorAll('.section-title').forEach(t => t.classList.add('animate'));
    }
    
    // Form validation for contact form (if exists on page)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation - in a real implementation, you would add more robust validation
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                nameInput.classList.add('error');
                isValid = false;
            } else {
                nameInput.classList.remove('error');
            }
            
            if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
                emailInput.classList.add('error');
                isValid = false;
            } else {
                emailInput.classList.remove('error');
            }
            
            if (!messageInput.value.trim()) {
                messageInput.classList.add('error');
                isValid = false;
            } else {
                messageInput.classList.remove('error');
            }
            
            if (isValid) {
                // In a real implementation, you would send the form data to a server
                alert('Thank you for your message! We will contact you soon.');
                this.reset();
            }
        });
    }
    
    // Automatic background image carousel
    const images = document.querySelectorAll('.carousel-bg');
    let current = 0;
    setInterval(() => {
        images[current].classList.remove('active');
        current = (current + 1) % images.length;
        images[current].classList.add('active');
    }, 4000); // Change image every 4 seconds

    /* --- Scroll progress bar & Back-to-top button --- */
    // Create progress bar and back-to-top elements
    const progressWrap = document.createElement('div');
    progressWrap.className = 'progress-wrap';
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressWrap.appendChild(progressBar);
    document.body.appendChild(progressWrap);

    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '↑';
    document.body.appendChild(backToTop);

    const updateProgress = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = percent + '%';

        if (scrollTop > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Contact Modal Logic
    const contactModal = document.getElementById('contactModal');
    const openModalBtn = document.getElementById('openContactModalBtn');
    const closeModalBtn = document.querySelector('.modal-close');

    if (contactModal && openModalBtn && closeModalBtn) {
        openModalBtn.onclick = function() {
            contactModal.style.display = "block";
        }
        closeModalBtn.onclick = function() {
            contactModal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == contactModal) {
                contactModal.style.display = "none";
            }
        }
    }
});