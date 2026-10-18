(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.querySelector('.reading-progress');
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a[href^="#"]')];
  let scrollQueued = false;

  function updateScroll() {
    const extent = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${extent > 0 ? Math.min(1, window.scrollY / extent) : 0})`;
    const current = sections.filter(section => section.getBoundingClientRect().top <= window.innerHeight * .35).at(-1);
    navLinks.forEach(link => {
      if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('waiting');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.hero-copy, .design-object, .section-title-row, .impact-card, .capability, .quote').forEach(element => {
      element.classList.add('will-reveal', 'waiting');
      revealObserver.observe(element);
    });

    const numberObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.count);
        const decimals = element.dataset.count.includes('.') ? 1 : 0;
        const started = performance.now();
        function tick(now) {
          const fraction = Math.min((now - started) / 1100, 1);
          element.textContent = (target * (1 - Math.pow(1 - fraction, 3))).toFixed(decimals);
          if (fraction < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        numberObserver.unobserve(element);
      });
    }, { threshold: .8 });
    document.querySelectorAll('[data-count]').forEach(element => numberObserver.observe(element));
  }

  const chartButtons = [...document.querySelectorAll('[data-chart]')];
  const chartPanels = [...document.querySelectorAll('.growth-chart')];
  chartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const panelId = `${button.dataset.chart}-chart`;
      chartButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      chartPanels.forEach(panel => {
        const active = panel.id === panelId;
        panel.hidden = !active;
        panel.classList.toggle('chart-enter', active);
      });
    });
  });

  const object = document.querySelector('.design-object');
  const sculpture = document.querySelector('.sculpture');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
    let pointerFrame;
    object.addEventListener('pointermove', event => {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const rect = object.getBoundingClientRect();
        sculpture.style.setProperty('--rx', `${((event.clientY - rect.top) / rect.height - .5) * -16}deg`);
        sculpture.style.setProperty('--ry', `${((event.clientX - rect.left) / rect.width - .5) * 16}deg`);
      });
    }, { passive: true });
    object.addEventListener('pointerleave', () => {
      cancelAnimationFrame(pointerFrame);
      sculpture.style.setProperty('--rx', '0deg');
      sculpture.style.setProperty('--ry', '0deg');
    });
  }

  const toast = document.querySelector('.toast');
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        showToast('联系电话已复制');
      } catch {
        showToast(`联系电话：${button.dataset.copy}，可长按上方号码复制`);
      }
    });
  });

  // Browser printing includes every role; the download links use the dedicated mobile PDF.
  let printState = [];
  window.addEventListener('beforeprint', () => {
    printState = [...document.querySelectorAll('.job')].map(job => [job, job.open]);
    printState.forEach(([job]) => { job.open = true; });
    document.querySelectorAll('[data-count]').forEach(element => { element.textContent = element.dataset.count; });
  });
  window.addEventListener('afterprint', () => {
    printState.forEach(([job, wasOpen]) => { job.open = wasOpen; });
  });
})();
