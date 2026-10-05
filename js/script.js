// ==========================================
// YÉBOUÉ TECH - JAVASCRIPT GAMING ULTRA-MODERNE
// Scripts avancés avec effets gaming
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== INITIALISATION =====
    console.log('%c🎮 YÉBOUÉ TECH - SYSTEM INITIALIZED', 'color: #FF6B35; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #FF6B35;');
    console.log('%c⚡ Gaming Mode Activated', 'color: #00D9FF; font-size: 14px;');
    
    // ===== LANCER TOUTES LES FONCTIONS =====
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initTestimonialSlider();
    initCounters();
    initAccordions();
    initContactForm();
    initSmoothScroll();
    highlightActivePage();
    initParticles();
    initCursorEffect();
    initTypingEffect();
    initHeroVideos();
    initLazyLoading();
    initScrollProgress();
    initBackToTop();
    initTabs();
    initGlitchEffect();
    
    console.log('%c✅ All Systems Online', 'color: #28A745; font-size: 14px;');
});

// ===== MENU MOBILE GAMING =====
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    if (!menuBtn) return;
    
    // Créer le menu mobile s'il n'existe pas
    if (!mobileMenu) {
        createMobileMenu();
    }
    
    menuBtn.addEventListener('click', function() {
        openMobileMenu();
    });
    
    function openMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-overlay');
        
        menu.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Animation du bouton
        menuBtn.style.transform = 'rotate(90deg)';
    }
    
    function closeMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-overlay');
        
        menu.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        
        // Reset du bouton
        menuBtn.style.transform = 'rotate(0deg)';
    }
    
    const closeButton = document.querySelector('.mobile-menu-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeMobileMenu);
    }
    
    const overlay = document.querySelector('.mobile-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }
    
    // Fermer au clic sur un lien
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function createMobileMenu() {
    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
    
    // Créer le menu mobile
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Header du menu
    const menuHeader = document.createElement('div');
    menuHeader.className = 'mobile-menu-header';
    
    const logo = document.createElement('div');
    logo.className = 'logo';
    logo.innerHTML = '<img src="images/logo.jpg" alt="Yéboué Tech" style="height: 40px;">';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.innerHTML = '×';
    
    menuHeader.appendChild(logo);
    menuHeader.appendChild(closeBtn);
    
    // Navigation
    const nav = document.querySelector('nav ul');
    if (nav) {
        const mobileNav = nav.cloneNode(true);
        mobileMenu.appendChild(menuHeader);
        mobileMenu.appendChild(mobileNav);
        document.body.appendChild(mobileMenu);
    }
}

// ===== HEADER SCROLL EFFECT GAMING =====
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Auto-hide header on scroll down (optionnel)
        // if (currentScroll > lastScroll && currentScroll > 200) {
        //     header.style.transform = 'translateY(-100%)';
        // } else {
        //     header.style.transform = 'translateY(0)';
        // }
        
        lastScroll = currentScroll;
    }
}

// ===== ANIMATIONS AU SCROLL (INTERSECTION OBSERVER) =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Délai en cascade pour effet gaming
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments avec animations
    const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .zoom-in');
    animatedElements.forEach(el => observer.observe(el));
    
    // Observer les cartes
    const cards = document.querySelectorAll('.card:not(.testimonial-card)');
    cards.forEach((card, index) => {
        card.classList.add('fade-in');
        setTimeout(() => {
            observer.observe(card);
        }, index * 50);
    });
    
    // Observer les statistiques
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach(stat => observer.observe(stat));
}

// ===== SLIDER TÉMOIGNAGES GAMING =====
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    const cards = slider.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (cards.length === 0) return;
    
    let currentSlide = 0;
    let autoplayInterval;
    
    // Créer les dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
    }
    
    function goToSlide(index) {
        // Retirer l'active de tous
        cards.forEach(card => card.classList.remove('active'));
        
        // Ajouter l'active au slide actuel
        cards[index].classList.add('active');
        
        // Mettre à jour les dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % cards.length;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + cards.length) % cards.length;
        goToSlide(currentSlide);
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Contrôles clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });
    
    // Touch swipe pour mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
            resetAutoplay();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
            resetAutoplay();
        }
    }
    
    // Afficher le premier slide et démarrer l'autoplay
    goToSlide(0);
    startAutoplay();
    
    // Pause autoplay au hover
    slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    slider.addEventListener('mouseleave', startAutoplay);
}

// ===== COMPTEURS ANIMÉS GAMING =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (!target) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    animateCounter(counter, target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60; // 60 frames pour animation fluide
    const duration = 2000;
    const stepTime = duration / 60;
    
    const hasPercent = element.textContent.includes('%');
    const hasPlus = element.textContent.includes('+');
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = formatNumber(target) + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');
            clearInterval(timer);
            
            // Effet de pulsation à la fin
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        } else {
            element.textContent = formatNumber(Math.floor(current)) + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');
        }
    }, stepTime);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// ===== ACCORDÉONS GAMING =====
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            
            // Fermer tous les autres accordéons (optionnel)
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle l'accordéon actuel avec animation
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
                
                // Scroll vers l'accordéon ouvert
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });
    });
}

// ===== FORMULAIRE DE CONTACT GAMING =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validation
        let isValid = true;
        const errors = [];
        
        // Valider les champs requis
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'Ce champ est requis');
            } else {
                clearFieldError(field);
            }
        });
        
        // Valider l'email
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                showFieldError(emailField, 'Email invalide');
            }
        }
        
        // Valider le téléphone
        const phoneField = form.querySelector('input[type="tel"]');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[+]?[\d\s-]{8,}$/;
            if (!phoneRegex.test(phoneField.value)) {
                isValid = false;
                showFieldError(phoneField, 'Numéro de téléphone invalide');
            }
        }
        
        if (isValid) {
            // Afficher un loader gaming
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loader-neon"></span> Envoi en cours...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Simuler l'envoi (à remplacer par un vrai appel API)
            setTimeout(() => {
                showSuccessMessage('✅ Message envoyé avec succès ! Nous vous répondrons sous 24h.');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                
                // Confetti effect (optionnel)
                createConfetti();
            }, 2000);
        } else {
            // Shake animation sur le formulaire
            form.style.animation = 'shake 0.5s';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        }
    });
    
    // Validation en temps réel
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showFieldError(this, 'Ce champ est requis');
            } else {
                clearFieldError(this);
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                clearFieldError(this);
            }
        });
        
        // Effet gaming sur focus
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#DC3545';
    field.style.boxShadow = '0 0 20px rgba(220, 53, 69, 0.5)';
    
    const error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = message;
    field.parentElement.appendChild(error);
    
    // Animation d'entrée
    error.style.animation = 'slideInLeft 0.3s ease';
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const existingError = field.parentElement.querySelector('.form-error');
    if (existingError) {
        existingError.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => existingError.remove(), 300);
    }
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.textContent = message;
    successDiv.style.animation = 'slideInLeft 0.5s ease';
    
    const form = document.getElementById('contact-form');
    form.parentElement.insertBefore(successDiv, form);
    
    // Scroll vers le message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        successDiv.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => successDiv.remove(), 500);
    }, 5000);
}

// ===== SMOOTH SCROLL GAMING =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Effet de flash sur la cible
                target.style.animation = 'pulse 0.6s ease';
                setTimeout(() => {
                    target.style.animation = '';
                }, 600);
            }
        });
    });
}

// ===== HIGHLIGHT PAGE ACTIVE =====
function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a, .mobile-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === '#accueil')) {
            link.classList.add('active');
        }
    });
}

// ===== PARTICULES GAMING (Background animé) =====
function initParticles() {
    // Animation de particules légère dans le hero
    const heroes = document.querySelectorAll('.hero');
    heroes.forEach(hero => {
        createParticles(hero, 30);
    });
}

function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: ${Math.random() > 0.5 ? '#FF6B35' : '#00D9FF'};
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            z-index: 1;
            box-shadow: 0 0 10px currentColor;
        `;
        container.appendChild(particle);
    }
}

// ===== CURSEUR PERSONNALISÉ GAMING (Optionnel) =====
function initCursorEffect() {
    // Créer le curseur personnalisé
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #FF6B35;
        border-radius: 50%;
        pointer-events: none;
        z-index: 99999;
        transition: all 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    cursorTrail.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: #FF6B35;
        border-radius: 50%;
        pointer-events: none;
        z-index: 99998;
        transition: all 0.15s ease;
        display: none;
    `;
    document.body.appendChild(cursorTrail);
    
    // Uniquement sur desktop
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        cursorTrail.style.display = 'block';
        
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorTrail.style.left = e.clientX + 6 + 'px';
                cursorTrail.style.top = e.clientY + 6 + 'px';
            }, 50);
        });
        
        // Agrandir sur hover des liens et boutons
        document.querySelectorAll('a, button, .card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = '#00D9FF';
                cursorTrail.style.background = '#00D9FF';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '#FF6B35';
                cursorTrail.style.background = '#FF6B35';
            });
        });
    }
}

// ===== EFFET TYPING GAMING (pour les titres) =====
function initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.getAttribute('data-typing');
        element.textContent = '';
        element.style.borderRight = '3px solid #FF6B35';
        
        let index = 0;
        const speed = 50;
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                element.style.borderRight = 'none';
            }
        }
        
        // Démarrer quand l'élément est visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    });
}

// ===== GESTION DES VIDÉOS HERO =====
function initHeroVideos() {
    const videos = document.querySelectorAll('.hero-video');
    
    videos.forEach(video => {
        // Pause la vidéo quand elle n'est pas visible
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Video autoplay prevented'));
                } else {
                    video.pause();
                }
            });
        }, {
            threshold: 0.5
        });
        
        videoObserver.observe(video);
        
        // Ajouter un overlay de lecture pour mobile
        if ('ontouchstart' in window) {
            video.setAttribute('playsinline', '');
        }
    });
}

// ===== LAZY LOADING IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                
                // Effet de fade in
                img.style.opacity = '0';
                img.onload = function() {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                };
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    // Créer la barre de progression
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, #FF6B35, #00D9FF);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease;
        box-shadow: 0 0 20px rgba(255, 107, 53, 0.8);
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 110px;
        right: 32px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #FF6B35, #00D9FF);
        color: white;
        border: 2px solid #FF6B35;
        border-radius: 50%;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 997;
        box-shadow: 0 4px 20px rgba(255, 107, 53, 0.5);
    `;
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Animation du bouton
        this.style.transform = 'scale(0.9) rotate(360deg)';
        setTimeout(() => {
            this.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    });
    
    backToTop.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    backToTop.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// ===== TABS GAMING =====
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-tab');
            
            // Retirer l'active de tous les boutons et contenus
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Activer le bouton et le contenu ciblés
            this.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// ===== EFFET GLITCH SUR LES TITRES =====
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('h1, h2');
    
    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s ease';
        });
        
        element.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
}

// ===== CONFETTI EFFECT (pour succès formulaire) =====
function createConfetti() {
    const colors = ['#FF6B35', '#00D9FF', '#FFD700', '#8B5CF6'];
const confettiCount = 50;
for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: 50%;
        left: 50%;
        opacity: 1;
        z-index: 99999;
        pointer-events: none;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    `;
    document.body.appendChild(confetti);
    
    // Animation aléatoire
    const angle = Math.random() * 360;
    const velocity = Math.random() * 300 + 200;
    const xVelocity = Math.cos(angle) * velocity;
    const yVelocity = Math.sin(angle) * velocity;
    
    confetti.animate([
        {
            transform: 'translate(0, 0) rotate(0deg)',
            opacity: 1
        },
        {
            transform: `translate(${xVelocity}px, ${yVelocity}px) rotate(${Math.random() * 720}deg)`,
            opacity: 0
        }
    ], {
        duration: Math.random() * 1000 + 1000,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        fill: 'forwards'
    }).onfinish = () => confetti.remove();
}
}
// ===== PARALLAX EFFECT =====
function initParallax() {
const parallaxElements = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', function() {
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax') || 0.5;
        const yPos = -(window.scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});
}
// ===== MAGNETIC BUTTONS (Effet gaming avancé) =====
function initMagneticButtons() {
const buttons = document.querySelectorAll('.btn, .card');
buttons.forEach(button => {
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});
}
// ===== TILT EFFECT SUR LES CARTES =====
function initTiltEffect() {
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});
}
// ===== RIPPLE EFFECT SUR LES BOUTONS =====
function initRippleEffect() {
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});
}
// Ajouter l'animation CSS pour ripple
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
@keyframes ripple {
to {
transform: scale(4);
opacity: 0;
}
}
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}
`;
document.head.appendChild(rippleStyle);
// ===== NOMBRE ALÉATOIRE ANIMÉ (pour effet hacker) =====
function animateRandomNumber(element, finalValue, duration = 1000) {
const startTime = Date.now();
const start = 0;
function update() {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    
    if (progress < 1) {
        element.textContent = Math.floor(Math.random() * finalValue);
        requestAnimationFrame(update);
    } else {
        element.textContent = finalValue;
    }
}

update();
}
// ===== DÉTECTION DE SCROLL DIRECTION =====
let lastScrollTop = 0;
let scrollDirection = 'down';
window.addEventListener('scroll', function() {
const st = window.pageYOffset || document.documentElement.scrollTop;
if (st > lastScrollTop) {
    scrollDirection = 'down';
} else {
    scrollDirection = 'up';
}

lastScrollTop = st <= 0 ? 0 : st;

// Ajouter une classe au body selon la direction
document.body.setAttribute('data-scroll-direction', scrollDirection);
}, false);
// ===== ANIMATION DE CHARGEMENT DE PAGE =====
window.addEventListener('load', function() {
// Masquer le loader si présent
const loader = document.querySelector('.page-loader');
if (loader) {
loader.style.opacity = '0';
setTimeout(() => loader.remove(), 500);
}
// Animation d'entrée des éléments
document.body.style.opacity = '0';
setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
}, 100);
});
// ===== DÉTECTER SI L'UTILISATEUR EST INACTIF =====
let inactivityTimer;
const inactivityDelay = 60000; // 1 minute
function resetInactivityTimer() {
clearTimeout(inactivityTimer);
inactivityTimer = setTimeout(() => {
console.log('%c💤 User inactive', 'color: #FFD700; font-size: 12px;');
// Vous pouvez ajouter des actions ici (pause animations, etc.)
}, inactivityDelay);
}
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
document.addEventListener(event, resetInactivityTimer, true);
});
resetInactivityTimer();
// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
window.addEventListener('load', function() {
const perfData = window.performance.timing;
const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
console.log('%c⚡ Page loaded in ' + pageLoadTime + 'ms', 'color: #00D9FF; font-size: 12px;');
});
}
// ===== GESTION DU RESIZE =====
let resizeTimer;
window.addEventListener('resize', debounce(function() {
console.log('%c📱 Window resized', 'color: #8B5CF6; font-size: 12px;');
// Recalculer certaines positions si nécessaire
const isMobile = window.innerWidth <= 768;
document.body.setAttribute('data-device', isMobile ? 'mobile' : 'desktop');
}, 250));
// ===== FONCTION DEBOUNCE =====
function debounce(func, wait) {
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
// ===== FONCTION THROTTLE =====
function throttle(func, limit) {
let inThrottle;
return function(...args) {
if (!inThrottle) {
func.apply(this, args);
inThrottle = true;
setTimeout(() => inThrottle = false, limit);
}
};
}
// ===== DÉTECTER SI UN ÉLÉMENT EST VISIBLE =====
function isElementInViewport(el) {
const rect = el.getBoundingClientRect();
return (
rect.top >= 0 &&
rect.left >= 0 &&
rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
rect.right <= (window.innerWidth || document.documentElement.clientWidth)
);
}
// ===== COPIER DU TEXTE DANS LE PRESSE-PAPIER =====
function copyToClipboard(text) {
if (navigator.clipboard) {
navigator.clipboard.writeText(text).then(() => {
showToast('✅ Copié dans le presse-papier !');
}).catch(err => {
console.error('Erreur de copie:', err);
});
} else {
// Fallback pour navigateurs plus anciens
const textArea = document.createElement('textarea');
textArea.value = text;
textArea.style.position = 'fixed';
textArea.style.left = '-999999px';
document.body.appendChild(textArea);
textArea.select();
try {
document.execCommand('copy');
showToast('✅ Copié dans le presse-papier !');
} catch (err) {
console.error('Erreur de copie:', err);
}
document.body.removeChild(textArea);
}
}
// ===== TOAST NOTIFICATION (Corrigé) =====
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.textContent = message;

    // ICI : J'ai entouré tout le bloc CSS avec des backticks (`)
    // pour le transformer en une seule chaîne de caractères (string).
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, #FF6B35, #00D9FF);
        color: white;
        padding: 16px 32px;
        border-radius: 50px;
        font-weight: 600;
        font-family: var(--font-gaming);
        box-shadow: 0 8px 32px rgba(255, 107, 53, 0.5);
        z-index: 99999;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border: 2px solid rgba(255, 255, 255, 0.3);
    `; // Fin de la chaîne de caractères

    document.body.appendChild(toast);
    
    // ... (le reste de ta fonction)
}
// Animation d'entrée
setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
}, 10);

// Animation de sortie
setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
}, duration);

// ===== EASTER EGG (Konami Code) =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
document.addEventListener('keydown', function(e) {
konamiCode.push(e.key);
konamiCode = konamiCode.slice(-10);
if (konamiCode.join(',') === konamiSequence.join(',')) {
    activateEasterEgg();
    konamiCode = [];
}
});
function activateEasterEgg() {
console.log('%c🎮 EASTER EGG ACTIVATED!', 'color: #FFD700; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #FFD700;');
// Effet spécial
document.body.style.animation = 'rainbow 2s linear infinite';

showToast('🎮 KONAMI CODE ACTIVÉ ! Mode Gaming Extrême !', 5000);

// Ajouter l'animation rainbow
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Retirer l'effet après 10 secondes
setTimeout(() => {
    document.body.style.animation = '';
    rainbowStyle.remove();
}, 10000);

// Confetti extrême
for (let i = 0; i < 5; i++) {
    setTimeout(() => createConfetti(), i * 200);
}
}
// ===== DÉTECTION DU MODE SOMBRE DU SYSTÈME =====
if (window.matchMedia) {
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeQuery.addEventListener('change', (e) => {
    console.log('Dark mode:', e.matches ? 'enabled' : 'disabled');
    // Le site est déjà en mode sombre par défaut
});
}
// ===== PRÉVENIR LE CLIC DROIT (Optionnel - désactivé par défaut) =====
// document.addEventListener('contextmenu', function(e) {
//     e.preventDefault();
//     showToast('⚠️ Clic droit désactivé', 2000);
// });
// ===== DÉTECTER LA CONNEXION INTERNET =====
window.addEventListener('online', function() {
showToast('✅ Connexion Internet rétablie', 3000);
});
window.addEventListener('offline', function() {
showToast('⚠️ Pas de connexion Internet', 3000);
});
// ===== ANALYTICS (à personnaliser avec votre solution) =====
function trackEvent(category, action, label) {
console.log('📊 Event:', category, action, label);
// Intégrer Google Analytics ici
// if (typeof gtag !== 'undefined') {
//     gtag('event', action, {
//         'event_category': category,
//         'event_label': label
//     });
// }
}
// Tracker les clics sur les boutons CTA
document.querySelectorAll('.btn').forEach(btn => {
btn.addEventListener('click', function() {
const text = this.textContent.trim();
trackEvent('CTA', 'click', text);
});
});
// ===== INITIALISATION DES EFFETS AVANCÉS =====
// Activer ces effets sur desktop uniquement pour de meilleures performances
if (window.innerWidth > 768) {
initParallax();
initMagneticButtons();
initTiltEffect();
initRippleEffect();
}
// ===== GESTION DES ERREURS GLOBALES =====
window.addEventListener('error', function(e) {
console.error('⚠️ Erreur détectée:', e.error);
// Ne pas afficher de toast pour ne pas perturber l'utilisateur
});
// ===== MESSAGE DE BIENVENUE DANS LA CONSOLE (Corrigé) =====
setTimeout(() => {
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FF6B35;');
    console.log('%c     YÉBOUÉ TECH - DIGITAL SOLUTIONS     ', 'color: #00D9FF; font-size: 16px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FF6B35;');
    console.log('%c💼 Besoin de nos services ? Contactez-nous !', 'color: #FFD700; font-size: 12px;');
    console.log('%c📞 +225 05 94 89 93 72', 'color: #FFFFFF; font-size: 12px;');

    // ICI : J'ai ajouté un antislash \ juste avant l'apostrophe de "aujourd'hui"
    console.log('%c🌐 Digitalisez votre établissement dès aujourd\'hui', 'color: #8B5CF6; font-size: 12px;');
    
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #FF6B35;');
}, 1000);
// ===== FONCTION POUR FORCER LE RECHARGEMENT DES ANIMATIONS =====
function refreshAnimations() {
document.querySelectorAll('.fade-in, .slide-left, .slide-right, .zoom-in').forEach(el => {
el.classList.remove('visible');
    setTimeout(() => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            el.classList.add('visible');
        }
    }, 100);
});
}
// ===== EXPORT DES FONCTIONS UTILES (si besoin dans d'autres scripts) =====
window.YeboueGaming = {
showToast,
copyToClipboard,
createConfetti,
trackEvent,
refreshAnimations,
animateRandomNumber
};
// ===== INITIALISATION FINALE =====
console.log('%c✨ JavaScript Gaming Loaded Successfully', 'color: #28A745; font-size: 12px; font-weight: bold;');
// Marquer le device type
document.body.setAttribute('data-device', window.innerWidth <= 768 ? 'mobile' : 'desktop');
// Ajouter une classe quand tout est chargé
window.addEventListener('load', function() {
document.body.classList.add('loaded');
});

// ==========================================
// JAVASCRIPT POUR LES 4 NOUVELLES SECTIONS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initComparisonSlider();
    initExperienceScreen();
});

// ===== COMPARISON SLIDER (Avant/Après) =====
function initComparisonSlider() {
    const slides = document.querySelectorAll('.comparison-slide');
    const dots = document.querySelectorAll('.comparison-dots .dot');
    const prevBtn = document.querySelector('.comparison-prev');
    const nextBtn = document.querySelector('.comparison-next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto-play (optionnel)
    // setInterval(nextSlide, 5000);
}

// ===== EXPERIENCE SCREEN SWITCHER =====
function initExperienceScreen() {
    const controlBtns = document.querySelectorAll('.exp-control-btn');
    const screens = document.querySelectorAll('.experience-content');
    
    if (controlBtns.length === 0) return;
    
    controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetScreen = this.getAttribute('data-target');
            
            // Remove active from all buttons and screens
            controlBtns.forEach(b => b.classList.remove('active'));
            screens.forEach(s => s.classList.remove('active'));
            
            // Add active to clicked button and target screen
            this.classList.add('active');
            const targetElement = document.querySelector(`[data-screen="${targetScreen}"]`);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });
}

// ===== FIN JAVASCRIPT DES 4 SECTIONS =====
// ===== CORRECTIF SLIDER AVANT/APRÈS (TRANSFORMATION VISUELLE) =====
function initComparisonSlider() {
    const slides = document.querySelectorAll('.comparison-slide');
    const dots = document.querySelectorAll('.comparison-dots .dot');
    const prevBtn = document.querySelector('.comparison-prev');
    const nextBtn = document.querySelector('.comparison-next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Masquer tous les slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Afficher le slide actuel
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Afficher le premier slide
    showSlide(0);
}

// ===== NOUVEAU SWITCHER POUR HÔTELLERIE =====
function initHotelExperienceScreen() {
    const controlBtns = document.querySelectorAll('.exp-control-btn-hotel');
    const screens = document.querySelectorAll('#hotelExperienceScreen .experience-content');
    
    if (controlBtns.length === 0) return;
    
    controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetScreen = this.getAttribute('data-target');
            
            // Remove active from all
            controlBtns.forEach(b => b.classList.remove('active'));
            screens.forEach(s => s.classList.remove('active'));
            
            // Add active
            this.classList.add('active');
            const targetElement = document.querySelector(`[data-screen="${targetScreen}"]`);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });
}

// ===== LANCER LES NOUVELLES FONCTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    initComparisonSlider(); // Correctif slider avant/après
    initHotelExperienceScreen(); // Nouveau switcher hôtel
});
// ===== FIN DU JAVASCRIPT GAMING =====