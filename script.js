document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SMOOTH SCROLL (LENIS)
    // Only init smooth scroll if not on a tiny touch device to save native scroll performance
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: false // Disable lenis smoothing on touch for native feel
    });

    function raf(time) { 
        lenis.raf(time); 
        requestAnimationFrame(raf); 
    }
    requestAnimationFrame(raf);

    // 2. CURTAIN LOGIC (DESKTOP ONLY)
    // We strictly check if the device supports hover. 
    // If it's a phone, we skip this to prevent "sticky" hover states.
    if (window.matchMedia("(hover: hover)").matches) {
        
        const items = document.querySelectorAll('.project-item');
        const allBgs = document.querySelectorAll('.curtain-img');
        const defaultBg = document.querySelector('#bg-default');

        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const targetId = item.getAttribute('data-bg');
                const targetBg = document.getElementById(targetId);
                
                if(targetBg) {
                    gsap.to(allBgs, { opacity: 0, duration: 0.4, overwrite: true });
                    gsap.to(targetBg, { 
                        opacity: 0.4, 
                        scale: 1, 
                        filter: "blur(0px) grayscale(0%)",
                        duration: 0.6,
                        ease: "power2.out"
                    });
                }
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(allBgs, { opacity: 0, duration: 0.4, overwrite: true });
                gsap.to(defaultBg, { 
                    opacity: 0.3, // Lower opacity for better text contrast
                    scale: 1,
                    filter: "blur(20px) grayscale(100%)",
                    duration: 0.6 
                });
            });
        });
    }

    // 3. ANIMATIONS
    // Reveal text works on both, but we speed it up slightly for mobile
    gsap.from(".reveal-text", {
        y: 100, 
        opacity: 0, 
        duration: 1.5, 
        stagger: 0.2, 
        ease: "power4.out", 
        delay: 0.2
    });
});
