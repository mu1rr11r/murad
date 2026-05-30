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

document.querySelectorAll('a, button, input, textarea, .tag, .service-card-3d, .tool-card, .hero-logo-wrapper, .exp-logo-wrapper, .floating-photo').forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hover'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
});

// ============================================
//  3. THREE.JS - 3D Backgrounds (Green Color Only)
// ============================================
const GREEN = 0x00ff88; // اللون الأخضر للأشكال

let scrollY_pos = 0;
window.addEventListener('scroll', () => { scrollY_pos = window.scrollY; });

// --- Helper: إنشاء سين كامل ---
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
    
    // اللون الأخضر للأشكال الـ Wireframe
    const material = new THREE.MeshBasicMaterial({ 
        color: GREEN, wireframe: true, transparent: true, opacity: 0.08 
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = camZ;
    
    return { scene, camera, renderer, mesh, canvas, camZ };
}

// --- إنشاء كل السيكشنز بشكل مختلف ---

// 1) Hero: TorusKnot
const heroScene = createScene('three-canvas', new THREE.TorusKnotGeometry(8, 2.5, 200, 30), 20);

// 2) About: Icosahedron
const aboutSceneObj = createScene('about-canvas', new THREE.IcosahedronGeometry(4, 1), 8);

// 3) Services: Octahedron
const servicesSceneObj = createScene('services-canvas', new THREE.OctahedronGeometry(5, 1), 12);

// 4) Experience: Dodecahedron
const experienceSceneObj = createScene('experience-canvas', new THREE.DodecahedronGeometry(4, 0), 10);

// 5) Contact: Torus
const contactSceneObj = createScene('contact-canvas', new THREE.TorusGeometry(5, 1.5, 16, 100), 15);

// --- حلقة الأنيميشن الموحدة ---
function animateThree() {
    requestAnimationFrame(animateThree);
    
    // Hero - TorusKnot
    if (heroScene) {
        heroScene.mesh.rotation.x += 0.002;
        heroScene.mesh.rotation.y += 0.001;
        heroScene.mesh.rotation.z = scrollY_pos * 0.0005;
        heroScene.mesh.position.x += (mouseX * 0.005 - heroScene.mesh.position.x) * 0.05;
        heroScene.mesh.position.y += (-mouseY * 0.005 - heroScene.mesh.position.y) * 0.05;
        heroScene.renderer.render(heroScene.scene, heroScene.camera);
    }
    
    // About - Icosahedron
    if (aboutSceneObj) {
        aboutSceneObj.mesh.rotation.x += 0.003;
        aboutSceneObj.mesh.rotation.y -= 0.002;
        aboutSceneObj.mesh.rotation.z = scrollY_pos * 0.0002;
        aboutSceneObj.renderer.render(aboutSceneObj.scene, aboutSceneObj.camera);
    }
    
    // Services - Octahedron
    if (servicesSceneObj) {
        servicesSceneObj.mesh.rotation.x += 0.002;
        servicesSceneObj.mesh.rotation.y += 0.003;
        servicesSceneObj.mesh.rotation.z = scrollY_pos * 0.0003;
        servicesSceneObj.renderer.render(servicesSceneObj.scene, servicesSceneObj.camera);
    }
    
    // Experience - Dodecahedron
    if (experienceSceneObj) {
        experienceSceneObj.mesh.rotation.x -= 0.002;
        experienceSceneObj.mesh.rotation.y += 0.001;
        experienceSceneObj.mesh.rotation.z = scrollY_pos * 0.00015;
        experienceSceneObj.renderer.render(experienceSceneObj.scene, experienceSceneObj.camera);
    }
    
    // Contact - Torus
    if (contactSceneObj) {
        contactSceneObj.mesh.rotation.x += 0.001;
        contactSceneObj.mesh.rotation.y -= 0.003;
        contactSceneObj.mesh.rotation.z = scrollY_pos * 0.0001;
        contactSceneObj.renderer.render(contactSceneObj.scene, contactSceneObj.camera);
    }
}
animateThree();

// --- Resize لكل الكانفاسات ---
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
//  4. الصورة الشخصية العائمة 3D
// ============================================
const floatingPhoto = document.getElementById('floatingPhoto');
const photoContainer = document.getElementById('photoContainer');

if (photoContainer && floatingPhoto) {
    // حركة الماوس على الصورة - دوران 3D
    photoContainer.addEventListener('mousemove', (e) => {
        const rect = photoContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        floatingPhoto.style.animation = 'none'; // وقف الأنيميشن وقت الماوس
        floatingPhoto.style.transform = `
            rotateY(${x * 30}deg) 
            rotateX(${-y * 25}deg) 
            translateX(${x * 20}px) 
            translateY(${y * 15}px)
            scale(1.05)
        `;
    });
    
    photoContainer.addEventListener('mouseleave', () => {
        floatingPhoto.style.transform = '';
        // رجّع الأنيميشن بعد لحظة
        setTimeout(() => {
            floatingPhoto.style.animation = '';
        }, 300);
    });
}

// ============================================
//  5. GSAP SCROLL ANIMATIONS
// ============================================
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

// أنيميشن ظهور الصورة الشخصية (منفصل لمنع التضارب اللي كان بيخفيها)
gsap.from('#photoContainer', {
    scrollTrigger: { trigger: '#photoContainer', start: 'top 85%' },
    opacity: 0, y: 60, duration: 1, ease: "power3.out"
});

gsap.utils.toArray('.service-card-3d').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
        opacity: 0, y: 100, rotateX: 15, duration: 0.8, delay: i * 0.1, ease: "power3.out"
    });
});

// ============================================
//  6. 3D TILT & SPOTLIGHT ON SERVICE CARDS
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