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
    // GITHUB DASHBOARD — Full Rewrite
    let allGhRepos = []; // Store for "See more" logic
    let allGhEvents = []; // Store for activity "See more" logic
    const GITHUB_USERNAME = 'Mayuraglawe';
    const LANG_COLORS = {
        JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
        HTML: '#e34c26', CSS: '#563d7c', Java: '#b07219', 'C++': '#f34b7d',
        C: '#555555', 'C#': '#178600', Go: '#00ADD8', Rust: '#dea584',
        Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF',
        Dart: '#00B4AB', Shell: '#89e051', Vue: '#41b883', SCSS: '#c6538c',
        Jupyter: '#DA5B0B', Dockerfile: '#384d54', Makefile: '#427819',
        'Objective-C': '#438eff', Perl: '#0298c3', R: '#198CE7',
        Lua: '#000080', Haskell: '#5e5086', Elixir: '#6e4a7e',
    };

    const GH_GREEN_LEVELS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

    async function fetchGitHubDashboard(username) {
        try {
            // Fetch everything in parallel
            const [profileRes, reposRes, eventsRes, contribRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`),
                fetch(`https://api.github.com/users/${username}/events/public?per_page=100`),
                fetch(`https://github-contributions-api.deno.dev/${username}.json`)
            ]);

            const profile = await profileRes.json();
            const repos = await reposRes.json();
            const events = await eventsRes.json();
            const contribData = await contribRes.json();

            if (profile.message === 'Not Found') {
                console.error('GitHub user not found');
                return;
            }

            populateProfile(profile);
            populateStats(profile, repos);
            buildContributionGraph(contribData);
            populateLanguages(repos);
            populateRepos(repos);
            populateActivity(events);

            // Update timestamp
            const lastUpdated = document.getElementById('ghLastUpdated');
            if (lastUpdated) {
                const now = new Date().toLocaleString();
                lastUpdated.innerHTML = `<i class="fas fa-check-circle" style="color: #39d353;"></i> Live data from GitHub &mdash; Last fetched ${now}`;
            }
        } catch (err) {
            console.error('GitHub API Error:', err);
            const lastUpdated = document.getElementById('ghLastUpdated');
            if (lastUpdated) {
                lastUpdated.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i> Could not load GitHub data &mdash; <a href="javascript:location.reload()" style="color:#58a6ff;">Retry</a>`;
            }
        }
    }

    function populateProfile(p) {
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

        const avatar = document.getElementById('ghAvatar');
        if (avatar) { avatar.src = p.avatar_url; avatar.alt = `${p.login}'s avatar`; }

        set('ghName', p.name || p.login);
        set('ghUsername', p.login);
        set('ghBio', p.bio || 'Developer & Open Source Enthusiast');

        // Sidebar meta
        const loc = document.getElementById('ghLocation');
        if (loc) loc.querySelector('span').textContent = p.location || 'Earth';

        const joined = document.getElementById('ghJoined');
        if (joined) {
            const d = new Date(p.created_at);
            joined.querySelector('span').textContent = `Joined ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
        }

        // Company
        if (p.company) {
            const comp = document.getElementById('ghCompany');
            if (comp) { comp.classList.remove('gh-hidden'); comp.querySelector('span').textContent = p.company; }
        }

        // Blog
        if (p.blog) {
            const blog = document.getElementById('ghBlog');
            if (blog) {
                blog.classList.remove('gh-hidden');
                const a = blog.querySelector('a');
                a.href = p.blog.startsWith('http') ? p.blog : `https://${p.blog}`;
                a.textContent = p.blog.replace(/^https?:\/\//, '');
            }
        }
    }

    function populateStats(profile, repos) {
        let totalStars = 0, totalForks = 0, totalWatchers = 0;
        if (Array.isArray(repos)) {
            repos.forEach(r => {
                totalStars += r.stargazers_count || 0;
                totalForks += r.forks_count || 0;
                totalWatchers += r.watchers_count || 0;
            });
        }

        animateGhNumber('ghRepos', profile.public_repos || 0);
        animateGhNumber('ghStars', totalStars);
        animateGhNumber('ghForks', totalForks);
        animateGhNumber('ghWatchers', totalWatchers);
        animateGhNumber('ghFollowers', profile.followers || 0);
        animateGhNumber('ghFollowing', profile.following || 0);
    }

    function animateGhNumber(id, target) {
        const el = document.getElementById(id);
        if (!el) return;
        if (target === 0) { el.textContent = '0'; return; }

        const duration = 1200;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // ============================
    // GREEN CONTRIBUTION GRAPH
    // ============================
    function buildContributionGraph(data) {
        const calendar = document.getElementById('ghContribCalendar');
        const countEl = document.getElementById('ghContribCount');
        if (!calendar || !data || !data.contributions) return;

        // Total contributions (Live from profile)
        const realTotal = data.totalContributions || data.total || 0;
        if (countEl) animateGhNumber('ghContribCount', realTotal);

        // Flatten the weeks array from the API if it's nested
        let days = [];
        if (Array.isArray(data.contributions[0])) {
            // It's [ [day, day, ...], [day, day, ...], ... ]
            data.contributions.forEach(week => {
                week.forEach(day => {
                    days.push({
                        date: new Date(day.date),
                        dateStr: day.date,
                        count: day.contributionCount || day.count || 0,
                        level: day.contributionLevel === "NONE" ? 0 : 
                               (day.contributionLevel === "FIRST_QUARTILE" ? 1 : 
                               (day.contributionLevel === "SECOND_QUARTILE" ? 2 : 
                               (day.contributionLevel === "THIRD_QUARTILE" ? 3 : 4)))
                    });
                });
            });
        } else {
            // It's a flat array [day, day, ...]
            days = data.contributions.map(day => ({
                date: new Date(day.date),
                dateStr: day.date,
                count: day.count || day.contributionCount || 0,
                level: day.level || 0
            }));
        }

        if (days.length === 0) return;

        // Group into weeks (the API already might be grouped, but we ensure it)
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        // Build month labels
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let monthsRow = document.createElement('div');
        monthsRow.className = 'gh-contrib-months';

        let lastMonth = -1;
        weeks.forEach(week => {
            const realDay = week.find(d => d !== null);
            if (realDay && realDay.date.getMonth() !== lastMonth) {
                lastMonth = realDay.date.getMonth();
                const monthLabel = document.createElement('span');
                monthLabel.className = 'gh-contrib-month';
                monthLabel.style.width = '14px'; // match square width
                monthLabel.style.display = 'inline-block';
                monthLabel.textContent = monthNames[lastMonth];
                monthsRow.appendChild(monthLabel);
            } else {
                const spacer = document.createElement('span');
                spacer.style.width = '14px';
                spacer.style.display = 'inline-block';
                monthsRow.appendChild(spacer);
            }
        });

        calendar.innerHTML = '';
        calendar.appendChild(monthsRow);

        // Build grid
        const gridWrap = document.createElement('div');
        gridWrap.style.display = 'flex';
        gridWrap.style.gap = '3px';

        weeks.forEach(week => {
            const col = document.createElement('div');
            col.className = 'gh-contrib-week';
            col.style.display = 'flex';
            col.style.flexDirection = 'column';
            col.style.gap = '3px';

            week.forEach(day => {
                const cell = document.createElement('div');
                cell.className = 'gh-contrib-day';
                
                // Map API levels to 0-4
                let level = day.level;
                // If it's a string from GitHub's internal API, map it
                if (typeof level === 'string') {
                    if (level.includes('FOURTH')) level = 4;
                    else if (level.includes('THIRD')) level = 3;
                    else if (level.includes('SECOND')) level = 2;
                    else if (level.includes('FIRST')) level = 1;
                    else level = 0;
                }
                
                cell.setAttribute('data-level', level);
                cell.setAttribute('data-tooltip',
                    `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                );
                col.appendChild(cell);
            });
            gridWrap.appendChild(col);
        });

        calendar.appendChild(gridWrap);
    }

    // ============================
    // LANGUAGES
    // ============================
    function populateLanguages(repos) {
        if (!Array.isArray(repos)) return;

        const langBytes = {};
        repos.forEach(repo => {
            if (repo.language) {
                // Weight by repo size for better accuracy
                const weight = repo.size || 1;
                langBytes[repo.language] = (langBytes[repo.language] || 0) + weight;
            }
        });

        const sorted = Object.entries(langBytes).sort((a, b) => b[1] - a[1]);
        const total = sorted.reduce((sum, [, w]) => sum + w, 0);

        const langBar = document.getElementById('ghLangsBar');
        const langLegend = document.getElementById('ghLangsLegend');
        if (!langBar || !langLegend || sorted.length === 0) return;

        langBar.innerHTML = '';
        langLegend.innerHTML = '';

        sorted.forEach(([lang, weight]) => {
            const pct = ((weight / total) * 100).toFixed(1);
            const color = LANG_COLORS[lang] || '#8b5cf6';

            const segment = document.createElement('div');
            segment.className = 'gh-lang-segment';
            segment.style.width = `${pct}%`;
            segment.style.backgroundColor = color;
            segment.title = `${lang}: ${pct}%`;
            langBar.appendChild(segment);

            const item = document.createElement('div');
            item.className = 'gh-lang-item';
            item.innerHTML = `<span class="gh-lang-dot" style="background:${color}"></span><span>${lang}</span><span class="gh-lang-pct">${pct}%</span>`;
            langLegend.appendChild(item);
        });
    }

    // ============================
    // REPOS — GitHub card style
    // ============================
    function populateRepos(repos, limit = 4) {
        if (!Array.isArray(repos)) return;
        allGhRepos = repos; // Store all

        const grid = document.getElementById('ghReposGrid');
        if (!grid) return;
        grid.innerHTML = '';

        // Sort by stars first, then by recently pushed
        const sorted = [...repos].sort((a, b) => {
            const starDiff = (b.stargazers_count || 0) - (a.stargazers_count || 0);
            if (starDiff !== 0) return starDiff;
            return new Date(b.pushed_at) - new Date(a.pushed_at);
        });

        const top = sorted.slice(0, limit);

        top.forEach((repo, i) => {
            const langColor = LANG_COLORS[repo.language] || '#8b5cf6';
            const sizeKB = repo.size || 0;
            const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

            const card = document.createElement('div');
            card.className = 'gh-repo-card';
            card.style.animation = `fadeInUp 0.5s ease ${i * 0.1}s both`;
            card.innerHTML = `
                <div class="gh-repo-header">
                    <i class="fas fa-book"></i>
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="gh-repo-name">${repo.name}</a>
                    <span class="gh-repo-visibility">Public</span>
                </div>
                <p class="gh-repo-desc">${repo.description || 'No description provided.'}</p>
                <div class="gh-repo-footer">
                    ${repo.language ? `<span><span class="gh-repo-lang-dot" style="background:${langColor}"></span>${repo.language}</span>` : ''}
                    ${repo.stargazers_count > 0 ? `<span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ''}
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count || 0}</span>
                </div>
            `;
            grid.appendChild(card);
        });

        // Toggle "See more" / "See less"
        const showMoreBtn = document.getElementById('ghShowMore');
        if (showMoreBtn) {
            if (repos.length <= 4) {
                showMoreBtn.parentElement.style.display = 'none';
            } else {
                showMoreBtn.parentElement.style.display = 'flex';
                showMoreBtn.textContent = limit >= 8 ? 'See less' : 'See more';
            }
        }
    }

    // GitHub Show More/Less Toggle
    const ghShowMore = document.getElementById('ghShowMore');
    if (ghShowMore) {
        ghShowMore.addEventListener('click', () => {
            const isExpanded = ghShowMore.textContent === 'See less';
            populateRepos(allGhRepos, isExpanded ? 4 : 8);
        });
    }

    // ============================
    // ACTIVITY TIMELINE
    // ============================
    function populateActivity(events, limit = 4) {
        if (!Array.isArray(events)) return;
        allGhEvents = events;

        const feed = document.getElementById('ghActivityFeed');
        if (!feed) return;
        feed.innerHTML = '';

        const recent = events.slice(0, limit);

        if (recent.length === 0) {
            feed.innerHTML = `<div class="gh-timeline-item">
                <div class="gh-timeline-dot"><i class="fas fa-minus"></i></div>
                <div class="gh-timeline-body"><div class="gh-timeline-text">No recent public activity.</div></div>
            </div>`;
            return;
        }

        recent.forEach((event, i) => {
            const { icon, text, detail } = formatEvent(event);
            if (!text) return;

            const item = document.createElement('div');
            item.className = 'gh-timeline-item';
            item.style.animation = `fadeInRight 0.5s ease ${i * 0.1}s both`;
            item.innerHTML = `
                <div class="gh-timeline-dot"><i class="${icon}"></i></div>
                <div class="gh-timeline-body">
                    <div class="gh-timeline-text">
                        ${text}
                        ${detail ? `<span class="gh-event-detail">${detail}</span>` : ''}
                    </div>
                    <div class="gh-timeline-time">${timeAgo(new Date(event.created_at))}</div>
                </div>
            `;
            feed.appendChild(item);
        });

        // Toggle "See more" / "See less"
        const activeShowMore = document.getElementById('ghActivityShowMore');
        if (activeShowMore) {
            if (events.length <= 4) {
                activeShowMore.parentElement.style.display = 'none';
            } else {
                activeShowMore.parentElement.style.display = 'flex';
                activeShowMore.textContent = limit >= 8 ? 'See less' : 'See more';
            }
        }
    }

    // GitHub Activity Show More/Less Toggle
    const ghActivityShowMore = document.getElementById('ghActivityShowMore');
    if (ghActivityShowMore) {
        ghActivityShowMore.addEventListener('click', () => {
            const isExpanded = ghActivityShowMore.textContent === 'See less';
            populateActivity(allGhEvents, isExpanded ? 4 : 8);
        });
    }

    function formatEvent(event) {
        const repo = event.repo ? event.repo.name : '';
        const repoShort = repo.split('/')[1] || repo;
        const repoLink = `<a href="https://github.com/${repo}" target="_blank" rel="noopener">${repoShort}</a>`;

        switch (event.type) {
            case 'PushEvent': {
                const commits = event.payload.commits || [];
                const count = commits.length;
                const msgs = commits.slice(0, 3).map(c => c.message.split('\n')[0]).join(', ');
                return {
                    icon: 'fas fa-code',
                    text: `Pushed <strong>${count}</strong> commit${count !== 1 ? 's' : ''} to ${repoLink}`,
                    detail: msgs ? `"${msgs}"` : ''
                };
            }
            case 'CreateEvent': {
                const ref = event.payload.ref_type;
                const refName = event.payload.ref;
                return {
                    icon: 'fas fa-plus',
                    text: `Created ${ref}${refName ? ` <strong>${refName}</strong>` : ''} in ${repoLink}`,
                    detail: ref === 'repository' ? event.payload.description || '' : ''
                };
            }
            case 'DeleteEvent':
                return {
                    icon: 'fas fa-trash-alt',
                    text: `Deleted ${event.payload.ref_type} <strong>${event.payload.ref}</strong> from ${repoLink}`,
                    detail: ''
                };
            case 'WatchEvent':
                return { icon: 'fas fa-star', text: `Starred ${repoLink}`, detail: '' };
            case 'ForkEvent':
                return {
                    icon: 'fas fa-code-branch',
                    text: `Forked ${repoLink}`,
                    detail: event.payload.forkee ? `→ ${event.payload.forkee.full_name}` : ''
                };
            case 'IssuesEvent':
                return {
                    icon: 'fas fa-dot-circle',
                    text: `${capitalize(event.payload.action)} issue in ${repoLink}`,
                    detail: event.payload.issue ? `#${event.payload.issue.number}: ${event.payload.issue.title}` : ''
                };
            case 'PullRequestEvent':
                return {
                    icon: 'fas fa-code-branch',
                    text: `${capitalize(event.payload.action)} pull request in ${repoLink}`,
                    detail: event.payload.pull_request ? `#${event.payload.pull_request.number}: ${event.payload.pull_request.title}` : ''
                };
            case 'IssueCommentEvent':
                return {
                    icon: 'fas fa-comment-dots',
                    text: `Commented on issue in ${repoLink}`,
                    detail: event.payload.issue ? `#${event.payload.issue.number}: ${event.payload.issue.title}` : ''
                };
            case 'PullRequestReviewEvent':
                return {
                    icon: 'fas fa-check-circle',
                    text: `Reviewed pull request in ${repoLink}`,
                    detail: ''
                };
            case 'ReleaseEvent':
                return {
                    icon: 'fas fa-tag',
                    text: `Released <strong>${event.payload.release?.tag_name || ''}</strong> in ${repoLink}`,
                    detail: event.payload.release?.name || ''
                };
            case 'PublicEvent':
                return { icon: 'fas fa-globe', text: `Made ${repoLink} public`, detail: '' };
            case 'MemberEvent':
                return {
                    icon: 'fas fa-user-plus',
                    text: `${capitalize(event.payload.action)} collaborator in ${repoLink}`,
                    detail: event.payload.member ? event.payload.member.login : ''
                };
            default:
                return {
                    icon: 'fas fa-circle',
                    text: `${event.type.replace('Event', '')} in ${repoLink}`,
                    detail: ''
                };
        }
    }

    function capitalize(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    }

    function timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 0) return 'Just now';
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
            if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
        return 'Just now';
    }
    // LinkedIn Read More Toggle
    document.querySelectorAll('.li-read-more').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.parentElement;
            const short = content.querySelector('.short');
            const full = content.querySelector('.full');
            
            if (full.classList.contains('hidden')) {
                full.classList.remove('hidden');
                short.classList.add('hidden');
                btn.textContent = 'Read less';
            } else {
                full.classList.add('hidden');
                short.classList.remove('hidden');
                btn.textContent = 'Read more';
            }
        });
    });
    
    // LinkedIn Show All Posts Toggle
    const showMoreBtn = document.getElementById('liShowMore');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            const extraPosts = document.querySelectorAll('.li-extra-post');
            if (extraPosts.length === 0) return;
            const isHidden = extraPosts[0].classList.contains('hidden');
            
            extraPosts.forEach(post => {
                if (isHidden) {
                    post.classList.remove('hidden');
                } else {
                    post.classList.add('hidden');
                }
            });
            
            showMoreBtn.textContent = isHidden ? 'Show less activity' : 'Show all activity';
        });
    }

    // LinkedIn Post Image Slider
    document.querySelectorAll('.li-post-media-slider').forEach(slider => {
        const images = slider.querySelectorAll('.li-post-img');
        const dots = slider.querySelectorAll('.li-dot');
        const prevBtn = slider.querySelector('.li-slider-prev');
        const nextBtn = slider.querySelector('.li-slider-next');
        let currentIndex = 0;

        if (images.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        function updateSlider(index) {
            currentIndex = (index + images.length) % images.length;
            
            images.forEach((img, i) => img.classList.toggle('active', i === currentIndex));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        if (prevBtn) prevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));
        
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => updateSlider(i));
        });
    });
});
