/* ==========================================================================
   Home page — live premium estimator + hero vehicle focus
   Illustrative maths only. Not a rated quote.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('estimator');
  if (!panel) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------- Rating tables ---------------------------- */
  const VEHICLE = {
    bike: {
      label: 'Two-Wheeler',
      odRate: 0.032,
      idv: { min: 20000, max: 400000, step: 2500, preset: 85000 },
      rsa: 299,
      tp: idv => (idv <= 100000 ? 714 : 1366)
    },
    car: {
      label: 'Car',
      odRate: 0.0285,
      idv: { min: 100000, max: 2500000, step: 10000, preset: 650000 },
      rsa: 499,
      tp: idv => (idv <= 800000 ? 2094 : idv <= 1500000 ? 3416 : 7897)
    }
  };

  const CITY_FACTOR = { metro: 1.12, tier1: 1.0, tier2: 0.9 };

  const ADDON_RATE = {
    zeroDep: 0.15,
    engine: 0.08,
    consumables: 0.05
  };

  /* ------------------------------- State -------------------------------- */
  const state = {
    vehicle: 'bike',
    idv: 85000,
    age: 2,
    city: 'metro',
    ncb: 0,
    addons: { zeroDep: false, engine: false, rsa: false, consumables: false }
  };

  /* ------------------------------ Elements ------------------------------ */
  const idvInput = document.getElementById('est-idv');
  const ageInput = document.getElementById('est-age');
  const idvOut = document.getElementById('est-idv-out');
  const ageOut = document.getElementById('est-age-out');

  const vehicleGroup = document.getElementById('est-vehicle');
  const cityGroup = document.getElementById('est-city');
  const ncbGroup = document.getElementById('est-ncb');
  const addonGroup = document.getElementById('est-addons');

  const quoteCard = document.getElementById('quote-card');
  const figureEl = document.getElementById('quote-figure');
  const monthlyEl = document.getElementById('quote-monthly');
  const vehicleLabelEl = document.getElementById('quote-vehicle-label');
  const idvLabelEl = document.getElementById('quote-idv-label');
  const ctaEl = document.getElementById('quote-cta');

  const segOd = document.getElementById('seg-od');
  const segTp = document.getElementById('seg-tp');
  const segAddon = document.getElementById('seg-addon');
  const valOd = document.getElementById('val-od');
  const valTp = document.getElementById('val-tp');
  const valAddon = document.getElementById('val-addon');

  const coverageItems = document.querySelectorAll('#coverage-list [data-coverage]');

  const heroToggle = document.getElementById('hero-vehicle-toggle');
  const heroVisual = document.getElementById('hero-visual');

  /* ------------------------------ Helpers ------------------------------- */
  const rupees = n => '₹' + Math.round(n).toLocaleString('en-IN');

  function compactRupees(n) {
    if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr';
    if (n >= 100000) return '₹' + (n / 100000).toFixed(2).replace(/\.00$/, '') + ' L';
    return rupees(n);
  }

  function paintRange(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const pct = ((Number(input.value) - min) / (max - min)) * 100;
    input.style.backgroundSize = pct + '% 100%';
  }

  function selectInGroup(group, btn) {
    group.querySelectorAll('.chip').forEach(chip => {
      const on = chip === btn;
      chip.classList.toggle('active', on);
      if (chip.hasAttribute('role')) chip.setAttribute('aria-checked', String(on));
    });
  }

  /* ------------------------------ The maths ------------------------------ */
  function calculate() {
    const v = VEHICLE[state.vehicle];

    const ageFactor = 1 + state.age * 0.035;
    const cityFactor = CITY_FACTOR[state.city];

    const odGross = state.idv * v.odRate * ageFactor * cityFactor;
    const od = odGross * (1 - state.ncb / 100);
    const tp = v.tp(state.idv);

    let addons = 0;
    if (state.addons.zeroDep) addons += odGross * ADDON_RATE.zeroDep;
    if (state.addons.engine) addons += odGross * ADDON_RATE.engine;
    if (state.addons.consumables) addons += odGross * ADDON_RATE.consumables;
    if (state.addons.rsa) addons += v.rsa;

    return { od, tp, addons, total: od + tp + addons };
  }

  /* --------------------------- Number tweening --------------------------- */
  let currentTotal = 0;
  let rafId = null;

  function tweenTotal(to) {
    if (prefersReducedMotion) {
      currentTotal = to;
      figureEl.textContent = Math.round(to).toLocaleString('en-IN');
      return;
    }

    const from = currentTotal;
    const start = performance.now();
    const duration = 520;

    if (rafId) cancelAnimationFrame(rafId);

    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = from + (to - from) * eased;
      figureEl.textContent = Math.round(value).toLocaleString('en-IN');
      if (p < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        currentTotal = to;
        rafId = null;
      }
    }

    rafId = requestAnimationFrame(frame);
  }

  /* ------------------------------- Render -------------------------------- */
  let flashTimer = null;

  function render(flash = true) {
    const { od, tp, addons, total } = calculate();

    tweenTotal(total);
    monthlyEl.textContent = rupees(total / 12);
    vehicleLabelEl.textContent = VEHICLE[state.vehicle].label;
    idvLabelEl.textContent = compactRupees(state.idv);

    valOd.textContent = rupees(od);
    valTp.textContent = rupees(tp);
    valAddon.textContent = addons > 0 ? rupees(addons) : '—';

    const sum = total || 1;
    segOd.style.width = (od / sum) * 100 + '%';
    segTp.style.width = (tp / sum) * 100 + '%';
    segAddon.style.width = (addons / sum) * 100 + '%';

    coverageItems.forEach(item => {
      const on = state.addons[item.dataset.coverage];
      item.classList.toggle('muted', !on);
      const icon = item.querySelector('i');
      icon.className = on ? 'ph-fill ph-check-circle' : 'ph-fill ph-circle-dashed';
    });

    ctaEl.setAttribute('href', 'plans.html?type=' + state.vehicle);

    if (flash && !prefersReducedMotion) {
      quoteCard.classList.remove('quote-flash');
      // force reflow so the animation can retrigger
      void quoteCard.offsetWidth;
      quoteCard.classList.add('quote-flash');
      clearTimeout(flashTimer);
      flashTimer = setTimeout(() => quoteCard.classList.remove('quote-flash'), 600);
    }
  }

  /* ------------------------------ Bindings ------------------------------- */
  idvInput.addEventListener('input', () => {
    state.idv = Number(idvInput.value);
    idvOut.textContent = compactRupees(state.idv);
    paintRange(idvInput);
    render(false);
  });

  ageInput.addEventListener('input', () => {
    state.age = Number(ageInput.value);
    ageOut.textContent = state.age === 0 ? 'Brand new' : state.age + (state.age === 1 ? ' year' : ' years');
    paintRange(ageInput);
    render(false);
  });

  vehicleGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn || btn.dataset.vehicle === state.vehicle) return;

    state.vehicle = btn.dataset.vehicle;
    selectInGroup(vehicleGroup, btn);
    applyVehicleRange();
    syncHeroToggle(state.vehicle);
    render();
  });

  cityGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    state.city = btn.dataset.city;
    selectInGroup(cityGroup, btn);
    render();
  });

  ncbGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    state.ncb = Number(btn.dataset.ncb);
    selectInGroup(ncbGroup, btn);
    render();
  });

  addonGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    const key = btn.dataset.addon;
    state.addons[key] = !state.addons[key];
    btn.classList.toggle('active', state.addons[key]);
    btn.setAttribute('aria-pressed', String(state.addons[key]));
    render();
  });

  function applyVehicleRange() {
    const cfg = VEHICLE[state.vehicle].idv;
    idvInput.min = cfg.min;
    idvInput.max = cfg.max;
    idvInput.step = cfg.step;
    idvInput.value = cfg.preset;
    state.idv = cfg.preset;
    idvOut.textContent = compactRupees(state.idv);
    paintRange(idvInput);
  }

  /* --------------------- Hero toggle ↔ estimator sync -------------------- */
  function syncHeroToggle(vehicle) {
    if (!heroToggle) return;
    heroToggle.querySelectorAll('.vehicle-toggle-btn').forEach(btn => {
      const on = btn.dataset.vehicle === vehicle;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', String(on));
    });
    if (heroVisual) {
      heroVisual.classList.toggle('focus-bike', vehicle === 'bike');
      heroVisual.classList.toggle('focus-car', vehicle === 'car');
    }
  }

  if (heroToggle) {
    heroToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.vehicle-toggle-btn');
      if (!btn) return;

      const vehicle = btn.dataset.vehicle;
      syncHeroToggle(vehicle);

      if (vehicle !== state.vehicle) {
        state.vehicle = vehicle;
        selectInGroup(vehicleGroup, vehicleGroup.querySelector(`[data-vehicle="${vehicle}"]`));
        applyVehicleRange();
        render();
      }
    });
  }

  /* ------------------------- Deep link: ?type=car ------------------------ */
  const requested = new URLSearchParams(window.location.search).get('type');
  if (requested === 'car' || requested === 'bike') {
    state.vehicle = requested;
    selectInGroup(vehicleGroup, vehicleGroup.querySelector(`[data-vehicle="${requested}"]`));
    syncHeroToggle(requested);
  }

  /* -------------------------------- Init -------------------------------- */
  applyVehicleRange();
  paintRange(ageInput);
  ageOut.textContent = state.age + ' years';
  render(false);
});
