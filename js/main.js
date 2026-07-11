/* ============================================
   Prixial — Main Interaction Script
   Scroll reveals, counters, navigation
   ============================================ */

(function () {
  'use strict';

  // ---- Mobile Menu ----
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('active', menuOpen);
      menuBtn.classList.toggle('active', menuOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
      });
    });
  }

  // ---- Scroll Reveal with IntersectionObserver ----
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe service nodes
  document.querySelectorAll('.service-node').forEach((node, i) => {
    node.style.transitionDelay = `${i * 80}ms`;
    revealObserver.observe(node);
  });

  // Observe industry nodes
  document.querySelectorAll('.industry-node').forEach((node, i) => {
    node.style.transitionDelay = `${i * 60}ms`;
    revealObserver.observe(node);
  });

  // Observe metrics
  document.querySelectorAll('.metric').forEach((metric, i) => {
    metric.style.transitionDelay = `${i * 120}ms`;
    revealObserver.observe(metric);
  });

  // Observe general reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ---- Animated Counters ----
  function animateCounter(element, target, duration) {
    const start = performance.now();
    const suffix = element.dataset.suffix || '';

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // Counter observer
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        if (!el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCounter(el, target, 1800);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.metric__value').forEach(val => {
    counterObserver.observe(val);
  });

  // ---- Section label animations ----
  const sectionLabelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section__header, .philosophy__content, .cta__content').forEach(el => {
    el.classList.add('reveal');
    sectionLabelObserver.observe(el);
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Nav background on scroll ----
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      nav.style.background = 'rgba(10, 10, 10, 0.85)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.webkitBackdropFilter = 'blur(12px)';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.webkitBackdropFilter = 'none';
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // ---- Parallax for philosophy headline ----
  const philosophyHeadline = document.querySelector('.philosophy__headline');
  if (philosophyHeadline) {
    window.addEventListener('scroll', () => {
      const rect = philosophyHeadline.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      if (rect.top < viewHeight && rect.bottom > 0) {
        const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
        const offset = (progress - 0.5) * 30;
        philosophyHeadline.style.transform = `translateY(${offset}px)`;
      }
    }, { passive: true });
  }

})();