document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Theme Toggle
     ------------------------------------------------------------------ */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const htmlEl = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    htmlEl.setAttribute('data-theme', 'dark');
    updateThemeIcons('dark');
  } else {
    updateThemeIcons('light');
  }

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });

  function updateThemeIcons(theme) {
    themeToggles.forEach(toggle => {
      toggle.innerHTML = theme === 'dark'
        ? '<i class="ph ph-sun"></i>'
        : '<i class="ph ph-moon"></i>';
    });
  }

  /* ------------------------------------------------------------------
     Hamburger Menu
     ------------------------------------------------------------------ */
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');

  function openDrawer() {
    if (drawer && drawerOverlay) {
      drawer.classList.add('active');
      drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && drawerOverlay) {
      drawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ------------------------------------------------------------------
     Active navigation link
     ------------------------------------------------------------------ */
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath && currentPath.endsWith(linkPath) && linkPath !== '#') {
      link.classList.add('active');
    } else if (currentPath.endsWith('/') && linkPath === 'index.html') {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------------------------
     Navbar scroll state + scroll progress bar + Back to top
     ------------------------------------------------------------------ */
  const navbar = document.querySelector('.navbar');

  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.innerHTML = '<i class="ph-bold ph-arrow-up"></i>';
  document.body.appendChild(backToTopBtn);

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });

  let ticking = false;

  function onScroll() {
    const scrolled = window.scrollY;

    if (navbar) navbar.classList.toggle('scrolled', scrolled > 24);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? Math.min(scrolled / docHeight, 1) : 0;
    progressBar.style.transform = `scaleX(${ratio})`;

    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', scrolled > 300);
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  /* ------------------------------------------------------------------
     Scroll reveal (fade in + stagger)
     ------------------------------------------------------------------ */
  const animateElements = document.querySelectorAll('.animate-on-scroll, .reveal-stagger');

  if (animateElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        if (entry.target.classList.contains('reveal-stagger')) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.add('animate-up');
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animateElements.forEach(el => observer.observe(el));
  }

  /* ------------------------------------------------------------------
     Count-up numbers — add data-count-to="98.5" data-suffix="%"
     ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('[data-count-to]');

  if (counters.length > 0) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(el => countObserver.observe(el));
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.countTo);
    const decimals = (el.dataset.countTo.split('.')[1] || '').length;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    const format = value => prefix + value.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) + suffix;

    if (prefersReducedMotion) {
      el.textContent = format(target);
      return;
    }

    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = format(Number((target * eased).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------
     FAQ accordion — every panel starts closed and opens only on click.
     One open panel per [data-accordion] group.
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-accordion]').forEach(group => {
    const items = Array.from(group.querySelectorAll('.faq-item'));

    function close(item) {
      const answer = item.querySelector('.faq-answer');
      const question = item.querySelector('.faq-question');

      // Pin the current height so the collapse has something to animate from
      answer.style.maxHeight = answer.scrollHeight + 'px';
      void answer.offsetHeight;

      item.classList.remove('open');
      question.setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = '0px';
    }

    function open(item) {
      const answer = item.querySelector('.faq-answer');
      const question = item.querySelector('.faq-question');

      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }

    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      // Once open, drop the fixed height so the panel can reflow (resize, font swap)
      answer.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'max-height' && item.classList.contains('open')) {
          answer.style.maxHeight = 'none';
        }
      });

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        items.forEach(other => {
          if (other !== item && other.classList.contains('open')) close(other);
        });

        isOpen ? close(item) : open(item);
      });
    });
  });

  /* ------------------------------------------------------------------
     Subtle pointer-follow parallax — add data-tilt to any element
     ------------------------------------------------------------------ */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      const strength = parseFloat(el.dataset.tilt) || 6;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      });
    });
  }
});
