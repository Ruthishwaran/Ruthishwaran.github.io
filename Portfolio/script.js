/* =============================================
   PARTICLE CANVAS BACKGROUND
   ============================================= */
(function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const NUM_PARTICLES = 80;
    const ACCENT = '0, 242, 255';
    const ACCENT2 = '123, 47, 247';

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.color = Math.random() > 0.5 ? ACCENT : ACCENT2;
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width ||
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        }
    }

    function connectParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${ACCENT}, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    for (let i = 0; i < NUM_PARTICLES; i++) {
        particlesArray.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
})();


/* =============================================
   TYPING ANIMATION WITH ERASE EFFECT
   ============================================= */
(function initTyping() {
    const phrases = [
        'Software Developer',
        'Python Programmer',
        'R Data Analyst',
        'Web Developer',
        'Problem Solver'
    ];
    const el = document.getElementById('typing');
    if (!el) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const TYPE_SPEED = 100;
    const DELETE_SPEED = 55;
    const PAUSE_AFTER = 1800;
    const PAUSE_BEFORE = 300;

    function type() {
        const current = phrases[phraseIndex];

        if (!isDeleting) {
            el.textContent = current.slice(0, ++charIndex);
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(type, PAUSE_AFTER);
                return;
            }
            setTimeout(type, TYPE_SPEED);
        } else {
            el.textContent = current.slice(0, --charIndex);
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, PAUSE_BEFORE);
                return;
            }
            setTimeout(type, DELETE_SPEED);
        }
    }
    setTimeout(type, 600);
})();


/* =============================================
   INTERSECTION OBSERVER — REVEAL ON SCROLL
   ============================================= */
(function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger delay for sibling elements in same parent
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${idx * 80}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
})();


/* =============================================
   INTERSECTION OBSERVER — SKILL BARS
   ============================================= */
(function initSkillBars() {
    const bars = document.querySelectorAll('.progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const width = target.getAttribute('data-width');
                target.style.width = width + '%';
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.4 });

    bars.forEach(bar => observer.observe(bar));
})();


/* =============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================= */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id], .hero[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(sec => observer.observe(sec));

    // Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
})();


/* =============================================
   HAMBURGER MENU
   ============================================= */
(function initHamburger() {
    const btn = document.getElementById('hamburger');
    const links = document.querySelector('.nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        links.classList.toggle('open');
        const isOpen = links.classList.contains('open');
        // Animate the hamburger spans
        const spans = btn.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close menu on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            btn.querySelectorAll('span').forEach(s => {
                s.style.transform = '';
                s.style.opacity = '';
            });
        });
    });
})();


/* =============================================
   SCROLL TO TOP BUTTON
   ============================================= */
(function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


/* =============================================
   CONTACT FORM — SUCCESS MESSAGE
   ============================================= */
(function initContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form || !success) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Button loading state
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        // Simulate send (replace with actual backend/EmailJS logic)
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            form.reset();
            success.classList.remove('hidden');
            setTimeout(() => success.classList.add('hidden'), 5000);
        }, 1500);
    });
})();


/* =============================================
   ANIMATED STATS COUNTER
   ============================================= */
(function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-num');
    if (!counters.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    const duration = 1800;
                    const step = Math.ceil(target / (duration / 16));
                    let current = 0;

                    const tick = () => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target;
                        } else {
                            counter.textContent = current;
                            requestAnimationFrame(tick);
                        }
                    };
                    requestAnimationFrame(tick);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) observer.observe(heroSection);
})();
