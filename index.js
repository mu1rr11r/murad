        // 1. PRELOADER
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            gsap.to(preloader, { yPercent: -100, duration: 1, ease: "power4.inOut", delay: 1.5, onComplete: () => {
                preloader.style.display = 'none';
                animateHero();
            }});
        });

        // 2. CUSTOM CURSOR
        const dot = document.getElementById('cursor-dot');
        const outline = document.getElementById('cursor-outline');
        let mouseX = 0, mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            const outlineX = outline.getBoundingClientRect().left + 20;
            const outlineY = outline.getBoundingClientRect().top + 20;
            outline.style.left = (outlineX + (mouseX - outlineX) * 0.15 - 20) + 'px';
            outline.style.top = (outlineY + (mouseY - outlineY) * 0.15 - 20) + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, input, textarea, .tag, .service-card-3d, .tool-card, .hero-logo-wrapper, .exp-logo-wrapper').forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('hover'));
            el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
        });

        // ==========================
        // 3. THREE.JS - HOME SECTION (Torus Knot)
        // ==========================
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const geometry = new THREE.TorusKnotGeometry(8, 2.5, 200, 30);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.08 });
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);
        camera.position.z = 20;

        // ==========================
        // 4. THREE.JS - ABOUT SECTION (Icosahedron)
        // ==========================
        const aboutCanvas = document.getElementById('about-canvas');
        const aboutScene = new THREE.Scene();
        const aboutCamera = new THREE.PerspectiveCamera(75, aboutCanvas.parentElement.offsetWidth / aboutCanvas.parentElement.offsetHeight, 0.1, 1000);
        const aboutRenderer = new THREE.WebGLRenderer({ canvas: aboutCanvas, alpha: true, antialias: true });
        
        function resizeAboutCanvas() {
            const parent = aboutCanvas.parentElement;
            aboutRenderer.setSize(parent.offsetWidth, parent.offsetHeight);
            aboutCamera.aspect = parent.offsetWidth / parent.offsetHeight;
            aboutCamera.updateProjectionMatrix();
        }
        resizeAboutCanvas();

        const aboutGeometry = new THREE.IcosahedronGeometry(4, 1);
        const aboutMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1 });
        const icosahedron = new THREE.Mesh(aboutGeometry, aboutMaterial);
        aboutScene.add(icosahedron);
        aboutCamera.position.z = 8;

        let scrollY = 0;
        window.addEventListener('scroll', () => { scrollY = window.scrollY; });

        // Unified Animation Loop
        function animateThree() {
            requestAnimationFrame(animateThree);
            
            torusKnot.rotation.x += 0.002;
            torusKnot.rotation.y += 0.001;
            torusKnot.rotation.z = scrollY * 0.0005;
            torusKnot.position.x += (mouseX * 0.005 - torusKnot.position.x) * 0.05;
            torusKnot.position.y += (-mouseY * 0.005 - torusKnot.position.y) * 0.05;
            renderer.render(scene, camera);

            icosahedron.rotation.x += 0.003;
            icosahedron.rotation.y -= 0.002;
            icosahedron.rotation.z = scrollY * 0.0002;
            aboutRenderer.render(aboutScene, aboutCamera);
        }
        animateThree();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            resizeAboutCanvas();
        });

        // 5. GSAP SCROLL ANIMATIONS
        gsap.registerPlugin(ScrollTrigger);

        function animateHero() {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" }});
            tl.from('.hero-logo-wrapper', { opacity: 0, y: 40, duration: 1, scale: 0.8 })
              .from('.line-reveal .hero-title', { yPercent: 110, duration: 1.4, stagger: 0.2 }, "-=0.5")
              .from('.hero-desc', { opacity: 0, y: 30, duration: 0.8 }, "-=0.7")
              .from('.hero-btns .btn-custom', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1 }, "-=0.5")
              .from('.hero-stats .stat-item', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1 }, "-=0.4")
              .from('.hero-sidebar > *', { opacity: 0, x: 30, duration: 0.6, stagger: 0.1 }, "-=0.8");
        }

        gsap.utils.toArray('.anim-fade-up').forEach(el => {
            if(!el.closest('.hero-section')) {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
                    opacity: 0, y: 50, duration: 0.8, ease: "power3.out"
                });
            }
        });

        gsap.utils.toArray('.service-card-3d').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
                opacity: 0, y: 100, rotateX: 15, duration: 0.8, delay: i * 0.1, ease: "power3.out"
            });
        });

        // 6. 3D TILT ON ABOUT IMAGE
        const aboutImg = document.getElementById('aboutImg');
        aboutImg.addEventListener('mousemove', (e) => {
            const rect = aboutImg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 15;
            const rotateY = (rect.width / 2 - x) / 15;
            aboutImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        aboutImg.addEventListener('mouseleave', () => {
            aboutImg.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });

        // 7. 3D TILT & SPOTLIGHT ON SERVICE CARDS
        const serviceCards = document.querySelectorAll('.service-card-3d');
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.animation = 'none';
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                
                const glow = card.querySelector('.service-glow');
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent 60%)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.animation = '';
                const glow = card.querySelector('.service-glow');
                glow.style.background = 'transparent';
            });
        });

        // 8. FORM SUBMIT
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            btn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
            btn.style.background = 'transparent';
            btn.style.color = '#00ff00';
            btn.style.boxShadow = 'inset 0 0 0 2px #00ff00';
            setTimeout(() => {
                btn.innerHTML = 'Send a Message <i class="fas fa-arrow-right ms-2"></i>';
                btn.style.background = ''; btn.style.color = ''; btn.style.boxShadow = '';
                this.reset();
            }, 3000);
        });
