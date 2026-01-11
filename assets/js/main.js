const themeKey = 'djs-portfolio-theme';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const smoothScrollTo = selector => {
  const target = document.querySelector(selector);
  if (!target) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    target.scrollIntoView({ block: 'start' });
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const initTheme = () => {
  const saved = localStorage.getItem(themeKey);
  if (saved === 'light' || saved === 'dark') {
    document.body.dataset.theme = saved;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.body.dataset.theme = 'light';
  } else {
    document.body.dataset.theme = 'dark';
  }
};

const toggleTheme = () => {
  const current = document.body.dataset.theme === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = next;
  localStorage.setItem(themeKey, next);
};

const initNav = () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('[data-nav-link]');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.dataset.open === 'true';
    navLinks.dataset.open = String(!isOpen);
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.dataset.open = 'false';
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
};

const initScrollButtons = () => {
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-scroll-to');
      if (target) smoothScrollTo(target);
    });
  });
};

const initParallaxCanvas = () => {
  const canvas = document.getElementById('parallax-layer');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resize();
  window.addEventListener('resize', resize);

  const nodes = Array.from({ length: 26 }).map(() => ({
    x: Math.random(),
    y: Math.random(),
    depth: 0.2 + Math.random() * 0.8
  }));

  let targetOffsetX = 0;
  let targetOffsetY = 0;
  let offsetX = 0;
  let offsetY = 0;

  const updateTargetFromEvent = evt => {
    const x = evt.clientX / window.innerWidth;
    const y = evt.clientY / window.innerHeight;
    targetOffsetX = (x - 0.5) * 40;
    targetOffsetY = (y - 0.3) * 30;
  };

  window.addEventListener('pointermove', updateTargetFromEvent);

  const render = () => {
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    offsetX += (targetOffsetX - offsetX) * 0.06;
    offsetY += (targetOffsetY - offsetY) * 0.06;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 0.5;

    nodes.forEach((node, i) => {
      const x = node.x * canvas.width + offsetX * node.depth;
      const y = node.y * canvas.height + offsetY * node.depth;

      const radius = 1 + node.depth * 2.7;
      const opacity = 0.12 + node.depth * 0.18;
      ctx.beginPath();
      ctx.fillStyle = `rgba(148, 163, 184, ${opacity})`;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      nodes.forEach((other, j) => {
        if (j <= i) return;
        const ox = other.x * canvas.width + offsetX * other.depth;
        const oy = other.y * canvas.height + offsetY * other.depth;
        const dx = x - ox;
        const dy = y - oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.14;
          ctx.strokeStyle = `rgba(51, 65, 85, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(ox, oy);
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(render);
  };

  render();
};

const projectDetails = {
  'experience-lab': {
    subtitle: 'A living lab for testing microinteractions with real people, fast.',
    content: `
      <h3>What it is</h3>
      <p>
        Experience Lab is a browser-based sandbox where product teams can plug in small interaction
        ideas and validate them with users in minutes instead of weeks.
      </p>
      <h3>Why it matters for HR & hiring</h3>
      <ul>
        <li>Demonstrates an end‑to‑end workflow from idea to measurable outcome.</li>
        <li>Highlights comfort with ambiguity, experimentation, and rapid learning.</li>
        <li>Shows how I communicate interaction decisions to non‑technical stakeholders.</li>
      </ul>
      <h3>What I can bring to your team</h3>
      <p>
        I build tools that make it easy to observe, understand, and iterate on how people actually use
        your products — without sacrificing craft in the details.
      </p>
    `
  },
  'people-radar': {
    subtitle: 'Turning complex talent signals into simple, human‑readable stories.',
    content: `
      <h3>What it is</h3>
      <p>
        People Radar is a concept dashboard that pulls scattered people data into one interface,
        using narrative cues and motion to make patterns obvious at a glance.
      </p>
      <h3>Why it matters for HR & hiring</h3>
      <ul>
        <li>Optimizes cognitive load so leaders can focus on decisions, not spreadsheets.</li>
        <li>Balances quantitative signals with qualitative nuance and uncertainty.</li>
        <li>Communicates risk and opportunity without overwhelming non‑technical partners.</li>
      </ul>
      <h3>What I can bring to your team</h3>
      <p>
        I design for sense‑making first — prioritizing legibility, empathy, and explainability in
        every interface.
      </p>
    `
  },
  'creator-journey': {
    subtitle: 'An onboarding story that teaches people to build their own interactive spaces.',
    content: `
      <h3>What it is</h3>
      <p>
        Creator Journey is a narrative‑driven walkthrough that gradually unlocks interactive concepts,
        turning hesitation into playful exploration.
      </p>
      <h3>Why it matters for future creators</h3>
      <ul>
        <li>Removes intimidation by revealing complexity one micro‑interaction at a time.</li>
        <li>Celebrates small wins to keep momentum and intrinsic motivation high.</li>
        <li>Supports different learning speeds through pacing, hints, and optional depth.</li>
      </ul>
      <h3>What I can bring to your team</h3>
      <p>
        I design learning experiences that feel like guided discovery — combining narrative, motion,
        and systems thinking.
      </p>
    `
  }
};

const orbitDescriptions = {
  craft: {
    title: 'Craft',
    body:
      'How things feel in the hand: typography, rhythm, motion, and the small details that make an interface feel intentional.'
  },
  empathy: {
    title: 'Empathy',
    body:
      'Designing from the inside out — understanding the pressures, hopes, and constraints of the people using the product.'
  },
  systems: {
    title: 'Systems',
    body:
      'Connecting patterns so experiences stay coherent as they scale: components, states, and journeys that fit together.'
  },
  motion: {
    title: 'Motion',
    body:
      'Using movement as a language — to guide attention, explain cause and effect, and reward exploration without noise.'
  }
};

const initProjectModal = () => {
  const modal = document.querySelector('.project-modal');
  const titleEl = modal?.querySelector('[data-modal-title]');
  const subtitleEl = modal?.querySelector('[data-modal-subtitle]');
  const contentEl = modal?.querySelector('[data-modal-content]');
  const closeEls = modal?.querySelectorAll('[data-modal-close]');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modal || !titleEl || !subtitleEl || !contentEl) return;

  let activeTrigger = null;

  const openModal = card => {
    const id = card.getAttribute('data-project-id');
    const details = projectDetails[id];
    if (!details) return;

    activeTrigger = card;

    titleEl.textContent = card.querySelector('.project-title')?.textContent || '';
    subtitleEl.textContent = details.subtitle;
    contentEl.innerHTML = details.content;

    modal.classList.add('project-modal--opening');
    modal.setAttribute('aria-hidden', 'false');

    const handleAnimEnd = () => {
      modal.classList.remove('project-modal--opening');
      const closeButton = modal.querySelector('.project-modal-close');
      if (closeButton instanceof HTMLElement) {
        closeButton.focus();
      }
    };

    const shell = modal.querySelector('.project-modal-shell');
    if (shell instanceof HTMLElement) {
      shell.addEventListener('animationend', handleAnimEnd, { once: true });
    } else {
      handleAnimEnd();
    }
  };

  const closeModal = () => {
    if (modal.getAttribute('aria-hidden') === 'true') return;
    modal.setAttribute('aria-hidden', 'true');
    if (activeTrigger) {
      activeTrigger.focus();
      activeTrigger = null;
    }
  };

  projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', evt => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        openModal(card);
      }
    });

    // Exclusive "active" state for hover/focus so only one card
    // shows its deep summary and planetary accents at a time.
    const setActive = () => {
      projectCards.forEach(other =>
        other.classList.toggle('project-card--active', other === card)
      );
    };

    card.addEventListener('mouseenter', setActive);
    card.addEventListener('focusin', setActive);

    const clearActiveIfLeaving = evt => {
      // For mouseleave we always clear; for focusout only clear if focus
      // actually moved outside the card.
      if (evt.type === 'mouseleave' || !card.contains(evt.relatedTarget)) {
        card.classList.remove('project-card--active');
      }
    };

    card.addEventListener('mouseleave', clearActiveIfLeaving);
    card.addEventListener('focusout', clearActiveIfLeaving);
  });

  closeEls?.forEach(el => {
    el.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', evt => {
    if (evt.target instanceof HTMLElement && evt.target.hasAttribute('data-modal-close')) {
      closeModal();
    }
  });

  window.addEventListener('keydown', evt => {
    if (evt.key === 'Escape') {
      closeModal();
    }
  });
};

const initOrbitPanel = () => {
  const nodes = document.querySelectorAll('.hero-orbit-node');
  const panel = document.querySelector('[data-orbit-panel]');
  const panelTitle = panel?.querySelector('[data-orbit-panel-title]');
  const panelBody = panel?.querySelector('[data-orbit-panel-body]');

  if (!nodes.length || !panel || !panelTitle || !panelBody) return;

  const showFor = node => {
    const key = node.getAttribute('data-orbit-node');
    if (!key || !(key in orbitDescriptions)) return;
    const desc = orbitDescriptions[key];
    panelTitle.textContent = desc.title;
    panelBody.textContent = desc.body;
    panel.setAttribute('data-visible', 'true');
  };

  const hide = () => {
    panel.setAttribute('data-visible', 'false');
  };

  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => showFor(node));
    node.addEventListener('focus', () => showFor(node));
    node.addEventListener('mouseleave', hide);
    node.addEventListener('blur', hide);
  });
};

const initSliders = () => {
  const summary = document.querySelector('[data-slider-summary]');
  if (!summary) return;

  const sliders = document.querySelectorAll('[data-play-slider]');
  const updateSummary = () => {
    let clarity = 80;
    let play = 65;
    let speed = 90;

    sliders.forEach(slider => {
      const val = clamp(Number(slider.value) || 0, 0, 100);
      const key = slider.getAttribute('data-play-slider');
      if (key === 'clarity') clarity = val;
      if (key === 'play') play = val;
      if (key === 'speed') speed = val;
    });

    if (clarity >= 75 && play >= 60 && speed >= 80) {
      summary.textContent =
        'This interface is tuned for quick insight with a playful edge — ideal for busy teams who still care about craft.';
    } else if (clarity >= 75 && play < 50) {
      summary.textContent =
        'Here, clarity is prioritized above all else — a good fit for critical workflows and decision-heavy contexts.';
    } else if (play >= 75) {
      summary.textContent =
        'This configuration leans into delight and discovery — best used for exploratory or learning-focused experiences.';
    } else {
      summary.textContent =
        'These settings suggest a balanced experience, ready to adjust based on your team and users.';
    }
  };

  sliders.forEach(slider => slider.addEventListener('input', updateSummary));
  updateSummary();
};

const playWarp = () => {
  const warp = document.querySelector('.page-warp');
  if (!warp) return;

  // Restart animation
  warp.classList.remove('page-warp--active');
  // Force reflow
  void warp.offsetWidth;

  warp.classList.add('page-warp--active');
  warp.addEventListener(
    'animationend',
    () => {
      document.body.dataset.pageReady = 'true';
      warp.classList.remove('page-warp--active');
      const evt = new Event('page-ready');
      document.dispatchEvent(evt);
    },
    { once: true }
  );
};

const initIntroGate = () => {
  const intro = document.querySelector('[data-intro]');
  if (!intro) return;

  const enterButtons = intro.querySelectorAll('[data-intro-enter]');
  const tiles = intro.querySelectorAll('.intro-album-tile');

  tiles.forEach(tile => {
    let currentDuration = 18;
    let rafId;

    const step = () => {
      currentDuration = Math.max(6, currentDuration - 0.05);
      tile.style.setProperty('--tile-orbit-duration', `${currentDuration}s`);
      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (rafId) return;
      currentDuration = 18;
      tile.style.setProperty('--tile-orbit-duration', `${currentDuration}s`);
      tile.classList.add('intro-album-tile--active');
      rafId = requestAnimationFrame(step);
    };

    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = undefined;
      }
      tile.classList.remove('intro-album-tile--active');
      tile.style.removeProperty('--tile-orbit-duration');
    };

    tile.addEventListener('mouseenter', start);
    tile.addEventListener('focus', start);
    tile.addEventListener('mouseleave', stop);
    tile.addEventListener('blur', stop);
  });

  const completeIntro = () => {
    if (document.body.dataset.introComplete === 'true') return;
    document.body.dataset.introComplete = 'true';

    playWarp();

    intro.classList.add('intro-gate--closing');

    const handleEnd = () => {
      intro.remove();
    };

    intro.addEventListener('animationend', handleEnd, { once: true });
  };

  enterButtons.forEach(btn => {
    btn.addEventListener('click', completeIntro);
  });
};

const initRevealOnScroll = () => {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('reveal--visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.2
    }
  );

  revealEls.forEach(el => observer.observe(el));
};

const initHeroBigbang = () => {
  const shell = document.querySelector('[data-page-shell]');
  const bigbang = document.querySelector('.hero-bigbang');
  if (!shell || !bigbang) return;

  let idleTimer;

  const schedule = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      bigbang.classList.add('hero-bigbang--active');
      bigbang.addEventListener(
        'animationend',
        () => {
          bigbang.classList.remove('hero-bigbang--active');
          playWarp();
        },
        { once: true }
      );
    }, 120000); // Trigger big bang after 2 minutes of idle time
  };

  ['mousemove', 'keydown', 'scroll', 'click'].forEach(evt =>
    document.addEventListener(evt, schedule, { passive: true })
  );

  // Start once page is ready
  if (document.body.dataset.pageReady === 'true') {
    schedule();
  } else {
    document.addEventListener(
      'page-ready',
      () => {
        schedule();
      },
      { once: true }
    );
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  const modeToggle = document.querySelector('.mode-toggle');
  modeToggle?.addEventListener('click', toggleTheme);

  initNav();
  initScrollButtons();
  initParallaxCanvas();
  initProjectModal();
  initSliders();
  initIntroGate();
  initOrbitPanel();
  initRevealOnScroll();
  initHeroBigbang();
});


