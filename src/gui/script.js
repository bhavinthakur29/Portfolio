document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Unified Custom Cursor ---
    const cursor = document.getElementById('cursor');

    if (cursor) {
        // Hide initially until mouse moves
        cursor.style.opacity = "0";

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.opacity = "1";
        });

        // Use event delegation for hover states (works for current and future elements)
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .interactive, .glass-card')) {
                cursor.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .interactive, .glass-card')) {
                cursor.classList.remove('hovering');
            }
        });
    }

    // --- 2. GSAP Scroll Animations ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.gsap-reveal').forEach((elem) => {
            gsap.fromTo(elem,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    // --- 3. Three.js Background ---
    initThreeBackground();
});

function initThreeBackground() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#0a0a0a', 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const debris = [];
    const geometries = [new THREE.IcosahedronGeometry(0.2, 0), new THREE.OctahedronGeometry(0.15, 0)];

    for (let i = 0; i < 30; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x7B2FFF : 0x00FFCC,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const mesh = new THREE.Mesh(geometries[Math.floor(Math.random() * geometries.length)], material);
        mesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15 - 5);
        mesh.userData = { speedX: (Math.random() - 0.5) * 0.001, speedY: (Math.random() - 0.5) * 0.001, rotationSpeed: (Math.random() - 0.5) * 0.005 };
        scene.add(mesh);
        debris.push(mesh);
    }

    camera.position.z = 5;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
        targetY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        debris.forEach(mesh => {
            mesh.position.x += mesh.userData.speedX;
            mesh.position.y += mesh.userData.speedY;
            mesh.rotation.x += mesh.userData.rotationSpeed;
            mesh.rotation.y += mesh.userData.rotationSpeed;
            if (mesh.position.x > 10) mesh.position.x = -10;
            if (mesh.position.x < -10) mesh.position.x = 10;
            if (mesh.position.y > 10) mesh.position.y = -10;
            if (mesh.position.y < -10) mesh.position.y = 10;
        });
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (-targetY - camera.position.y) * 0.02;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}