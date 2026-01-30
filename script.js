document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SMOOTH SCROLL (Disabled on mobile for native feel, enabled on desktop)
    const isMobile = window.innerWidth < 800;
    
    if (!isMobile) {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    // 2. CURTAIN LOGIC (Dual Mode: Hover for Desktop, Scroll for Mobile)
    const items = document.querySelectorAll('.project-item');
    const allBgs = document.querySelectorAll('.curtain-img');
    const defaultBg = document.querySelector('#bg-default');

    // Function to activate a specific background
    const activateBg = (targetId) => {
        const targetBg = document.getElementById(targetId);
        if(targetBg) {
            // Fade out others
            gsap.to(allBgs, { opacity: 0, duration: 0.5, overwrite: true });
            // Fade in target
            gsap.to(targetBg, { 
                opacity: 0.3, 
                scale: 1, 
                filter: "blur(0px) grayscale(0%)",
                duration: 0.6,
                ease: "power2.out"
            });
        }
    };

    // Function to reset to default
    const resetBg = () => {
        gsap.to(allBgs, { opacity: 0, duration: 0.5, overwrite: true });
        gsap.to(defaultBg, { 
            opacity: 0.25, 
            scale: 1,
            filter: "blur(20px) grayscale(100%)",
            duration: 0.6 
        });
    };

    if (!isMobile) {
        // --- DESKTOP: HOVER INTERACTION ---
        items.forEach(item => {
            item.addEventListener('mouseenter', () => activateBg(item.getAttribute('data-bg')));
            item.addEventListener('mouseleave', resetBg);
        });

    } else {
        // --- MOBILE: SCROLL INTERACTION (Intersection Observer) ---
        
        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -40% 0px", // Triggers when item is in the CENTER 20% of screen
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.getAttribute('data-bg');
                    activateBg(targetId);
                    
                    // Add visual highlight to the text too
                    items.forEach(el => el.classList.remove('mobile-active'));
                    entry.target.classList.add('mobile-active');
                }
            });
        }, observerOptions);

        items.forEach(item => observer.observe(item));
    }

    // 3. TEXT REVEAL ANIMATION
    gsap.from(".reveal-text", {
        y: 80, 
        opacity: 0, 
        duration: 1.2, 
        stagger: 0.1, 
        ease: "power3.out", 
        delay: 0.1
    });
});
