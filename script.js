(function () {
    "use strict";

    // ----- DOM Elements -----
    const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('.section');
    const skillBars = document.querySelectorAll('.skill-progress');
    const contactForm = document.getElementById('mainContactForm');
    const customOrderForm = document.getElementById('customOrderForm');
    const heroContent = document.querySelector('.hero-content');

    // ----- Theme Toggle -----
    function initTheme() {
        const icon = themeBtn.querySelector('i');
        const text = themeBtn.querySelector('.theme-text');
        const setUI = (isLight) => {
            body.classList.toggle('light-theme', isLight);
            body.classList.toggle('dark-theme', !isLight);
            icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
            text.textContent = isLight ? 'Light Mode' : 'Dark Mode';
        };
        const saved = localStorage.getItem('theme');
        setUI(saved === 'light');
        themeBtn.addEventListener('click', () => {
            const isLight = body.classList.contains('light-theme');
            setUI(!isLight);
            localStorage.setItem('theme', !isLight ? 'light' : 'dark');
        });
    }

    // ----- Mobile Menu -----
    function initMobileMenu() {
        const icon = menuToggle.querySelector('i');
        const closeMenu = () => {
            navLinks.classList.remove('active');
            icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        };
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) closeMenu();
        });
        window.addEventListener('resize', () => { if (window.innerWidth > 992) closeMenu(); });
    }

    // ----- Smooth Scroll -----
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const id = this.getAttribute('href');
                if (id === '#' || !id) return;
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                }
            });
        });
    }

    // ----- Scroll Animations -----
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.id === 'skills') animateSkillBars();
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        sections.forEach(s => observer.observe(s));
    }
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = '0%';
            setTimeout(() => bar.style.width = width + '%', 200);
        });
    }

    // ----- Navbar Scroll Effect -----
    function initNavbarScroll() {
        let last = 0;
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            const current = window.pageYOffset;
            const isLight = body.classList.contains('light-theme');
            navbar.style.background = current > 100
                ? (isLight ? 'rgba(255,255,255,0.98)' : 'rgba(10,10,15,0.98)')
                : (isLight ? 'rgba(255,255,255,0.95)' : 'rgba(10,10,15,0.95)');
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.transform = (current > last && current > 200) ? 'translateY(-100%)' : 'translateY(0)';
            last = current;
        });
    }

    // ----- Form Handling (Formspree) -----
    function handleFormSubmit(form, statusEl = null) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            if (statusEl) statusEl.textContent = '';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    submitBtn.textContent = '✓ Sent!';
                    submitBtn.style.background = 'linear-gradient(45deg, #00ff9d, #00b36b)';
                    form.reset();
                    if (statusEl) statusEl.textContent = '✓ Request sent successfully! I will reply soon.';
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Server error ${response.status}`);
                }
            } catch (error) {
                console.warn('Form error:', error);
                submitBtn.textContent = '✗ Failed';
                submitBtn.style.background = 'linear-gradient(45deg, #ff0000, #cc0000)';
                if (statusEl) statusEl.textContent = `✗ Error: ${error.message || 'Please try again.'}`;
            } finally {
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    if (statusEl) setTimeout(() => statusEl.textContent = '', 5000);
                }, 3000);
            }
        });
    }

    // ----- Work With Me: Service Buttons -----
    function initWorkWithMe() {
        const serviceBtns = document.querySelectorAll('.service-btn');
        const orderForm = document.getElementById('customOrderForm');
        const subjectField = document.getElementById('orderSubject');

        serviceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const service = btn.getAttribute('data-service');
                if (subjectField) subjectField.value = `Order: ${service}`;
                orderForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const projectNameInput = orderForm.querySelector('input[name="projectName"]');
                if (projectNameInput) projectNameInput.focus();
            });
        });

        const statusDiv = document.getElementById('orderFormStatus');
        handleFormSubmit(orderForm, statusDiv);
    }

    // ----- Hero Animation & Project Hover -----
    function initExtraEffects() {
        if (heroContent) heroContent.style.animation = 'fadeInUp 1s ease forwards';
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px)');
            card.addEventListener('mouseleave', () => card.style.transform = '');
        });
    }

    // ----- Initialize All -----
    function init() {
        initTheme();
        initMobileMenu();
        initSmoothScroll();
        initScrollAnimations();
        initNavbarScroll();
        initExtraEffects();
        if (contactForm) handleFormSubmit(contactForm);
        initWorkWithMe();
        if (document.querySelector('#skills.visible')) animateSkillBars();
    }

    document.addEventListener('DOMContentLoaded', init);
})();