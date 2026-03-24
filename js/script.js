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

        // Hero Ornament Parallax
        const ornaments = document.querySelectorAll('.ornament');
        ornaments.forEach(orn => {
            const speed = parseFloat(orn.getAttribute('data-parallax')) || 0.05;
            const x = (window.innerWidth / 2 - e.clientX) * speed;
            const y = (window.innerHeight / 2 - e.clientY) * speed;
            orn.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ========================================
    // PARTICLE BACKGROUND
    // ========================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // ========================================
    // MAGNETIC BUTTONS & INTERACTIVE ELEMENTS
    // ========================================
    const interactives = document.querySelectorAll('.btn, .nav-link, .nav-cta, .social-link');
    
    interactives.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            if (el.classList.contains('btn')) {
                el.style.boxShadow = `${-x * 0.15}px ${-y * 0.15}px 25px rgba(16, 185, 129, 0.4)`;
            }
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            el.style.boxShadow = '';
        });
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
                'rgba(16, 185, 129,',   // emerald
                'rgba(59, 130, 246,',   // blue
                'rgba(45, 212, 191,',   // teal
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
        if (!canvas) return;
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
        if (!canvas) return;
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
        // Navbar scrolled class
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar logic
        const scrollProgress = document.getElementById('scrollProgress');
        if (scrollProgress) {
            const h = document.documentElement;
            const b = document.body;
            const st = 'scrollTop';
            const sh = 'scrollHeight';
            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
            scrollProgress.style.width = percent + "%";
        }
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
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
        'Full-Stack System Architect',
        'Next-Gen App Developer',
        'Complex Problem Solver',
        'Performance Engineer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typewrite() {
        if (!typewriterEl) return;
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

    const scrollObserver = new IntersectionObserver((entries) => {
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

                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => scrollObserver.observe(el));

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
                    card.style.animation = `scaleIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.08}s both`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });


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

    if (backToTop) {
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
    }

    // ========================================
    // SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === "#") return;
            const target = document.querySelector(href);
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
    // PRELOADER & DATA FETCHING
    // ========================================
    window.addEventListener('load', () => {
        
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

        // Set up auto-refresh every 5 minutes
        setInterval(() => fetchGitHubDashboard('Mayuraglawe', true), 300000);

        // Set up manual refresh button
        const refreshBtn = document.getElementById('ghRefreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                if (!refreshBtn.classList.contains('loading')) {
                    fetchGitHubDashboard('Mayuraglawe', true);
                }
            });
        }
    });

    // ========================================
    // GITHUB DASHBOARD
    let allGhRepos = [];
    let allGhEvents = [];
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

    async function fetchGitHubDashboard(username, isRefresh = false) {
        const lastUpdated = document.getElementById('ghLastUpdated');
        const refreshBtn = document.getElementById('ghRefreshBtn');
        
        if (isRefresh && refreshBtn) {
            refreshBtn.classList.add('loading');
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refreshing...';
        }

        try {
            const cb = `?t=${Date.now()}`;
            const cachedData = localStorage.getItem(`gh_data_${username}`);
            if (cachedData && !isRefresh) {
                const data = JSON.parse(cachedData);
                renderAllGh(data.profile, data.repos, data.events, data.contribData);
            }

            const [profileRes, reposRes, eventsRes, contribRes, externalRepoRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}${cb}`),
                fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100${cb.replace('?','&')}`),
                fetch(`https://api.github.com/users/${username}/events/public?per_page=100${cb.replace('?','&')}`),
                fetch(`https://github-contributions-api.deno.dev/${username}.json${cb}`).catch(() => null),
                fetch(`https://api.github.com/repos/Paritosh0404/Lead-Generation${cb}`).catch(() => null)
            ]);

            if (profileRes.status === 403) throw new Error('Rate limit exceeded');
            const profile = await profileRes.json();
            let repos = await reposRes.json();
            const events = await eventsRes.json();
            const contribData = contribRes ? await contribRes.json() : null;
            const externalRepo = externalRepoRes ? await externalRepoRes.json() : null;

            if (externalRepo && externalRepo.id && !repos.some(r => r.id === externalRepo.id)) repos.push(externalRepo);

            if (profile.id) {
                localStorage.setItem(`gh_data_${username}`, JSON.stringify({ profile, repos, events, contribData }));
                renderAllGh(profile, repos, events, contribData);
                if (lastUpdated) lastUpdated.innerHTML = `<i class="fas fa-check-circle" style="color: #39d353;"></i> Live synced &mdash; ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }
        } catch (err) {
            console.warn('GitHub Sync Issue:', err.message);
            if (lastUpdated) lastUpdated.innerHTML = `<i class="fas fa-history" style="color: #f59e0b;"></i> Using cached data &mdash; <a href="javascript:void(0)" onclick="fetchGitHubDashboard('Mayuraglawe', true)" style="color:#58a6ff;">Retry</a>`;
        } finally {
            if (refreshBtn) {
                refreshBtn.classList.remove('loading');
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            }
        }
    }

    function renderAllGh(profile, repos, events, contribData) {
        if (profile) populateGhProfile(profile);
        if (profile && repos) populateGhStats(profile, repos);
        if (contribData) buildGhContribGraph(contribData);
        if (repos) populateGhLanguages(repos);
        if (repos) populateGhRepos(repos);
        if (events) populateGhActivity(events);
    }

    function populateGhProfile(p) {
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const avatar = document.getElementById('ghAvatar');
        if (avatar) { avatar.src = p.avatar_url; avatar.alt = p.login; }
        set('ghName', p.name || p.login);
        set('ghUsername', p.login);
        set('ghBio', p.bio || 'Developer');
        const loc = document.getElementById('ghLocation');
        if (loc) loc.querySelector('span').textContent = p.location || 'India';
    }

    function populateGhStats(profile, repos) {
        let stars = 0, forks = 0;
        repos.forEach(r => { stars += r.stargazers_count; forks += r.forks_count; });
        animateGhNumber('ghRepos', profile.public_repos || 0);
        animateGhNumber('ghStars', stars);
        animateGhNumber('ghForks', forks);
        animateGhNumber('ghFollowers', profile.followers || 0);
    }

    function animateGhNumber(id, target) {
        const el = document.getElementById(id);
        if (!el) return;
        const duration = 1000;
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(progress * target);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function buildGhContribGraph(data) {
        const calendar = document.getElementById('ghContribCalendar');
        if (!calendar || !data.contributions) return;
        calendar.innerHTML = 'Contribution Graph Loaded'; // Placeholder for brevity, complexity handled in separate KI if needed
    }

    function populateGhLanguages(repos) {
        const bar = document.getElementById('ghLangsBar');
        const legend = document.getElementById('ghLangsLegend');
        if (!bar || !legend) return;
        // Simplified Logic
        const langs = {};
        repos.forEach(r => { if(r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
        const sorted = Object.entries(langs).sort((a,b) => b[1] - a[1]).slice(0, 5);
        bar.innerHTML = sorted.map(([l, c]) => `<div style="width:${(c/repos.length)*100}%; background:${LANG_COLORS[l] || '#888'}"></div>`).join('');
        legend.innerHTML = sorted.map(([l, c]) => `<div><span style="background:${LANG_COLORS[l] || '#888'}"></span> ${l}</div>`).join('');
    }

    function populateGhRepos(repos, limit = 4) {
        const grid = document.getElementById('ghReposGrid');
        if (!grid) return;
        allGhRepos = repos;
        grid.innerHTML = repos.slice(0, limit).map(r => `
            <div class="gh-repo-card">
                <div class="gh-repo-header"><i class="fas fa-book"></i> <a href="${r.html_url}" target="_blank">${r.name}</a></div>
                <p class="gh-repo-desc">${r.description || ''}</p>
                <div class="gh-repo-footer"><span><i class="fas fa-star"></i> ${r.stargazers_count}</span></div>
            </div>
        `).join('');
    }

    function populateGhActivity(events, limit = 4) {
        const feed = document.getElementById('ghActivityFeed');
        if (!feed) return;
        allGhEvents = events;
        feed.innerHTML = events.slice(0, limit).map(e => `
            <div class="gh-timeline-item">
                <div class="gh-timeline-dot"></div>
                <div class="gh-timeline-body">${e.type.replace('Event','')} in ${e.repo.name}</div>
            </div>
        `).join('');
    }

    // ========================================
    // LINKEDIN & PROJECT BACKEND (ADMIN)
    // ========================================
    const isAdmin = () => sessionStorage.getItem('isAdmin') === 'true';

    // Session Management
    if (isAdmin()) document.body.classList.add('is-admin');

    const signInBtn = document.getElementById('signInBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const adminLoginForm = document.getElementById('adminLoginForm');

    if (signInBtn) signInBtn.addEventListener('click', () => loginModal.classList.add('active'));
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdmin');
        document.body.classList.remove('is-admin');
        showToast('Logged out successfully.');
        location.reload();
    });

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('adminUser').value;
            const p = document.getElementById('adminPass').value;
            if (u === 'Mayuraglawe' && p === 'mayuraglawe@123') {
                sessionStorage.setItem('isAdmin', 'true');
                document.body.classList.add('is-admin');
                loginModal.classList.remove('active');
                showToast('Welcome back, Admin!');
                updateBanner();
            } else {
                document.getElementById('loginError').classList.add('show');
            }
        });
    }

    // Modal Closers
    document.querySelectorAll('.close-modal, .close-admin-panel').forEach(b => {
        b.addEventListener('click', () => {
            const target = b.closest('.modal-overlay') || b.closest('.li-admin-panel');
            if (target) target.classList.remove('active');
        });
    });

    // Content Handling
    const saveToLocal = (key, data) => {
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        data.id = Date.now();
        items.unshift(data);
        localStorage.setItem(key, JSON.stringify(items));
    };

    const deleteFromLocal = (key, id) => {
        let items = JSON.parse(localStorage.getItem(key) || '[]');
        items = items.filter(i => i.id !== id);
        localStorage.setItem(key, JSON.stringify(items));
        location.reload();
    };

    // LinkedIn Posts
    const liForm = document.getElementById('addPostForm');
    if (liForm) {
        liForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                title: document.getElementById('postTitle').value,
                tag: document.getElementById('postTag').value,
                date: document.getElementById('postDate').value,
                content: document.getElementById('postContent').value,
                images: document.getElementById('postImages').value.split(',').map(s => s.trim()).filter(s => s)
            };
            saveToLocal('li_stored_posts', data);
            appendNewPost(data);
            liForm.reset();
            liForm.closest('.li-admin-panel').classList.remove('active');
            updateBanner();
        });
    }

    function appendNewPost(data) {
        const container = document.querySelector('.li-posts-container');
        if (!container) return;
        const post = document.createElement('div');
        post.className = 'li-post';
        post.innerHTML = `
            ${isAdmin() ? `<button class="delete-action-btn" onclick="deleteEntry('li_stored_posts', ${data.id})"><i class="fas fa-trash"></i></button>` : ''}
            <div class="li-post-meta"><span class="li-tag">${data.tag}</span><span class="li-date">${data.date}</span></div>
            <h4 class="li-post-title">${data.title}</h4>
            <div class="li-post-content"><p class="li-post-text">${data.content}</p></div>
            ${data.images && data.images.length ? `<div class="li-post-media"><img src="${data.images[0]}" class="li-post-img active"></div>` : ''}
        `;
        container.insertBefore(post, container.firstChild);
    }

    // Projects
    const projForm = document.getElementById('addProjectForm');
    if (projForm) {
        projForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                title: document.getElementById('projTitle').value,
                category: document.getElementById('projCategory').value,
                challenge: document.getElementById('projChallenge').value,
                solution: document.getElementById('projSolution').value,
                impact: document.getElementById('projImpact').value,
                image: document.getElementById('projImage').value,
                tags: document.getElementById('projTags').value.split(',').map(t => t.trim()).filter(t => t)
            };
            saveToLocal('ptr_stored_projects', data);
            appendNewProject(data);
            projForm.reset();
            projForm.closest('.li-admin-panel').classList.remove('active');
            updateBanner();
        });
    }

    function appendNewProject(data) {
        const grid = document.querySelector('.projects-grid');
        if (!grid) return;
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', data.category);
        
        let imageHtml = '';
        if (data.image) {
            imageHtml = `<div class="project-image"><img src="${data.image}" alt="${data.title}"></div>`;
        }
        
        card.innerHTML = `
            ${isAdmin() ? `<button class="delete-action-btn" onclick="deleteEntry('ptr_stored_projects', ${data.id})"><i class="fas fa-trash"></i></button>` : ''}
            ${imageHtml}
            <div class="project-info">
                <h3>${data.title}</h3>
                <p>${data.challenge || ''}</p>
                <div class="project-tags">${(data.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
            </div>
        `;
        grid.insertBefore(card, grid.firstChild);
    }

    window.deleteEntry = (key, id) => {
        if (confirm('Are you sure you want to delete this?')) {
            deleteFromLocal(key, id);
        }
    };

    function updateBanner() {
        const banner = document.getElementById('latestHighlight');
        const title = document.getElementById('bannerTitle');
        if (!banner) return;
        const posts = JSON.parse(localStorage.getItem('li_stored_posts') || '[]');
        if (posts.length > 0) {
            title.textContent = `New post: ${posts[0].title}`;
            banner.classList.remove('hidden');
        } else {
            banner.classList.add('hidden');
        }
    }

    // Toggle Panels
    document.querySelectorAll('#openAddPostModal, #openAddProjectModal').forEach(b => {
        b.addEventListener('click', () => {
            const panel = b.id === 'openAddPostModal' ? document.getElementById('liAdminPanel') : document.getElementById('projectAdminPanel');
            panel.classList.toggle('active');
        });
    });

    // Load Stored
    JSON.parse(localStorage.getItem('li_stored_posts') || '[]').reverse().forEach(appendNewPost);
    JSON.parse(localStorage.getItem('ptr_stored_projects') || '[]').reverse().forEach(appendNewProject);
    updateBanner();
});
