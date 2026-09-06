(() => {
  const doc = document;
  const root = doc.documentElement;
  const isNotebook = doc.body.classList.contains('notebook-page');
  const select = doc.getElementById('languageSelect');
  const themeButton = doc.getElementById('themeToggle');
  const menuButton = doc.getElementById('menuToggle');
  const nav = doc.getElementById('guideNav') || doc.getElementById('notebookSidebar');
  const progress = doc.getElementById('progressFill');
  const pageIndicator = doc.getElementById('pageIndicator');
  const banner = doc.getElementById('sectionBanner');
  const bannerPage = doc.getElementById('bannerPage');
  const bannerTitle = doc.getElementById('bannerTitle');
  const backToTop = doc.getElementById('backToTop');
  const returnButton = doc.getElementById('returnToReading');
  const originalText = new Map();
  const translatable = [...doc.querySelectorAll('[data-i18n], [data-i18n-html]')];
  const localeParent = { 'es-PE': 'es', 'es-VE': 'es' };

  translatable.forEach(node => originalText.set(node, node.hasAttribute('data-i18n-html') ? node.innerHTML : node.textContent));

  function setLanguage(requested) {
    const chosen = requested || 'en';
    const locale = localeParent[chosen] || chosen;
    const dictionary = window.GIL_TRANSLATIONS?.[locale] || {};
    root.lang = chosen;
    if (select) select.value = chosen;
    translatable.forEach(node => {
      const key = node.dataset.i18n || node.dataset.i18nHtml;
      const value = chosen === 'en' ? originalText.get(node) : dictionary[key];
      if (value == null) return;
      if (node.hasAttribute('data-i18n-html')) node.innerHTML = value;
      else node.textContent = value;
    });
    const titles = window.GIL_TITLES?.[locale];
    if (titles) doc.title = isNotebook ? titles.notebook : titles.guide;
    localStorage.setItem('gil-language', chosen);
  }

  const savedTheme = localStorage.getItem('gil-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  function updateThemeLabel() {
    if (!themeButton) return;
    themeButton.textContent = root.dataset.theme === 'light' ? 'Dark' : 'Light';
  }
  updateThemeLabel();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('gil-theme', root.dataset.theme);
    updateThemeLabel();
  });
  select?.addEventListener('change', event => setLanguage(event.target.value));

  menuButton?.addEventListener('click', () => {
    const open = doc.body.classList.toggle('nav-open');
    menuButton.setAttribute('aria-expanded', String(Boolean(open)));
  });
  nav?.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    doc.body.classList.remove('nav-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });

  const publicSections = [...doc.querySelectorAll('.tracked-section')];
  const notebookSections = [...doc.querySelectorAll('.notebook-entry')];
  const sections = publicSections.length ? publicSections : notebookSections;
  const navLinks = [...doc.querySelectorAll('.guide-nav > a[href^="#"], .notebook-nav a[href^="#"]')];
  let currentSection = sections[0] || null;
  let scrollFrame = 0;

  function selectCurrentSection() {
    if (!sections.length) return;
    const readingLine = isNotebook ? Math.max(90, innerHeight * .24) : Math.max(110, innerHeight * .28);
    let selected = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= readingLine) selected = section;
      else break;
    }
    if (scrollY + innerHeight >= doc.documentElement.scrollHeight - 4) selected = sections.at(-1);
    currentSection = selected;
    navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${selected.id}`));
    const index = sections.indexOf(selected) + 1;
    const page = selected.dataset.page || String(index).padStart(2, '0');
    const title = selected.dataset.title || selected.querySelector('h2')?.textContent?.trim() || 'Research notes';
    if (pageIndicator) pageIndicator.textContent = `Page ${page} / ${String(sections.length).padStart(2, '0')}`;
    if (bannerPage) bannerPage.textContent = `Page ${page}`;
    if (bannerTitle) bannerTitle.textContent = title;
    banner?.classList.toggle('show', scrollY > Math.max(160, innerHeight * .35));
  }

  function updatePage() {
    scrollFrame = 0;
    const maximum = doc.documentElement.scrollHeight - innerHeight;
    const ratio = maximum > 0 ? Math.min(1, Math.max(0, scrollY / maximum)) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
    backToTop?.classList.toggle('show', scrollY > 600);
    selectCurrentSection();
    updateCardShuffle();
  }

  function queuePageUpdate() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updatePage);
  }

  const stackedCards = [...doc.querySelectorAll('.stack-card')];
  function updateCardShuffle() {
    if (!stackedCards.length || matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 901 || innerHeight < 760) {
      stackedCards.forEach(card => {
        card.style.removeProperty('--sticky-scale');
        card.style.removeProperty('--sticky-brightness');
      });
      return;
    }
    const headerOffset = 114;
    stackedCards.forEach((card, index) => {
      card.style.setProperty('--sticky-z', String(20 + index));
      card.style.setProperty('--sticky-top', `${headerOffset + Math.min(index % 3, 2) * 8}px`);
      const distance = Math.max(0, headerOffset - card.getBoundingClientRect().top);
      const amount = Math.min(1, distance / 260);
      card.style.setProperty('--sticky-scale', String(1 - amount * .018));
      card.style.setProperty('--sticky-brightness', String(1 - amount * .13));
    });
  }

  addEventListener('scroll', queuePageUpdate, { passive: true });
  addEventListener('resize', queuePageUpdate);
  navLinks.forEach(link => link.addEventListener('click', () => {
    navLinks.forEach(item => item.classList.toggle('active', item === link));
  }));

  doc.querySelectorAll('a.remember-position').forEach(link => {
    link.addEventListener('click', () => {
      localStorage.setItem('gil-return-url', location.href.split('#')[0]);
      localStorage.setItem('gil-return-scroll', String(scrollY));
    });
  });
  const returnUrl = localStorage.getItem('gil-return-url');
  const returnScroll = Number(localStorage.getItem('gil-return-scroll'));
  if (returnButton && returnUrl && Number.isFinite(returnScroll) && new URL(returnUrl, location.href).pathname !== location.pathname) {
    returnButton.classList.add('show');
    returnButton.addEventListener('click', () => {
      localStorage.setItem('gil-restore-scroll', String(returnScroll));
      location.href = returnUrl;
    });
  }
  const restoreScroll = Number(localStorage.getItem('gil-restore-scroll'));
  if (Number.isFinite(restoreScroll) && restoreScroll > 0) {
    localStorage.removeItem('gil-restore-scroll');
    requestAnimationFrame(() => scrollTo({ top: restoreScroll, behavior: 'smooth' }));
  }

  const definitions = {
    actuation: {
      title: 'Actuation point',
      type: 'Keyboard term',
      plain: 'The fixed depth where a released key reports its first ON while moving downward.',
      gunz: 'It decides when the first direction or action begins.',
      link: isNotebook ? 'index.html#glossary-actuation' : '#glossary-actuation'
    },
    rtd: {
      title: 'RT D · Deactivate',
      type: 'RT D',
      plain: 'The upward distance an active key travels before it reports OFF.',
      gunz: 'It decides how much lift clears the old direction or action.',
      link: isNotebook ? 'index.html#glossary-rtd' : '#glossary-rtd'
    },
    rta: {
      title: 'RT A · Activate',
      type: 'RT A',
      plain: 'The downward distance after reversal before the next ON while Rapid Trigger remains active.',
      gunz: 'It decides how much re-press travel starts the next direction, dash, or repeated action.',
      link: isNotebook ? 'index.html#glossary-rta' : '#glossary-rta'
    },
    pvp: {
      title: 'PvP validation',
      type: 'Guide term',
      plain: 'Testing a training pass against real players, changing pace, and pressure before saving it as preferred.',
      gunz: 'It checks whether the setting stays clean when a real fight changes your rhythm and attention.',
      link: isNotebook ? 'index.html#glossary-pvp' : '#glossary-pvp'
    }
  };
  const panel = doc.getElementById('termPanel');
  const panelTitle = doc.getElementById('termPanelTitle');
  const panelBody = doc.getElementById('termPanelBody');
  const panelLink = doc.getElementById('termPanelLink');
  doc.querySelectorAll('button[data-term]').forEach(button => button.addEventListener('click', () => {
    const item = definitions[button.dataset.term];
    if (!panel || !item) return;
    panel.querySelector('.term-panel-label').textContent = item.type;
    panelTitle.textContent = item.title;
    panelBody.innerHTML = `<h3>Plain-English definition</h3><p>${item.plain}</p><h3>How it applies in GunZ</h3><p>${item.gunz}</p>`;
    panelLink.href = item.link;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
    doc.getElementById('termPanelClose')?.focus({ preventScroll: true });
  }));
  function closeTermPanel() {
    doc.querySelectorAll('button[data-term][aria-expanded="true"]').forEach(button => button.setAttribute('aria-expanded', 'false'));
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }
  doc.getElementById('termPanelClose')?.addEventListener('click', closeTermPanel);
  panelLink?.addEventListener('click', () => {
    const href = panelLink.getAttribute('href') || '';
    const target = href.startsWith('#') ? doc.querySelector(href) : null;
    if (target?.tagName === 'DETAILS') target.open = true;
    closeTermPanel();
  });
  function openHashedDetails() {
    if (!location.hash) return;
    try {
      const target = doc.querySelector(location.hash);
      if (target?.tagName === 'DETAILS') target.open = true;
    } catch (_) { /* Ignore malformed external hashes instead of interrupting the page. */ }
  }
  openHashedDetails();
  addEventListener('hashchange', openHashedDetails);
  addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel?.classList.contains('open')) closeTermPanel();
  });

  doc.getElementById('printNotebook')?.addEventListener('click', () => print());

  const testerFrame = doc.getElementById('cycleTesterFrame');
  addEventListener('message', event => {
    if (event.source !== testerFrame?.contentWindow || event.data?.type !== 'rapid-trigger-tester-height') return;
    const height = Number(event.data.height);
    if (height > 400 && height < 4000) testerFrame.style.height = `${Math.ceil(height)}px`;
  });
  testerFrame?.addEventListener('load', () => {
    try {
      const height = testerFrame.contentDocument?.documentElement?.scrollHeight;
      if (height > 400) testerFrame.style.height = `${height}px`;
    } catch (_) { /* Same-origin in production and local review; fixed CSS height remains as fallback. */ }
  });

  setLanguage(localStorage.getItem('gil-language') || 'en');
  updatePage();
})();
