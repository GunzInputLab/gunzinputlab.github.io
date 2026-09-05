(() => {
  const html = document.documentElement;
  const languageSelect = document.getElementById('languageSelect');
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const topNav = document.getElementById('topNav');
  const originals = new Map();
  const translationNodes = [...document.querySelectorAll('[data-i18n], [data-i18n-html]')];
  const variantMap = { 'es-PE': 'es', 'es-VE': 'es' };
  const titleMap = {
    en: document.title,
    es: document.title.includes('Notebook') ? 'Rapid Trigger para GunZ — Cuaderno de investigación' : 'Rapid Trigger para GunZ — Método completo de ajuste',
    'pt-BR': document.title.includes('Notebook') ? 'Rapid Trigger para GunZ — Caderno de pesquisa' : 'Rapid Trigger para GunZ — Método completo de ajuste',
    ko: document.title.includes('Notebook') ? 'GunZ용 Rapid Trigger — 연구 노트북' : 'GunZ용 Rapid Trigger — 전체 입력 조정 방법',
    ja: document.title.includes('Notebook') ? 'GunZ向けRapid Trigger — 研究ノート' : 'GunZ向けRapid Trigger — 完全入力調整法',
    'zh-CN': document.title.includes('Notebook') ? 'GunZ Rapid Trigger — 研究笔记' : 'GunZ Rapid Trigger — 完整输入调校方法'
  };
  const heroHtml = {
    heroTitle: {
      en: 'Tune the whole<br><span>input chain.</span>',
      es: 'Afina toda la<br><span>cadena de entrada.</span>',
      'pt-BR': 'Ajuste toda a<br><span>cadeia de entrada.</span>',
      ko: '전체 입력 체인을<br><span>조정하세요.</span>',
      ja: '入力チェーン全体を<br><span>調整する。</span>',
      'zh-CN': '调校完整的<br><span>输入链。</span>'
    },
    nbTitle: {
      en: 'The keyboard was<br><span>only half the test.</span>',
      es: 'El teclado era<br><span>solo la mitad de la prueba.</span>',
      'pt-BR': 'O teclado era<br><span>apenas metade do teste.</span>',
      ko: '키보드는<br><span>테스트의 절반뿐이었습니다.</span>',
      ja: 'キーボードは<br><span>テストの半分にすぎなかった。</span>',
      'zh-CN': '键盘只是<br><span>测试的一半。</span>'
    }
  };

  translationNodes.forEach(node => {
    originals.set(node, node.hasAttribute('data-i18n-html') ? node.innerHTML : node.textContent);
  });

  function applyLanguage(requested) {
    const selected = requested || 'en';
    const locale = variantMap[selected] || selected;
    const dictionary = (window.GIL_TRANSLATIONS || {})[locale] || {};
    html.lang = selected;
    if (languageSelect) languageSelect.value = selected;
    translationNodes.forEach(node => {
      const key = node.dataset.i18n || node.dataset.i18nHtml;
      if (selected === 'en') {
        if (node.hasAttribute('data-i18n-html')) node.innerHTML = originals.get(node);
        else node.textContent = originals.get(node);
        return;
      }
      if (heroHtml[key]?.[locale]) {
        node.innerHTML = heroHtml[key][locale];
      } else if (dictionary[key]) {
        node.textContent = dictionary[key];
      }
    });
    document.title = titleMap[locale] || titleMap.en;
    localStorage.setItem('gil-language', selected);
  }

  const savedTheme = localStorage.getItem('gil-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') html.dataset.theme = savedTheme;
  themeToggle?.addEventListener('click', () => {
    const next = html.dataset.theme === 'light' ? 'dark' : 'light';
    html.dataset.theme = next;
    localStorage.setItem('gil-theme', next);
    themeToggle.setAttribute('aria-label', next === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  });
  languageSelect?.addEventListener('change', event => applyLanguage(event.target.value));
  menuToggle?.addEventListener('click', () => {
    const open = topNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  topNav?.addEventListener('click', event => {
    if (event.target.closest('a')) {
      topNav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  const railLinks = [...document.querySelectorAll('.chapter-rail > a[href^="#"]')];
  const railTargets = railLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (railTargets.length) {
    const railObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      railLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, .05, .2] });
    railTargets.forEach(target => railObserver.observe(target));
  }

  const currentDpi = document.getElementById('currentDpi');
  const currentSens = document.getElementById('currentSens');
  const newDpi = document.getElementById('newDpi');
  const edpiOutput = document.getElementById('edpiOutput');
  const sensOutput = document.getElementById('sensOutput');
  function updateConverter() {
    if (!currentDpi || !currentSens || !newDpi) return;
    const dpi = Number(currentDpi.value);
    const sens = Number(currentSens.value);
    const target = Number(newDpi.value);
    if (!(dpi > 0) || !(sens >= 0) || !(target > 0)) {
      edpiOutput.textContent = '—';
      sensOutput.textContent = '—';
      return;
    }
    const edpi = dpi * sens;
    const equivalent = edpi / target;
    edpiOutput.textContent = new Intl.NumberFormat().format(edpi);
    sensOutput.textContent = `${equivalent.toLocaleString(undefined, { maximumFractionDigits: 2 })} (≈ ${Math.round(equivalent).toLocaleString()})`;
  }
  [currentDpi, currentSens, newDpi].forEach(input => input?.addEventListener('input', updateConverter));
  updateConverter();

  const termDialog = document.getElementById('termDialog');
  const termDialogTitle = document.getElementById('termDialogTitle');
  const termDialogBody = document.getElementById('termDialogBody');
  const termDialogLink = document.getElementById('termDialogLink');
  let termReturnFocus = null;
  document.querySelectorAll('[data-term-target]').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.termTarget);
      const summary = target?.querySelector('summary');
      const definition = target?.querySelector('.definition-body');
      if (!termDialog || !summary || !definition) return;
      termReturnFocus = button;
      termDialogTitle.textContent = summary.textContent.trim();
      termDialogBody.replaceChildren(definition.cloneNode(true));
      termDialogLink.href = `#${target.id}`;
      termDialog.showModal();
    });
  });
  termDialog?.addEventListener('close', () => termReturnFocus?.focus());
  termDialog?.addEventListener('click', event => {
    if (event.target === termDialog) termDialog.close();
  });
  termDialogLink?.addEventListener('click', event => {
    const target = document.querySelector(termDialogLink.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.open = true;
    termDialog.close();
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('printNotebook')?.addEventListener('click', () => window.print());
  applyLanguage(localStorage.getItem('gil-language') || 'en');
})();
