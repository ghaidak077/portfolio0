document.addEventListener('DOMContentLoaded', () => {
    
    // 0. BOOT SEQUENCE
    const loader = document.getElementById('loader');
    setTimeout(() => {
        gsap.to(loader, {
            y: "-100%",
            duration: 1,
            ease: "power4.inOut"
        });
        
        // Trigger Reveal Animations after Loader lifts
        gsap.from(".reveal-text", {
            y: 100, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power4.out", delay: 0.5
        });
    }, 2000); // 2 second fake boot time

    // 1. CUSTOM CURSOR
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    
    // Only run cursor logic on desktop
    if (window.matchMedia("(min-width: 769px)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with lag
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Effects
        const interactiveElements = document.querySelectorAll('.hover-trigger, a, button');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // 2. SMOOTH SCROLL (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: false 
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 3. BACKGROUND ENGINE
    const items = document.querySelectorAll('.project-item');
    const allBgs = document.querySelectorAll('.curtain-img');
    const defaultBg = document.querySelector('#bg-default');

    const switchBg = (targetId) => {
        const targetBg = document.getElementById(targetId);
        if(targetBg) {
            gsap.to(allBgs, { opacity: 0, duration: 0.25, overwrite: true });
            gsap.to(targetBg, { 
                opacity: 0.3, scale: 1, filter: "blur(0px) grayscale(0%)",
                duration: 0.3, ease: "power1.out"
            });
        }
    };

    const resetBg = () => {
        gsap.to(allBgs, { opacity: 0, duration: 0.25, overwrite: true });
        gsap.to(defaultBg, { 
            opacity: 0.25, scale: 1, filter: "blur(20px) grayscale(100%)",
            duration: 0.3, ease: "power1.out"
        });
    };

    if (window.matchMedia("(hover: hover)").matches) {
        items.forEach(item => {
            item.addEventListener('mouseenter', () => switchBg(item.getAttribute('data-bg')));
            item.addEventListener('mouseleave', resetBg);
        });
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.getAttribute('data-bg');
                    switchBg(targetId);
                    items.forEach(el => el.classList.remove('mobile-active'));
                    entry.target.classList.add('mobile-active');
                }
            });
        }, { threshold: 0, rootMargin: "-45% 0px -45% 0px" });

        items.forEach(item => observer.observe(item));
    }

    // 4. NAV MORPHING
    const nav = document.querySelector('.hud-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});