document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SMOOTH SCROLL (LENIS)
    // We disable 'smoothTouch' to keep the native Samsung feel on mobile
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: false 
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 2. BACKGROUND LOGIC (THE HYBRID ENGINE)
    const items = document.querySelectorAll('.project-item');
    const allBgs = document.querySelectorAll('.curtain-img');
    const defaultBg = document.querySelector('#bg-default');

    // Helper: Switch Background
    const switchBg = (targetId) => {
        const targetBg = document.getElementById(targetId);
        if(targetBg) {
            gsap.to(allBgs, { opacity: 0, duration: 0.5, overwrite: true });
            gsap.to(targetBg, { 
                opacity: 0.3, 
                scale: 1, 
                filter: "blur(0px) grayscale(0%)",
                duration: 0.6,
                ease: "power2.out"
            });
        }
    };

    // Helper: Reset Background
    const resetBg = () => {
        gsap.to(allBgs, { opacity: 0, duration: 0.5, overwrite: true });
        gsap.to(defaultBg, { 
            opacity: 0.25, 
            scale: 1,
            filter: "blur(20px) grayscale(100%)",
            duration: 0.6 
        });
    };

    // DETECT INPUT TYPE
    // If the device supports hovering (Desktop), use mouse events
    if (window.matchMedia("(hover: hover)").matches) {
        
        items.forEach(item => {
            item.addEventListener('mouseenter', () => switchBg(item.getAttribute('data-bg')));
            item.addEventListener('mouseleave', resetBg);
        });

    } else {
        // --- MOBILE SOLUTION: INTERSECTION OBSERVER ---
        // This watches for when a project slides into the center of the screen
        
        const observerOptions = {
            root: null,
            // These margins define a "strip" in the middle of the screen (45% from top/bottom)
            // When an item enters this strip, it triggers.
            rootMargin: "-45% 0px -45% 0px", 
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.getAttribute('data-bg');
                    switchBg(targetId);
                    
                    // Highlight the text to confirm selection to user
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
});
