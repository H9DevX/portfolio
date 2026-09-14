/**
 * Hamza Portfolio — Clean, Accessible & Interactive Script
 * Features:
 * - Dynamic Typewriter effect with authentic phrases
 * - IntersectionObserver scroll reveal animations
 * - Sticky header styling & active section navigation spy
 * - Mobile drawer navigation with backdrop & Escape key handling
 * - Project category filter tabs
 * - Copy to clipboard with sleek toast notifications
 * - Form validation with feedback states
 * - Back to top button
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. Dynamic Typewriter Effect
    // --------------------------------------------------------------------------
    const typingElement = document.getElementById('typing-text');
    const roles = [
        'modern web applications',
        'responsive frontend interfaces',
        'clean, maintainable software',
        'reliable digital experiences'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeWriter() {
        if (!typingElement) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 85;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of sentence
            typingSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 350;
        }

        setTimeout(typeWriter, typingSpeed);
    }

    typeWriter();


    // --------------------------------------------------------------------------
    // 2. IntersectionObserver for Scroll Animations
    // --------------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));


    // --------------------------------------------------------------------------
    // 3. Header Scroll Effect & Navigation Link Spy
    // --------------------------------------------------------------------------
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const backToTopBtn = document.getElementById('back-to-top');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Sticky Header styling
        if (header) {
            if (scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top button visibility
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Active Navigation Link Spy
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check once on initial load


    // --------------------------------------------------------------------------
    // 4. Mobile Drawer Navigation
    // --------------------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');

    function openMobileMenu() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.add('open');
        drawerBackdrop.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('open');
        drawerBackdrop.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileMenu);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    const mobileCtaBtn = document.querySelector('.mobile-cta-btn');
    if (mobileCtaBtn) mobileCtaBtn.addEventListener('click', closeMobileMenu);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
            closeMobileMenu();
        }
    });


    // --------------------------------------------------------------------------
    // 5. Back to Top Smooth Scroll
    // --------------------------------------------------------------------------
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // --------------------------------------------------------------------------
    // 6. Dynamic Projects Renderer & Filter Handling
    // --------------------------------------------------------------------------
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Sanitizes external & internal URLs to strictly prevent XSS vectors
     * (e.g., javascript:, data:text/html, vbscript: schemes)
     */
    function sanitizeUrl(url) {
        if (!url || typeof url !== 'string') return '';
        const trimmed = url.trim();

        // Safe relative navigation paths (hash, root, relative paths)
        if (/^(\/|\.\/|\.\.\/|#)/.test(trimmed)) {
            return encodeURI(trimmed);
        }

        try {
            const parsed = new URL(trimmed, window.location.origin);
            // Strictly allow only safe standard protocols
            if (parsed.protocol === 'https:' || parsed.protocol === 'http:' || parsed.protocol === 'mailto:') {
                return trimmed;
            }
            return '';
        } catch (e) {
            // Check relative path without leading slash (e.g. assets/images/...)
            if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
                return encodeURI(trimmed);
            }
            return '';
        }
    }

    function renderProjectsSection() {
        const container = document.getElementById('projects-container');
        const filtersContainer = document.getElementById('project-filters');
        if (!container) return;

        const projects = (typeof PROJECTS_DATA !== 'undefined' && Array.isArray(PROJECTS_DATA)) 
            ? PROJECTS_DATA 
            : [];

        // When PROJECTS_DATA is empty: Render a tasteful, high-end empty state
        if (projects.length === 0) {
            if (filtersContainer) {
                filtersContainer.style.display = 'none';
            }
            container.innerHTML = `
                <div class="projects-empty-state card-elevated">
                    <div class="empty-state-icon">
                        <i class="fa-solid fa-code-commit"></i>
                    </div>
                    <span class="empty-state-badge">
                        <span class="pulse-dot"></span> In Active Development
                    </span>
                    <h3 class="empty-state-title">Projects Coming Soon</h3>
                    <p class="empty-state-desc">
                        I am currently developing and polishing projects that will be showcased here. 
                        In the meantime, you can explore my active codebases, experiments, and contributions directly on GitHub.
                    </p>
                    <div class="empty-state-actions">
                        <a href="https://github.com/H9DevX" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                            <i class="fa-brands fa-github"></i>
                            <span>Explore GitHub @H9DevX</span>
                        </a>
                        <a href="#contact" class="btn btn-outline">
                            <i class="fa-solid fa-paper-plane"></i>
                            <span>Get in Touch</span>
                        </a>
                    </div>
                </div>
            `;
            return;
        }

        // When projects exist: Dynamically generate unique category filter buttons
        const rawCategories = projects.map(p => (p.category || 'project').trim().toLowerCase());
        const uniqueCategories = ['all', ...Array.from(new Set(rawCategories))];

        if (filtersContainer) {
            filtersContainer.style.display = 'flex';
            filtersContainer.innerHTML = uniqueCategories.map((cat, idx) => {
                const label = cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1);
                const activeClass = idx === 0 ? 'active' : '';
                const selected = idx === 0 ? 'true' : 'false';
                return `<button class="filter-btn ${activeClass}" data-filter="${escapeHtml(cat)}" role="tab" aria-selected="${selected}">${escapeHtml(label)}</button>`;
            }).join('');
        }

        // Render project cards
        container.innerHTML = `
            <div class="projects-grid" id="projects-grid">
                ${projects.map(project => {
                    const category = escapeHtml((project.category || 'project').toLowerCase());
                    const title = escapeHtml(project.title || 'Untitled Project');
                    const description = escapeHtml(project.description || '');
                    const year = escapeHtml(project.year || '');
                    const tags = Array.isArray(project.technologies) ? project.technologies : [];

                    const safeImageUrl = sanitizeUrl(project.image);
                    const safeGithubUrl = sanitizeUrl(project.githubUrl);
                    const safeLiveUrl = sanitizeUrl(project.liveUrl);

                    const mediaHtml = safeImageUrl ? `
                        <div class="project-card-media">
                            <img src="${escapeHtml(safeImageUrl)}" alt="${title}" loading="lazy">
                        </div>
                    ` : '';

                    const githubLinkHtml = safeGithubUrl ? `
                        <a href="${escapeHtml(safeGithubUrl)}" target="_blank" rel="noopener noreferrer" class="project-action" aria-label="Source code for ${title}">
                            <i class="fa-brands fa-github"></i>
                            <span>Code Repository</span>
                        </a>
                    ` : '';

                    const liveLinkHtml = safeLiveUrl ? `
                        <a href="${escapeHtml(safeLiveUrl)}" target="_blank" rel="noopener noreferrer" class="project-action-link" aria-label="Live demo for ${title}">
                            <span>Live Demo</span>
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    ` : '';

                    return `
                        <div class="project-card card-elevated" data-category="${category}">
                            ${mediaHtml}
                            <div class="project-header">
                                <div class="project-tag">${escapeHtml(project.category || 'Project')}</div>
                                ${year ? `<span class="project-date">${year}</span>` : ''}
                            </div>
                            <h3 class="project-title">${title}</h3>
                            <p class="project-summary">${description}</p>
                            ${tags.length > 0 ? `
                                <div class="project-tech-tags">
                                    ${tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}
                                </div>
                            ` : ''}
                            ${(githubLinkHtml || liveLinkHtml) ? `
                                <div class="project-footer">
                                    ${githubLinkHtml}
                                    ${liveLinkHtml}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        initProjectFilters();
    }

    function initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');

                const selectedFilter = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.97)';

                    setTimeout(() => {
                        if (selectedFilter === 'all' || category === selectedFilter) {
                            card.classList.remove('hide');
                            card.style.display = 'flex';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0) scale(1)';
                            }, 30);
                        } else {
                            card.classList.add('hide');
                            card.style.display = 'none';
                        }
                    }, 140);
                });
            });
        });
    }

    renderProjectsSection();


    // --------------------------------------------------------------------------
    // 7. Toast Notification & Copy Email Helper
    // --------------------------------------------------------------------------
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    function showToast(message, isSuccess = true) {
        if (!toast || !toastMessage) return;

        clearTimeout(toastTimeout);

        toastMessage.textContent = message;
        const icon = toast.querySelector('i');
        if (icon) {
            icon.className = isSuccess 
                ? 'fa-solid fa-circle-check' 
                : 'fa-solid fa-circle-exclamation';
            icon.style.color = isSuccess ? 'var(--accent-emerald)' : 'var(--accent-rose)';
        }

        toast.style.borderColor = isSuccess ? 'var(--accent-emerald)' : 'var(--accent-rose)';
        toast.classList.add('show');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    const copyEmailButtons = document.querySelectorAll('.copy-email-btn');
    copyEmailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = btn.getAttribute('data-email') || 'hamzashah0411@gmail.com';

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email)
                    .then(() => {
                        showToast(`Copied ${email} to clipboard!`);
                    })
                    .catch(() => {
                        fallbackCopy(email);
                    });
            } else {
                fallbackCopy(email);
            }
        });
    });

    function fallbackCopy(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            showToast(`Copied ${text} to clipboard!`);
        } catch (err) {
            showToast('Email address: ' + text);
        }
        document.body.removeChild(tempInput);
    }

    // --------------------------------------------------------------------------
    // 8. Contact Form — Real Submission via Formspree
    // --------------------------------------------------------------------------
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvkojkvj';

    const contactForm = document.getElementById('contact-form');
    const submitBtn   = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear existing errors
            clearFormErrors();

            const nameInput    = document.getElementById('name');
            const emailInput   = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            let isValid = true;

            // Name check
            if (!nameInput.value.trim()) {
                setFieldError('name-error', 'Please enter your name.');
                isValid = false;
            }

            // Email check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                setFieldError('email-error', 'Please enter your email address.');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                setFieldError('email-error', 'Please enter a valid email address.');
                isValid = false;
            }

            // Subject check
            if (!subjectInput.value.trim()) {
                setFieldError('subject-error', 'Please enter a subject.');
                isValid = false;
            }

            // Message check
            if (!messageInput.value.trim()) {
                setFieldError('message-error', 'Please enter your message.');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                setFieldError('message-error', 'Message should be at least 10 characters.');
                isValid = false;
            }

            if (!isValid) return;

            // --- Show sending state ---
            const originalContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>Sending message...</span>
            `;

            try {
                const formData = {
                    name:    nameInput.value.trim(),
                    email:   emailInput.value.trim(),
                    subject: subjectInput.value.trim(),
                    message: messageInput.value.trim()
                };

                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method:  'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body:    JSON.stringify(formData)
                });

                if (response.ok) {
                    // Success — reset form and notify user
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    showToast('Message sent! I\'ll get back to you within 24 hours.', true);
                } else {
                    // Formspree returned an error (e.g. form not yet activated)
                    const data = await response.json().catch(() => ({}));
                    const errorMsg = (data && data.error) ? data.error : 'Submission failed. Please try again.';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    showToast(errorMsg, false);
                }
            } catch (networkError) {
                // Network / connectivity failure
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                showToast('Network error. Please check your connection and try again.', false);
            }
        });

        // Real-time error clearance on field typing
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                const errorSpan = document.getElementById(`${field.id}-error`);
                if (errorSpan) errorSpan.textContent = '';
            });
        });
    }

    function setFieldError(elementId, errorMessage) {
        const errorEl = document.getElementById(elementId);
        if (errorEl) {
            errorEl.textContent = errorMessage;
        }
    }

    function clearFormErrors() {
        document.querySelectorAll('.field-error').forEach(el => {
            el.textContent = '';
        });
    }
});
