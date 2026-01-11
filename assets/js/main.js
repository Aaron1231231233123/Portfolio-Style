const themeKey = 'djs-portfolio-theme';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

let showInlineAlert;

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

const initInlineAlert = () => {
  const modal = document.querySelector('.alert-modal');
  if (!modal) return;

  const labelEl = modal.querySelector('[data-alert-label]');
  const messageEl = modal.querySelector('[data-alert-message]');
  const closeEls = modal.querySelectorAll('[data-alert-close]');

  let lastActiveElement = null;

  const close = () => {
    modal.setAttribute('aria-hidden', 'true');
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  showInlineAlert = (message, tone = 'info') => {
    lastActiveElement = document.activeElement;
    if (labelEl) {
      labelEl.textContent = tone === 'error' ? 'Something went wrong' : 'Heads up';
    }
    if (messageEl) {
      messageEl.textContent = message;
    }

    modal.setAttribute('aria-hidden', 'false');

    const primaryButton = modal.querySelector('[data-alert-close]');
    if (primaryButton instanceof HTMLElement) {
      primaryButton.focus();
    }
  };

  closeEls.forEach(el => {
    el.addEventListener('click', () => close());
  });

  modal.addEventListener('click', evt => {
    if (evt.target instanceof HTMLElement && evt.target.hasAttribute('data-alert-close')) {
      close();
    }
  });

  window.addEventListener('keydown', evt => {
    if (evt.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      close();
    }
  });
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

const skillDescriptions = {
  js: {
    title: 'Creative JavaScript',
    body:
      'I use JavaScript and TypeScript to stitch together motion, state, and storytelling — from micro-interactions to full experiences and data visualizations.',
    meta: [
      'Orbit: Core',
      'Used in: Experience Lab, People Radar, Creator Journey',
      'Libraries: Canvas, SVG, WebGL experiments'
    ]
  },
  css: {
    title: 'CSS & motion systems',
    body:
      'Custom keyframes, layered gradients, and variable-driven themes let me express personality while keeping everything performant.',
    meta: ['Orbit: Core', 'Used for: Hero orbits, page warp, interaction playground']
  },
  frontend: {
    title: 'Frontend architecture',
    body:
      'I design components, layout systems, and interaction patterns that scale from a single page to entire design systems.',
    meta: ['Orbit: Collaborator', 'Focus: Accessibility, semantics, state modeling']
  },
  backend: {
    title: 'Python, AI & APIs',
    body:
      'I use Python for data pipelines, AI workflows, and tiny backend services — from FastAPI endpoints to scripts that glue models and visualizations into interfaces.',
    meta: [
      'Orbit: Collaborator',
      'Comfort: Python, FastAPI/Flask, REST',
      'Tools: NumPy, pandas, Matplotlib, Plotly, AI SDKs'
    ]
  },
  design: {
    title: 'Product & interaction design',
    body:
      'Before writing code, I map flows, storyboards, and interaction states so the final interface feels inevitable rather than accidental.',
    meta: ['Orbit: Frontier', 'Used for: Framing projects and aligning with teams']
  },
  research: {
    title: 'HCI & qualitative research',
    body:
      'I borrow methods from HCI and UX research to observe how people actually move through systems, then reflect that back into the design.',
    meta: ['Orbit: Frontier', 'Methods: Think-aloud, diary studies, rapid experiments']
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
  const visual = document.querySelector('.hero-orbit-visual');

  if (!nodes.length || !panel || !panelTitle || !panelBody) return;

  const order = ['craft', 'empathy', 'systems', 'motion'];
  let autoIndex = 0;
  let autoTimer = null;
  let userInteracting = false;

  const setActiveKey = key => {
    if (!key || !(key in orbitDescriptions)) return;
    const desc = orbitDescriptions[key];

    panelTitle.textContent = desc.title;
    panelBody.textContent = desc.body;

    nodes.forEach(node => {
      const nodeKey = node.getAttribute('data-orbit-node');
      const isActive = nodeKey === key;
      node.classList.toggle('hero-orbit-node--active', isActive);
    });

    if (visual instanceof HTMLElement) {
      visual.setAttribute('data-orbit-active', key);
    }
  };

  const startAutoCycle = () => {
    if (autoTimer) return;
    autoTimer = window.setInterval(() => {
      if (userInteracting) return;
      autoIndex = (autoIndex + 1) % order.length;
      setActiveKey(order[autoIndex]);
    }, 7000);
  };

  const stopAutoCycle = () => {
    if (!autoTimer) return;
    window.clearInterval(autoTimer);
    autoTimer = null;
  };

  nodes.forEach(node => {
    const activateFromNode = () => {
      const key = node.getAttribute('data-orbit-node');
      if (!key) return;
      userInteracting = true;
      stopAutoCycle();
      autoIndex = Math.max(
        0,
        order.findIndex(entry => entry === key)
      );
      setActiveKey(key);
    };

    const releaseInteraction = () => {
      userInteracting = false;
      startAutoCycle();
    };

    node.addEventListener('mouseenter', activateFromNode);
    node.addEventListener('focus', activateFromNode);
    node.addEventListener('mouseleave', releaseInteraction);
    node.addEventListener('blur', releaseInteraction);
  });

  // Initialize with Craft (or whatever the first orbit is) and begin idle cycling.
  setActiveKey(order[autoIndex]);
  startAutoCycle();
};

const initSkillsOrbit = () => {
  const nodes = document.querySelectorAll('.skills-orbit-node');
  const titleEl = document.querySelector('[data-skill-title]');
  const bodyEl = document.querySelector('[data-skill-body]');
  const metaEl = document.querySelector('[data-skill-meta]');
  const shell = document.querySelector('.skills-orbit-visual');

  if (!nodes.length || !titleEl || !bodyEl || !metaEl || !shell) return;

  const order = ['js', 'css', 'frontend', 'backend', 'design', 'research'];
  let currentIndex = 0;
  const idleDelay = 2000; // wait 2s after last hover/leave
  const autoPeriod = 9000; // slow auto transition
  let lastHoverAt = Date.now();
  let lastAutoChangeAt = Date.now();
  let isPointerOverShell = false;

  const renderMeta = meta => {
    metaEl.innerHTML = '';
    meta.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      metaEl.appendChild(li);
    });
  };

  const setActiveSkill = (key, fromUser = false) => {
    const desc = skillDescriptions[key];
    if (!desc) return;

    titleEl.textContent = desc.title;
    bodyEl.textContent = desc.body;
    renderMeta(desc.meta);

    nodes.forEach(node => {
      const nodeKey = node.getAttribute('data-skill-key');
      node.classList.toggle('skills-orbit-node--active', nodeKey === key);
    });

    if (fromUser) {
      lastHoverAt = Date.now();
      lastAutoChangeAt = Date.now();
    }
  };

  const setActiveByIndex = (index, fromUser = false) => {
    currentIndex = (index + order.length) % order.length;
    setActiveSkill(order[currentIndex], fromUser);
  };

  // Idle auto-cycler: only runs when pointer is away for at least idleDelay,
  // and changes skills no faster than autoPeriod.
  const tick = () => {
    const now = Date.now();
    if (!isPointerOverShell) {
      const idleFor = now - lastHoverAt;
      const sinceAuto = now - lastAutoChangeAt;
      if (idleFor >= idleDelay && sinceAuto >= autoPeriod) {
        setActiveByIndex(currentIndex + 1, false);
        lastAutoChangeAt = now;
      }
    } else {
      // Keep resetting idle timer while pointer is over the shell.
      lastHoverAt = now;
    }

    requestAnimationFrame(tick);
  };

  nodes.forEach(node => {
    const handleActivate = () => {
      const key = node.getAttribute('data-skill-key');
      if (!key) return;
      const idx = order.findIndex(k => k === key);
      if (idx !== -1) {
        setActiveByIndex(idx, true);
      } else {
        setActiveSkill(key, true);
      }
    };

    node.addEventListener('mouseenter', handleActivate);
    node.addEventListener('focus', handleActivate);
  });

  shell.addEventListener('mouseenter', () => {
    isPointerOverShell = true;
    lastHoverAt = Date.now();
  });

  shell.addEventListener('mouseleave', () => {
    isPointerOverShell = false;
    lastHoverAt = Date.now();
  });

  // Initialize with Product & interaction design as the default focus
  // and start the idle auto-cycler.
  currentIndex = order.indexOf('design');
  if (currentIndex < 0) currentIndex = 0;
  setActiveByIndex(currentIndex, false);
  tick();
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

const initImagePlayground = () => {
  const stage = document.querySelector('[data-image-stage]');
  const figure = document.querySelector('[data-image-figure]');
  const img = document.querySelector('[data-playground-image]');
  const modeButtons = document.querySelectorAll('[data-hover-mode]');
  const intensityInput = document.querySelector('[data-image-intensity]');
  const uploadInput = document.querySelector('[data-image-upload]');
  const urlInput = document.querySelector('[data-image-url]');
  const useUrlButton = document.querySelector('[data-image-use-url]');
  const downloadButton = document.querySelector('[data-image-download]');
  const caption = document.querySelector('[data-image-caption]');
  const hint = document.querySelector('[data-image-hint]');
  const modeDescription = document.querySelector('[data-image-mode-description]');
  const mixButtons = document.querySelectorAll('[data-effect-layer]');
  const mixCaption = document.querySelector('[data-image-mix-caption]');

  if (!stage || !figure || !img || !intensityInput) return;

  let currentMode = 'orbit';
  let intensity = Number(intensityInput.value) || 65;
  let canvasFilter = 'none';
  let tiltActive = false;
  let activeLayers = [];

  const modeCopy = {
    orbit: 'Orbit glow — a cinematic halo that keeps attention anchored on the subject.',
    glitch: 'Soft glitch — subtle jitter and color shifts for a restless, high-energy feeling.',
    tilt:
      'Parallax tilt — the image leans with your pointer or arrow keys, like a physical card in your hand.',
    liquid:
      'Liquid bloom — edges melt and bloom, turning the image into a soft, dreamy portal.',
    scan:
      'Scanlines — a retro display treatment that makes the whole frame feel like a living monitor.',
    chromatic:
      'Chromatic drift — cyan and magenta halos leak from the highlights, hinting at motion and depth.',
    mono:
      'Noir focus — drained color and heavier contrast, like a still pulled from a graphic novel.'
  };

  const setMode = mode => {
    currentMode = mode;
    figure.classList.remove(
      'image-playground-figure--orbit',
      'image-playground-figure--glitch',
      'image-playground-figure--tilt',
      'image-playground-figure--liquid',
      'image-playground-figure--scan',
      'image-playground-figure--chromatic',
      'image-playground-figure--mono'
    );
    figure.classList.add(`image-playground-figure--${mode}`);

    modeButtons.forEach(btn =>
      btn.classList.toggle('is-active', btn.getAttribute('data-hover-mode') === mode)
    );

    if (hint) {
      if (mode === 'tilt') {
        hint.textContent = 'Move your cursor or use the arrow keys to tilt the image.';
      } else if (mode === 'glitch') {
        hint.textContent = 'Hover to trigger a soft glitch pulse. Drag to exaggerate it.';
      } else if (mode === 'liquid') {
        hint.textContent = 'Hover and adjust intensity to melt the edges into a liquid bloom.';
      } else if (mode === 'scan') {
        hint.textContent = 'Hover to reveal scanlines, like an old display trying to keep up.';
      } else if (mode === 'chromatic') {
        hint.textContent = 'Hover to pull cyan and magenta halos off the brightest edges.';
      } else if (mode === 'mono') {
        hint.textContent = 'Use this to check how the composition reads when color is almost gone.';
      } else {
        hint.textContent = 'Hover, drag, or press keys 1–7 to cycle the interaction recipes.';
      }
    }

    if (modeDescription) {
      modeDescription.textContent = modeCopy[mode] || '';
    }

    applyVisuals();
  };

  const applyVisuals = () => {
    const level = clamp(intensity, 0, 100) / 100;
    const filterParts = [];
    let scale = 1 + 0.06 * level;
    let glow = 0.35 + 0.65 * level;

    if (currentMode === 'orbit') {
      filterParts.push(`saturate(${1 + 0.7 * level})`);
      filterParts.push(`contrast(${1 + 0.2 * level})`);
    } else if (currentMode === 'glitch') {
      const hue = 20 + 80 * level;
      filterParts.push(`contrast(${1.15 + 0.6 * level})`);
      filterParts.push(`saturate(${1.4 + level})`);
      filterParts.push(`hue-rotate(${hue}deg)`);
      scale = 1 + 0.04 * level;
    } else if (currentMode === 'tilt') {
      filterParts.push(`saturate(${1 + 0.5 * level})`);
      scale = 1 + 0.03 * level;
    } else if (currentMode === 'liquid') {
      const blur = (level * 4).toFixed(2);
      filterParts.push(`saturate(${1.3 + 0.7 * level})`);
      filterParts.push(`blur(${blur}px)`);
      scale = 1 + 0.08 * level;
    }

    // Layer contributions (mix up to 3 extras)
    if (activeLayers.includes('scan')) {
      const brightness = 1.02 + 0.18 * level;
      const contrast = 1.05 + 0.28 * level;
      filterParts.push(`brightness(${brightness})`);
      filterParts.push(`contrast(${contrast})`);
      filterParts.push(`saturate(${0.9 + 0.3 * level})`);
    }

    if (activeLayers.includes('chromatic')) {
      const hueOverlay = 6 + 14 * level;
      filterParts.push(`saturate(${1.2 + 0.5 * level})`);
      filterParts.push(`contrast(${1.03 + 0.25 * level})`);
      filterParts.push(`hue-rotate(${hueOverlay}deg)`);
    }

    if (activeLayers.includes('mono')) {
      const grayscale = 0.4 + 0.4 * level;
      const contrast = 1.1 + 0.35 * level;
      filterParts.push(`grayscale(${grayscale})`);
      filterParts.push(`contrast(${contrast})`);
    }

    if (activeLayers.includes('grain')) {
      filterParts.push(`contrast(${1.02 + 0.12 * level})`);
    }

    if (activeLayers.includes('vignette')) {
      filterParts.push(`brightness(${0.98 - 0.12 * level})`);
    }

    const filter = filterParts.length ? filterParts.join(' ') : 'none';

    figure.style.setProperty('--img-scale', String(scale));
    figure.style.setProperty('--img-glow', String(glow));
    figure.style.setProperty('--img-filter', filter);
    canvasFilter = filter;
  };

  const updateMixCaption = () => {
    if (!mixCaption) return;
    if (!activeLayers.length) {
      mixCaption.textContent = 'Toggle up to three chips to layer extras on top of the base recipe.';
      return;
    }
    const names = activeLayers.join(', ');
    mixCaption.textContent = `Currently stacking: ${names} (${activeLayers.length}/3). Click again to remove.`;
  };

  const syncLayersToFigure = () => {
    const allLayerClasses = [
      'image-layer--scan',
      'image-layer--chromatic',
      'image-layer--mono',
      'image-layer--grain',
      'image-layer--vignette'
    ];
    allLayerClasses.forEach(cls => figure.classList.remove(cls));
    activeLayers.forEach(id => {
      figure.classList.add(`image-layer--${id}`);
    });
  };

  const toggleLayer = id => {
    const existingIndex = activeLayers.indexOf(id);
    if (existingIndex !== -1) {
      activeLayers.splice(existingIndex, 1);
    } else {
      if (activeLayers.length >= 3) {
        // Remove the oldest layer to make space for the new one
        activeLayers.shift();
      }
      activeLayers.push(id);
    }

    mixButtons.forEach(btn => {
      const layerId = btn.getAttribute('data-effect-layer');
      btn.classList.toggle('is-active', !!layerId && activeLayers.includes(layerId));
    });

    syncLayersToFigure();
    updateMixCaption();
    applyVisuals();
  };

  const handlePointerMove = evt => {
    const rect = stage.getBoundingClientRect();
    const x = (evt.clientX - rect.left) / rect.width - 0.5;
    const y = (evt.clientY - rect.top) / rect.height - 0.5;

    const maxTilt = currentMode === 'tilt' ? 18 : 8;
    const tiltX = clamp(-x * maxTilt, -maxTilt, maxTilt);
    const tiltY = clamp(y * maxTilt, -maxTilt, maxTilt);
    figure.style.setProperty('--tilt-x', `${tiltX}deg`);
    figure.style.setProperty('--tilt-y', `${tiltY}deg`);
    tiltActive = true;
  };

  const resetTilt = () => {
    if (!tiltActive) return;
    figure.style.setProperty('--tilt-x', '0deg');
    figure.style.setProperty('--tilt-y', '0deg');
    tiltActive = false;
  };

  stage.addEventListener('pointermove', handlePointerMove);
  stage.addEventListener('pointerleave', resetTilt);

  intensityInput.addEventListener('input', () => {
    intensity = Number(intensityInput.value) || 65;
    applyVisuals();
  });

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-hover-mode');
      if (mode) setMode(mode);
    });
  });

  mixButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-effect-layer');
      if (!id) return;
      toggleLayer(id);
    });
  });

  stage.addEventListener('keydown', evt => {
    if (evt.key === '1') setMode('orbit');
    if (evt.key === '2') setMode('glitch');
    if (evt.key === '3') setMode('tilt');
    if (evt.key === '4') setMode('liquid');
    if (evt.key === '5') setMode('scan');
    if (evt.key === '6') setMode('chromatic');
    if (evt.key === '7') setMode('mono');

    if (currentMode === 'tilt') {
      const step = 4;
      if (evt.key === 'ArrowLeft') {
        evt.preventDefault();
        const current = parseFloat(getComputedStyle(figure).getPropertyValue('--tilt-x')) || 0;
        figure.style.setProperty('--tilt-x', `${clamp(current - step, -18, 18)}deg`);
      }
      if (evt.key === 'ArrowRight') {
        evt.preventDefault();
        const current = parseFloat(getComputedStyle(figure).getPropertyValue('--tilt-x')) || 0;
        figure.style.setProperty('--tilt-x', `${clamp(current + step, -18, 18)}deg`);
      }
      if (evt.key === 'ArrowUp') {
        evt.preventDefault();
        const current = parseFloat(getComputedStyle(figure).getPropertyValue('--tilt-y')) || 0;
        figure.style.setProperty('--tilt-y', `${clamp(current - step, -18, 18)}deg`);
      }
      if (evt.key === 'ArrowDown') {
        evt.preventDefault();
        const current = parseFloat(getComputedStyle(figure).getPropertyValue('--tilt-y')) || 0;
        figure.style.setProperty('--tilt-y', `${clamp(current + step, -18, 18)}deg`);
      }
    }
  });

  if (uploadInput) {
    uploadInput.addEventListener('change', () => {
      const file = uploadInput.files && uploadInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          img.src = reader.result;
          if (caption) {
            caption.textContent =
              'Using your uploaded image. Try different recipes and save a PNG of this moment.';
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (useUrlButton && urlInput) {
    useUrlButton.addEventListener('click', () => {
      const value = urlInput.value.trim();
      if (!value) return;
      img.src = value;
      if (caption) {
        caption.textContent =
          'Using a remote image. Animated GIFs keep moving; saved PNG will capture the current frame with filters.';
      }
    });
  }

  if (downloadButton) {
    let downloadCanvas;
    downloadButton.addEventListener('click', () => {
      if (!img.complete || !img.naturalWidth || !img.naturalHeight) return;

      downloadCanvas = downloadCanvas || document.createElement('canvas');
      downloadCanvas.width = img.naturalWidth;
      downloadCanvas.height = img.naturalHeight;
      const ctx = downloadCanvas.getContext('2d');
      if (!ctx) return;

      try {
        ctx.clearRect(0, 0, downloadCanvas.width, downloadCanvas.height);
        ctx.filter = canvasFilter || 'none';
        ctx.drawImage(img, 0, 0, downloadCanvas.width, downloadCanvas.height);
        const dataUrl = downloadCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'interaction-playground.png';
        link.click();
        if (typeof showInlineAlert === 'function') {
          showInlineAlert(
            'Saved a PNG of the current frame with your current effects. Check your downloads folder.',
            'info'
          );
        } else if (caption) {
          caption.textContent = 'PNG saved. You just captured a tiny moment from this orbit.';
        }
      } catch (err) {
        const message =
          'Your browser blocked saving this URL for security reasons. Upload the image directly to save it.';
        if (typeof showInlineAlert === 'function') {
          showInlineAlert(message, 'error');
        } else if (caption) {
          caption.textContent = message;
        }
      }
    });
  }

  // Initialize with default mode visuals.
  setMode(currentMode);
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
  initImagePlayground();
  initInlineAlert();
  initIntroGate();
  initOrbitPanel();
  initSkillsOrbit();
  initRevealOnScroll();
  initHeroBigbang();
});


