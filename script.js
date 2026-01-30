document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SMOOTH SCROLL (Native feel on mobile)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: false 
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 2. BACKGROUND HYBRID ENGINE
    const items = document.querySelectorAll('.project-item');
    const allBgs = document.querySelectorAll('.curtain-img');
    const defaultBg = document.querySelector('#bg-default');

    const switchBg = (targetId) => {
        const targetBg = document.getElementById(targetId);
        if(targetBg) {
            // SNAPPIER TIMING: 0.25s duration + simple easing
            gsap.to(allBgs, { opacity: 0, duration: 0.25, overwrite: true });
            gsap.to(targetBg, { 
                opacity: 0.3, 
                scale: 1, 
                filter: "blur(0px) grayscale(0%)",
                duration: 0.3, 
                ease: "power1.out"
            });
        }
    };

    const resetBg = () => {
        gsap.to(allBgs, { opacity: 0, duration: 0.25, overwrite: true });
        gsap.to(defaultBg, { 
            opacity: 0.25, 
            scale: 1,
            filter: "blur(20px) grayscale(100%)",
            duration: 0.3,
            ease: "power1.out"
        });
    };

    // CHECK INPUT TYPE
    if (window.matchMedia("(hover: hover)").matches) {
        // DESKTOP: Mouse Enter/Leave
        items.forEach(item => {
            item.addEventListener('mouseenter', () => switchBg(item.getAttribute('data-bg')));
            item.addEventListener('mouseleave', resetBg);
        });
    } else {
        // MOBILE: Scroll (Intersection Observer)
        const observerOptions = {
            root: null,
            rootMargin: "-45% 0px -45% 0px", // Trigger in center
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.getAttribute('data-bg');
                    switchBg(targetId);
                    items.forEach(el => el.classList.remove('mobile-active'));
                    entry.target.classList.add('mobile-active');
                }
            });
        }, observerOptions);

        items.forEach(item => observer.observe(item));
    }

    // 3. REVEAL ANIMATIONS
    gsap.from(".reveal-text", {
        y: 100, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power4.out", delay: 0.2
    });

    // 4. NAV MORPHING LOGIC (Floating -> Full Width)
    const nav = document.querySelector('.hud-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});
