        // ============================================
        //  1. PRELOADER
        // ============================================
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            gsap.to(preloader, { 
                yPercent: -100, duration: 1, ease: "power4.inOut", delay: 1.5, 
                onComplete: () => {
                    preloader.style.display = 'none';
                    animateHero();
                }
            });
        });

        // ============================================
        //  2. CUSTOM CURSOR
        // ============================================
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

        // ============================================
        //  3. THREE.JS - 3D Backgrounds
        // ============================================
        const GREEN = 0x00ff88;

        let scrollY_pos = 0;
        window.addEventListener('scroll', () => { scrollY_pos = window.scrollY; });

        function createScene(canvasId, geometry, camZ) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return null;
            
            const parent = canvas.parentElement;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, parent.offsetWidth / parent.offsetHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            
            renderer.setSize(parent.offsetWidth, parent.offsetHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            camera.aspect = parent.offsetWidth / parent.offsetHeight;
            camera.updateProjectionMatrix();
            
            const material = new THREE.MeshBasicMaterial({ 
                color: GREEN, wireframe: true, transparent: true, opacity: 0.08 
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            camera.position.z = camZ;
            
            return { scene, camera, renderer, mesh, canvas, camZ };
        }

        const heroScene = createScene('three-canvas', new THREE.TorusKnotGeometry(8, 2.5, 200, 30), 20);
        const aboutSceneObj = createScene('about-canvas', new THREE.IcosahedronGeometry(4, 1), 8);
        const servicesSceneObj = createScene('services-canvas', new THREE.OctahedronGeometry(5, 1), 12);
        const experienceSceneObj = createScene('experience-canvas', new THREE.DodecahedronGeometry(4, 0), 10);
        const contactSceneObj = createScene('contact-canvas', new THREE.TorusGeometry(5, 1.5, 16, 100), 15);

        function animateThree() {
            requestAnimationFrame(animateThree);
            
            if (heroScene) {
                heroScene.mesh.rotation.x += 0.002;
                heroScene.mesh.rotation.y += 0.001;
                heroScene.mesh.rotation.z = scrollY_pos * 0.0005;
                heroScene.mesh.position.x += (mouseX * 0.005 - heroScene.mesh.position.x) * 0.05;
                heroScene.mesh.position.y += (-mouseY * 0.005 - heroScene.mesh.position.y) * 0.05;
                heroScene.renderer.render(heroScene.scene, heroScene.camera);
            }
            
            if (aboutSceneObj) {
                aboutSceneObj.mesh.rotation.x += 0.003;
                aboutSceneObj.mesh.rotation.y -= 0.002;
                aboutSceneObj.mesh.rotation.z = scrollY_pos * 0.0002;
                aboutSceneObj.renderer.render(aboutSceneObj.scene, aboutSceneObj.camera);
            }
            
            if (servicesSceneObj) {
                servicesSceneObj.mesh.rotation.x += 0.002;
                servicesSceneObj.mesh.rotation.y += 0.003;
                servicesSceneObj.mesh.rotation.z = scrollY_pos * 0.0003;
                servicesSceneObj.renderer.render(servicesSceneObj.scene, servicesSceneObj.camera);
            }
            
            if (experienceSceneObj) {
                experienceSceneObj.mesh.rotation.x -= 0.002;
                experienceSceneObj.mesh.rotation.y += 0.001;
                experienceSceneObj.mesh.rotation.z = scrollY_pos * 0.00015;
                experienceSceneObj.renderer.render(experienceSceneObj.scene, experienceSceneObj.camera);
            }
            
            if (contactSceneObj) {
                contactSceneObj.mesh.rotation.x += 0.001;
                contactSceneObj.mesh.rotation.y -= 0.003;
                contactSceneObj.mesh.rotation.z = scrollY_pos * 0.0001;
                contactSceneObj.renderer.render(contactSceneObj.scene, contactSceneObj.camera);
            }
        }
        animateThree();

        window.addEventListener('resize', () => {
            const scenes = [heroScene, aboutSceneObj, servicesSceneObj, experienceSceneObj, contactSceneObj];
            scenes.forEach(s => {
                if (!s) return;
                const parent = s.canvas.parentElement;
                s.renderer.setSize(parent.offsetWidth, parent.offsetHeight);
                s.camera.aspect = parent.offsetWidth / parent.offsetHeight;
                s.camera.updateProjectionMatrix();
            });
        });

        // ============================================
        //  4. GSAP SCROLL ANIMATIONS
        // ============================================
        gsap.registerPlugin(ScrollTrigger);

        function animateHero() {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" }});
            tl.from('.hero-logo-wrapper', { opacity: 0, y: 40, duration: 1, scale: 0.8 })
              .from('.line-reveal .hero-title', { yPercent: 110, duration: 1.4, stagger: 0.2 }, "-=0.5")
              .from('.hero-desc', { opacity: 0, y: 30, duration: 0.8 }, "-=0.7")
              .from('.hero-btns .btn-custom', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1 }, "-=0.5")
              .from('.hero-stats .stat-item', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1 }, "-=0.4")
              .from('.hero-sidebar > *', { opacity: 0, x: 30, duration: 0.6, stagger: 0.1 }, "-=0.6");
            
            setTimeout(() => {
                triggerHeroSpider();
            }, 800);
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

        // ============================================
        //  5. 3D TILT & SPOTLIGHT ON SERVICE CARDS
        // ============================================
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
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 60%)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.animation = '';
                const glow = card.querySelector('.service-glow');
                glow.style.background = 'transparent';
            });
        });

        // ============================================
        //  6. ★ SPIDER-WEB 3D DROP ANIMATION ★
        // ============================================

        function initSpiderState(dropEl) {
            const anchor = dropEl.querySelector('.spider-anchor');
            const thread = dropEl.querySelector('.spider-thread');
            const imgWrap = dropEl.querySelector('.spider-img-wrap');
            
            gsap.set(anchor, { opacity: 0, scale: 0 });
            gsap.set(thread, { height: 0 });
            gsap.set(imgWrap, { 
                opacity: 0, 
                y: -40, 
                scale: 0.5, 
                rotateY: 0, 
                rotateX: 0,
                transformStyle: 'preserve-3d'
            });
            
            return { anchor, thread, imgWrap };
        }

        function getThreadHeight(dropEl) {
            const section = dropEl.closest('section');
            if (!section) return 150;
            const sectionH = section.offsetHeight;
            return Math.floor(sectionH * 0.25);
        }

        function animateSpiderIn(anchor, thread, imgWrap, targetHeight, startDelay) {
            imgWrap.classList.remove('dropped');
            gsap.killTweensOf([anchor, thread, imgWrap]);
            
            const tl = gsap.timeline({ delay: startDelay || 0 });
            
            tl.to(anchor, { 
                opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)" 
            });
            
            tl.to(thread, { 
                height: targetHeight, 
                duration: 1.4, 
                ease: "power1.out" 
            }, "-=0.2");
            
            tl.to(imgWrap, { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                rotateY: 720,
                rotateX: 15,
                duration: 1.6, 
                ease: "power2.out" 
            }, "-=1.3");
            
            tl.to(imgWrap, { 
                rotateY: 0, 
                rotateX: 0, 
                y: -12,
                duration: 0.9, 
                ease: "power3.out" 
            }, "-=0.2");
            
            tl.to(imgWrap, { 
                y: 0, 
                duration: 0.6, 
                ease: "bounce.out(1, 0.4)" 
            });
            
            tl.add(() => { 
                imgWrap.classList.add('dropped'); 
            }, "+=0.2");
        }

        function animateSpiderOut(anchor, thread, imgWrap) {
            imgWrap.classList.remove('dropped');
            gsap.killTweensOf([anchor, thread, imgWrap]);
            
            const tl = gsap.timeline();
            
            tl.to(imgWrap, { 
                opacity: 0, 
                y: -40, 
                scale: 0.5, 
                rotateY: -360,
                rotateX: -10,
                duration: 0.9, 
                ease: "power2.in" 
            });
            
            tl.to(thread, { 
                height: 0, duration: 0.5, ease: "power2.in" 
            }, "-=0.5");
            
            tl.to(anchor, { 
                opacity: 0, scale: 0, duration: 0.25, ease: "power2.in" 
            }, "-=0.3");
        }

        let heroSpiderData = null;

        function initHeroSpider() {
            const drop = document.getElementById('spider-hero');
            if (!drop) return;
            
            const data = initSpiderState(drop);
            const targetH = getThreadHeight(drop);
            heroSpiderData = { ...data, targetH };
        }

        function triggerHeroSpider() {
            if (!heroSpiderData) return;
            animateSpiderIn(
                heroSpiderData.anchor, 
                heroSpiderData.thread, 
                heroSpiderData.imgWrap, 
                heroSpiderData.targetH, 
                0
            );
        }

        function initHeroSpiderScroll() {
            const drop = document.getElementById('spider-hero');
            if (!drop) return;
            
            const section = drop.closest('section');
            if (!section) return;
            
            ScrollTrigger.create({
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => {
                    if (!heroSpiderData) return;
                    animateSpiderIn(
                        heroSpiderData.anchor, 
                        heroSpiderData.thread, 
                        heroSpiderData.imgWrap, 
                        heroSpiderData.targetH, 
                        0
                    );
                },
                onLeave: () => {
                    if (!heroSpiderData) return;
                    animateSpiderOut(
                        heroSpiderData.anchor, 
                        heroSpiderData.thread, 
                        heroSpiderData.imgWrap
                    );
                },
                onEnterBack: () => {
                    if (!heroSpiderData) return;
                    animateSpiderIn(
                        heroSpiderData.anchor, 
                        heroSpiderData.thread, 
                        heroSpiderData.imgWrap, 
                        heroSpiderData.targetH, 
                        0
                    );
                },
                onLeaveBack: () => {
                    if (!heroSpiderData) return;
                    animateSpiderOut(
                        heroSpiderData.anchor, 
                        heroSpiderData.thread, 
                        heroSpiderData.imgWrap
                    );
                }
            });
        }

        let aboutSpiderData = null;

        function initAboutSpider() {
            const drop = document.getElementById('spider-about');
            if (!drop) return;
            
            const section = drop.closest('section');
            if (!section) return;
            
            const data = initSpiderState(drop);
            const targetH = getThreadHeight(drop);
            aboutSpiderData = { ...data, targetH };
            
            ScrollTrigger.create({
                trigger: section,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => {
                    animateSpiderIn(data.anchor, data.thread, data.imgWrap, targetH, 0);
                },
                onLeave: () => {
                    animateSpiderOut(data.anchor, data.thread, data.imgWrap);
                },
                onEnterBack: () => {
                    animateSpiderIn(data.anchor, data.thread, data.imgWrap, targetH, 0);
                },
                onLeaveBack: () => {
                    animateSpiderOut(data.anchor, data.thread, data.imgWrap);
                }
            });
        }

        initHeroSpider();
        initHeroSpiderScroll();
        initAboutSpider();

        // ============================================
        //  7. FORM SUBMIT
        // ============================================
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            btn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
            btn.style.background = 'transparent';
            btn.style.color = '#00ff88';
            btn.style.boxShadow = 'inset 0 0 0 2px #00ff88';
            setTimeout(() => {
                btn.innerHTML = 'Send a Message <i class="fas fa-arrow-right ms-2"></i>';
                btn.style.background = ''; btn.style.color = ''; btn.style.boxShadow = '';
                this.reset();
            }, 3000);
        });
