/* ========================================
   PORTFOLIO - Interactive JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // CURSOR GLOW EFFECT
    // ========================================
    const cursorGlow = document.getElementById('cursorGlow');
    
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });

    // ========================================
    // PARTICLE BACKGROUND
    // ========================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            const colors = [
                'rgba(124, 58, 237,',   // purple
                'rgba(236, 72, 153,',   // pink
                'rgba(6, 182, 212,',    // cyan
                'rgba(245, 158, 11,',   // amber
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x -= dx * 0.005;
                    this.y -= dy * 0.005;
                }
            }

            // Wrap
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.15;
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ========================================
    // NAVBAR
    // ========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ========================================
    // TYPEWRITER EFFECT
    // ========================================
    const typewriterEl = document.getElementById('typewriter');
    const phrases = [
        'Full Stack Developer',
        'UI/UX Designer',
        'Creative Problem Solver',
        'Open Source Contributor',
        'Tech Enthusiast'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typewrite() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            delay = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(typewrite, delay);
    }

    typewrite();

    // ========================================
    // COUNT UP ANIMATION
    // ========================================
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let counterStarted = false;

    function startCounters() {
        if (counterStarted) return;
        counterStarted = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function updateCount() {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                    return;
                }
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCount);
            }

            updateCount();
        });
    }

    // ========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));

                // Start counters when stats become visible
                if (entry.target.closest('.hero-stats') || entry.target.querySelector('.stat-number')) {
                    startCounters();
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Also trigger counter when hero stats scroll into view
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // ========================================
    // PROJECT FILTERS
    // ========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, i) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeInUp 0.5s ease ${i * 0.1}s both`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ========================================
    // TESTIMONIALS SLIDER
    // ========================================
    const track = document.getElementById('testimonialTrack');
    const cards = track ? track.children : [];
    const dotsContainer = document.getElementById('testDots');
    const prevBtn = document.getElementById('testPrev');
    const nextBtn = document.getElementById('testNext');
    let currentSlide = 0;

    // Create dots
    if (dotsContainer && cards.length) {
        for (let i = 0; i < cards.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('test-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        currentSlide = index;
        if (track) {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.test-dot') : [];
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prev = currentSlide === 0 ? cards.length - 1 : currentSlide - 1;
            goToSlide(prev);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const next = (currentSlide + 1) % cards.length;
            goToSlide(next);
        });
    }

    // Auto-slide
    let autoSlide = setInterval(() => {
        if (cards.length) {
            goToSlide((currentSlide + 1) % cards.length);
        }
    }, 5000);

    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
        slider.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                goToSlide((currentSlide + 1) % cards.length);
            }, 5000);
        });
    }

    // ========================================
    // CONTACT FORM
    // ========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate form submission
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                contactForm.reset();

                // Show toast
                showToast('Message sent successfully! I\'ll get back to you soon.');
            }, 1500);
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ========================================
    // BACK TO TOP
    // ========================================
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========================================
    // SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========================================
    // TILT EFFECT ON PROJECT CARDS
    // ========================================
    const tiltCards = document.querySelectorAll('.project-card, .service-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========================================
    // ANIMATE CSS KEYFRAME FOR FILTER
    // ========================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // PRELOADER (trigger animations after load)
    // ========================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger hero animations immediately
        const heroElements = document.querySelectorAll('.hero [data-animate]');
        heroElements.forEach(el => {
            const delay = el.getAttribute('data-delay') || 0;
            setTimeout(() => {
                el.classList.add('animated');
            }, parseInt(delay) + 200);
        });

        // Start counters if hero is visible
        startCounters();

        // Fetch GitHub data
        fetchGitHubDashboard('Mayuraglawe');
    });

    // ========================================
    // GITHUB DASHBOARD
    // ========================================
    const GITHUB_USERNAME = 'Mayuraglawe';
    const LANG_COLORS = {
        JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
        HTML: '#e34c26', CSS: '#563d7c', Java: '#b07219', 'C++': '#f34b7d',
        C: '#555555', 'C#': '#178600', Go: '#00ADD8', Rust: '#dea584',
        Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF',
        Dart: '#00B4AB', Shell: '#89e051', Vue: '#41b883', SCSS: '#c6538c',
        Jupyter: '#DA5B0B', Dockerfile: '#384d54', Makefile: '#427819',
    };

    async function fetchGitHubDashboard(username) {
        try {
            // Fetch profile & repos in parallel
            const [profileRes, reposRes, eventsRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`),
                fetch(`https://api.github.com/users/${username}/events/public?per_page=30`)
            ]);

            const profile = await profileRes.json();
            const repos = await reposRes.json();
            const events = await eventsRes.json();

            if (profile.message === 'Not Found') {
                console.error('GitHub user not found');
                return;
            }

            // Populate profile
            populateProfile(profile);

            // Populate stats
            populateStats(profile, repos);

            // Populate languages
            populateLanguages(repos);

            // Populate recent repos
            populateRepos(repos);

            // Populate activity feed
            populateActivity(events);

            // Last updated
            const now = new Date().toLocaleString();
            const lastUpdated = document.getElementById('ghLastUpdated');
            if (lastUpdated) {
                lastUpdated.innerHTML = `<i class="fas fa-check-circle" style="color: #10b981;"></i> Live data from GitHub &mdash; Updated ${now}`;
            }

        } catch (err) {
            console.error('GitHub API Error:', err);
            const lastUpdated = document.getElementById('ghLastUpdated');
            if (lastUpdated) {
                lastUpdated.innerHTML = `<i class="fas fa-exclamation-circle" style="color: #ef4444;"></i> Could not fetch GitHub data. Refresh to retry.`;
            }
        }
    }

    function populateProfile(profile) {
        const avatar = document.getElementById('ghAvatar');
        const name = document.getElementById('ghName');
        const username = document.getElementById('ghUsername');
        const bio = document.getElementById('ghBio');
        const location = document.getElementById('ghLocation');
        const joined = document.getElementById('ghJoined');

        if (avatar) avatar.src = profile.avatar_url || '';
        if (name) name.textContent = profile.name || profile.login;
        if (username) username.textContent = `@${profile.login}`;
        if (bio) bio.textContent = profile.bio || 'Developer & Creator';
        if (location) location.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${profile.location || 'Earth'}`;
        if (joined) {
            const date = new Date(profile.created_at);
            joined.innerHTML = `<i class="fas fa-calendar"></i> Joined ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
        }
    }

    function populateStats(profile, repos) {
        // Total stars & forks from all repos
        let totalStars = 0;
        let totalForks = 0;
        if (Array.isArray(repos)) {
            repos.forEach(repo => {
                totalStars += repo.stargazers_count || 0;
                totalForks += repo.forks_count || 0;
            });
        }

        animateNumber('ghRepos', profile.public_repos || 0);
        animateNumber('ghStars', totalStars);
        animateNumber('ghForks', totalForks);
        animateNumber('ghFollowers', profile.followers || 0);
        animateNumber('ghFollowing', profile.following || 0);
    }

    function animateNumber(elementId, target) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;

        function update() {
            current += step;
            if (current >= target) {
                el.textContent = target;
                return;
            }
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        }
        update();
    }

    function populateLanguages(repos) {
        if (!Array.isArray(repos)) return;

        const langCount = {};
        repos.forEach(repo => {
            if (repo.language) {
                langCount[repo.language] = (langCount[repo.language] || 0) + 1;
            }
        });

        const sorted = Object.entries(langCount).sort((a, b) => b[1] - a[1]);
        const total = sorted.reduce((sum, [, count]) => sum + count, 0);

        const langBar = document.getElementById('ghLangsBar');
        const langLegend = document.getElementById('ghLangsLegend');

        if (!langBar || !langLegend || sorted.length === 0) return;

        langBar.innerHTML = '';
        langLegend.innerHTML = '';

        sorted.forEach(([lang, count]) => {
            const pct = ((count / total) * 100).toFixed(1);
            const color = LANG_COLORS[lang] || '#8b5cf6';

            // Bar segment
            const segment = document.createElement('div');
            segment.className = 'gh-lang-segment';
            segment.style.width = `${pct}%`;
            segment.style.backgroundColor = color;
            segment.title = `${lang}: ${pct}%`;
            langBar.appendChild(segment);

            // Legend item
            const item = document.createElement('div');
            item.className = 'gh-lang-item';
            item.innerHTML = `
                <span class="gh-lang-dot" style="background:${color}"></span>
                <span>${lang}</span>
                <span class="gh-lang-pct">${pct}%</span>
            `;
            langLegend.appendChild(item);
        });
    }

    function populateRepos(repos) {
        if (!Array.isArray(repos)) return;

        const grid = document.getElementById('ghReposGrid');
        if (!grid) return;

        grid.innerHTML = '';

        // Show top 6 most recently updated
        const recent = repos.slice(0, 6);

        recent.forEach(repo => {
            const langColor = LANG_COLORS[repo.language] || '#8b5cf6';
            const updatedDate = timeAgo(new Date(repo.updated_at));

            const card = document.createElement('div');
            card.className = 'gh-repo-card';
            card.innerHTML = `
                <div class="gh-repo-header">
                    <i class="fas fa-book"></i>
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="gh-repo-name">${repo.name}</a>
                </div>
                <p class="gh-repo-desc">${repo.description || 'No description provided.'}</p>
                <div class="gh-repo-footer">
                    ${repo.language ? `<span><span class="gh-repo-lang-dot" style="background:${langColor}"></span>${repo.language}</span>` : ''}
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    <span class="gh-repo-updated">${updatedDate}</span>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function populateActivity(events) {
        if (!Array.isArray(events)) return;

        const feed = document.getElementById('ghActivityFeed');
        if (!feed) return;

        feed.innerHTML = '';

        // Show top 10 events
        const recent = events.slice(0, 10);

        if (recent.length === 0) {
            feed.innerHTML = '<div class="gh-activity-item"><div class="gh-activity-content"><span class="gh-activity-text">No recent public activity.</span></div></div>';
            return;
        }

        recent.forEach(event => {
            const { icon, color, text } = formatEvent(event);
            if (!text) return;

            const item = document.createElement('div');
            item.className = 'gh-activity-item';
            item.innerHTML = `
                <div class="gh-activity-icon" style="background:${color}">
                    <i class="${icon}"></i>
                </div>
                <div class="gh-activity-content">
                    <div class="gh-activity-text">${text}</div>
                    <div class="gh-activity-time">${timeAgo(new Date(event.created_at))}</div>
                </div>
            `;
            feed.appendChild(item);
        });
    }

    function formatEvent(event) {
        const repo = event.repo ? event.repo.name : '';
        const repoLink = `<a href="https://github.com/${repo}" target="_blank" rel="noopener">${repo.split('/')[1] || repo}</a>`;

        switch (event.type) {
            case 'PushEvent': {
                const count = event.payload.commits ? event.payload.commits.length : 0;
                return {
                    icon: 'fas fa-code-branch',
                    color: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                    text: `Pushed ${count} commit${count !== 1 ? 's' : ''} to ${repoLink}`
                };
            }
            case 'CreateEvent': {
                const ref = event.payload.ref_type;
                return {
                    icon: 'fas fa-plus',
                    color: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    text: `Created ${ref} ${event.payload.ref ? `<strong>${event.payload.ref}</strong> in ` : ''}${repoLink}`
                };
            }
            case 'DeleteEvent': {
                return {
                    icon: 'fas fa-trash',
                    color: 'linear-gradient(135deg, #ef4444, #ec4899)',
                    text: `Deleted ${event.payload.ref_type} <strong>${event.payload.ref}</strong> in ${repoLink}`
                };
            }
            case 'WatchEvent': {
                return {
                    icon: 'fas fa-star',
                    color: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    text: `Starred ${repoLink}`
                };
            }
            case 'ForkEvent': {
                return {
                    icon: 'fas fa-code-branch',
                    color: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    text: `Forked ${repoLink}`
                };
            }
            case 'IssuesEvent': {
                return {
                    icon: 'fas fa-exclamation-circle',
                    color: 'linear-gradient(135deg, #ec4899, #f59e0b)',
                    text: `${event.payload.action} an issue in ${repoLink}`
                };
            }
            case 'PullRequestEvent': {
                return {
                    icon: 'fas fa-code-branch',
                    color: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    text: `${event.payload.action} a pull request in ${repoLink}`
                };
            }
            case 'IssueCommentEvent': {
                return {
                    icon: 'fas fa-comment',
                    color: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    text: `Commented on an issue in ${repoLink}`
                };
            }
            case 'ReleaseEvent': {
                return {
                    icon: 'fas fa-tag',
                    color: 'linear-gradient(135deg, #10b981, #f59e0b)',
                    text: `Published release <strong>${event.payload.release?.tag_name || ''}</strong> in ${repoLink}`
                };
            }
            default: {
                return {
                    icon: 'fas fa-circle',
                    color: 'linear-gradient(135deg, #64748b, #94a3b8)',
                    text: `${event.type.replace('Event', '')} on ${repoLink}`
                };
            }
        }
    }

    function timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
        ];
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }
        return 'Just now';
    }
});
