/* ==========================================================================
   About page — interactive journey explorer
   Click a year, use the arrows, or let it auto-advance.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const rail = document.getElementById('journey-rail');
  if (!rail) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const MILESTONES = [
    {
      badge: 'Founded',
      title: 'Inception & seed funding',
      body: 'Apex Auto begins with one conviction: an insurer should be judged by how fast it pays out, not how much it collects. A team of eight, one office, and a rewritten claims flow on a whiteboard.',
      metrics: [
        { value: '8', label: 'Founding team' },
        { value: '$4M', label: 'Seed round' }
      ],
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=900',
      alt: 'The founding team collaborating around a desk'
    },
    {
      badge: 'Regulatory',
      title: 'Licensed &amp; first policy issued',
      body: 'Formal certification and operating licence granted by the regulatory authority (placeholder ID: IRDAI-MOCK-190). Our first two-wheeler policy went live the same week — issued end to end in under four minutes.',
      metrics: [
        { value: '4 min', label: 'First policy issued' },
        { value: '100%', label: 'Paperless from day one' }
      ],
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=900',
      alt: 'Motorcycle rider on a city street'
    },
    {
      badge: 'Expansion',
      title: 'Car insurance goes live',
      body: 'We extended the portfolio to comprehensive car cover and shipped the industry\'s first instant zero-depreciation add-on that activates mid-policy, straight from the app.',
      metrics: [
        { value: '3,200+', label: 'Garages onboarded' },
        { value: '11 s', label: 'Median quote time' }
      ],
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=900',
      alt: 'A car parked on an open road'
    },
    {
      badge: 'Today',
      title: 'Two million journeys protected',
      body: 'Today the same promise runs at scale: claims approved in hours, cashless repair at 5,000+ vetted garages, and a support line answered by a person. Next up — telematics-based pricing for safe riders.',
      metrics: [
        { value: '2.1M', label: 'Vehicles covered' },
        { value: '4h 12m', label: 'Avg. approval time' }
      ],
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=900',
      alt: 'Car on a coastal highway at sunset'
    }
  ];

  const nodes = Array.from(rail.querySelectorAll('.journey-node'));
  const progress = document.getElementById('rail-progress');
  const copy = document.getElementById('journey-copy');
  const badgeEl = document.getElementById('journey-badge');
  const titleEl = document.getElementById('journey-title');
  const bodyEl = document.getElementById('journey-body');
  const metricsEl = document.getElementById('journey-metrics');
  const imageEl = document.getElementById('journey-image');
  const counterEl = document.getElementById('journey-counter');
  const prevBtn = document.getElementById('journey-prev');
  const nextBtn = document.getElementById('journey-next');

  let index = 0;
  let autoTimer = null;
  let userEngaged = false;

  const pad = n => String(n).padStart(2, '0');

  function show(i, { fromUser = false } = {}) {
    index = (i + MILESTONES.length) % MILESTONES.length;
    const m = MILESTONES[index];

    nodes.forEach((node, n) => {
      const on = n === index;
      node.classList.toggle('active', on);
      node.setAttribute('aria-selected', String(on));
    });

    // Fill the rail up to the active node
    const ratio = nodes.length > 1 ? index / (nodes.length - 1) : 0;
    progress.style.width = `calc(${ratio * 88}%)`;

    badgeEl.textContent = m.badge;
    titleEl.innerHTML = m.title;
    bodyEl.innerHTML = m.body;

    metricsEl.innerHTML = m.metrics
      .map(metric => `<div class="journey-metric"><strong>${metric.value}</strong><span>${metric.label}</span></div>`)
      .join('');

    imageEl.src = m.image;
    imageEl.alt = m.alt;

    counterEl.textContent = `${pad(index + 1)} / ${pad(MILESTONES.length)}`;

    if (!prefersReducedMotion) {
      copy.classList.remove('journey-fade');
      void copy.offsetWidth;
      copy.classList.add('journey-fade');
    }

    if (fromUser) stopAuto();
  }

  /* ------------------------------ Auto-play ------------------------------ */
  function startAuto() {
    if (prefersReducedMotion || userEngaged) return;
    stopAuto();
    autoTimer = setInterval(() => show(index + 1), 6000);
  }

  function stopAuto() {
    userEngaged = true;
    clearInterval(autoTimer);
    autoTimer = null;
  }

  /* ------------------------------ Bindings ------------------------------- */
  rail.addEventListener('click', (e) => {
    const node = e.target.closest('.journey-node');
    if (!node) return;
    show(Number(node.dataset.index), { fromUser: true });
  });

  prevBtn.addEventListener('click', () => show(index - 1, { fromUser: true }));
  nextBtn.addEventListener('click', () => show(index + 1, { fromUser: true }));

  // Arrow-key navigation once the timeline has focus
  rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      show(index + 1, { fromUser: true });
      nodes[index].focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      show(index - 1, { fromUser: true });
      nodes[index].focus();
    }
  });

  // Pause auto-advance while the pointer is over the section
  const section = document.getElementById('journey');
  section.addEventListener('mouseenter', () => clearInterval(autoTimer));
  section.addEventListener('mouseleave', () => { if (!userEngaged) startAuto(); });

  // Only auto-advance once the timeline is actually on screen
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAuto();
      } else {
        clearInterval(autoTimer);
      }
    });
  }, { threshold: 0.35 });

  io.observe(section);

  show(0);
});
