
document.addEventListener('DOMContentLoaded', () => {
  /* ========= Mobile menu (slide-in left) ========= */
  const burger = document.querySelector('.hamburger');
  const menu   = document.querySelector('.nav-links');

  if (burger && menu) {
    // Toggle panel
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-active');
      menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', burger.classList.contains('is-active'));
    });

    // Close panel when clicking a link
    menu.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      burger.classList.remove('is-active');
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        burger.classList.remove('is-active');
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ========= Scroll indicator ========= */
  const scrollBar = document.querySelector('.scroll-indicator');
  window.addEventListener('scroll', () => {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent      = (scrollTop / scrollHeight) * 100;
    if (scrollBar) scrollBar.style.width = percent + '%';
  });

  /* ========= Header hide on scroll down, show on up ========= */
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (header) {
      if (st > lastScrollTop && st > 100) header.style.transform = 'translateY(-100%)';
      else header.style.transform = 'translateY(0)';
    }
    lastScrollTop = st <= 0 ? 0 : st;
  });

  /* ========= Smooth scroll for anchor links (and close menu) ========= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: Math.max(0, target.offsetTop - 40),
          behavior: 'smooth'
        });
      }
      if (menu) menu.classList.remove('open');
      if (burger) burger.classList.remove('is-active');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ========= Parallax hero image (subtle) ========= */
  window.addEventListener('scroll', () => {
    const scrolled  = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image-container');
    const rate      = scrolled * -0.5;
    if (heroImage && scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${rate}px)`;
    }
  });

  /* ========= Stagger gallery items (delay only) ========= */
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.style.animationDelay = `${i * 0.1}s`;
  });

  /* ========= Body loaded flag ========= */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    animateOnScroll(); // run once on load
  });

  /* ========= Typing effect (hero h1) ========= */
  const heroTitle   = document.querySelector('.hero-text h1');
  if (heroTitle) {
    const original = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    function typeWriter() {
      if (i < original.length) {
        heroTitle.textContent += original.charAt(i++);
        setTimeout(typeWriter, 50);
      }
    }
    setTimeout(typeWriter, 1500);
  }

  /* ========= Animate on scroll (no IntersectionObserver) ========= */
  function isInViewport(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
  function animateOnScroll() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      if (isInViewport(el)) el.classList.add('animated');
      else el.classList.remove('animated'); // allows retrigger on scroll up
    });
  }
  window.addEventListener('scroll', animateOnScroll);

}); // End of main DOMContentLoaded

// Custom cursor code - Enhanced for all devices
document.addEventListener('DOMContentLoaded', () => {
  // Device capability detection
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
  };

  const hasHoverCapability = () => {
    return window.matchMedia('(hover: hover)').matches;
  };

  const isDesktopDevice = () => {
    return !isTouchDevice() && hasHoverCapability();
  };

  // Get cursor elements
  const bigBall = document.querySelector('.cursor__ball--big');
  const smallBall = document.querySelector('.cursor__ball--small');
  const cursor = document.querySelector('.cursor');

  // Early exit for touch devices or missing cursor elements
  if (!cursor || !bigBall || !smallBall) {
    console.log('Custom cursor: Missing cursor elements or touch device detected');
    return;
  }

  // Hide cursor on touch devices
  if (isTouchDevice() || !hasHoverCapability()) {
    cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  // Variables for cursor tracking
  let mouseX = 0;
  let mouseY = 0;
  let isMouseOverPage = false;
  let isGSAPReady = false;
  let animationFrameId = null;

  // Check if GSAP is available
  function checkGSAP() {
    return typeof gsap !== 'undefined' && gsap.set && gsap.to;
  }

  // Fallback animation without GSAP
  function animateWithoutGSAP(element, x, y, duration = 0.3) {
    if (!element) return;
    
    element.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    element.style.transform = `translate(${x}px, ${y}px)`;
  }

  // Update cursor position with or without GSAP
  function updateCursorPosition(x, y) {
    mouseX = x;
    mouseY = y;
    
    if (isGSAPReady) {
      // Use GSAP for smooth animation
      gsap.to(bigBall, { x: mouseX, y: mouseY, duration: 0.3, ease: "power2.out" });
      gsap.to(smallBall, { x: mouseX, y: mouseY, duration: 0.1, ease: "power2.out" });
    } else {
      // Fallback to CSS transitions
      animateWithoutGSAP(bigBall, mouseX, mouseY, 0.3);
      animateWithoutGSAP(smallBall, mouseX, mouseY, 0.1);
    }
  }

  // Initialize cursor position
  function initializeCursor() {
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    
    // Check GSAP availability
    isGSAPReady = checkGSAP();
    
    if (isGSAPReady) {
      gsap.set(bigBall, { x: mouseX, y: mouseY });
      gsap.set(smallBall, { x: mouseX, y: mouseY });
    } else {
      // Set initial position without animation
      bigBall.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      smallBall.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }
    
    // Make cursor visible
    cursor.classList.add('active');
    cursor.style.opacity = '1';
  }

  // Optimized mouse tracking with throttling
  let lastMoveTime = 0;
  const throttleDelay = 16; // ~60fps

  function handleMouseMove(e) {
    const now = Date.now();
    if (now - lastMoveTime < throttleDelay) return;
    
    lastMoveTime = now;
    updateCursorPosition(e.clientX, e.clientY);
  }

  // Show cursor when mouse enters
  function handleMouseEnter() {
    isMouseOverPage = true;
    if (cursor) {
      cursor.style.opacity = '1';
    }
  }

  // Hide cursor when mouse leaves
  function handleMouseLeave() {
    isMouseOverPage = false;
    if (cursor) {
      cursor.style.opacity = '0';
    }
  }

  // Handle window resize
  function handleResize() {
    if (!isMouseOverPage) {
      initializeCursor();
    }
  }

  // Enhanced cursor interactions for clickable elements
  function addCursorInteractions() {
    const interactiveElements = document.querySelectorAll('a, button, .btn, [role="button"], input, textarea, select');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('cursor-hover');
      });
      
      element.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('cursor-hover');
      });
    });
  }

  // Wait for GSAP to load if not ready
  function waitForGSAP(callback, maxAttempts = 50) {
    let attempts = 0;
    
    function checkAndInit() {
      if (checkGSAP() || attempts >= maxAttempts) {
        isGSAPReady = checkGSAP();
        callback();
        return;
      }
      
      attempts++;
      setTimeout(checkAndInit, 100);
    }
    
    checkAndInit();
  }

  // Initialize everything
  function init() {
    initializeCursor();
    addCursorInteractions();
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    
    // Hide default cursor on desktop
    if (isDesktopDevice()) {
      document.body.style.cursor = 'none';
    }
  }

  // Start initialization, waiting for GSAP if needed
  waitForGSAP(init);

  // Cleanup function for memory management
  window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseenter', handleMouseEnter);
    document.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('resize', handleResize);
  });
});
