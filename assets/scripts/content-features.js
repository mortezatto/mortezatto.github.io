/* ---- Heading anchors: adds a hover-to-reveal "#" link to every h2/h3
   inside .content-body, same as the base project's research pages. ---- */
function initHeadingAnchors() {
  var headings = document.querySelectorAll('.content-body h2[id], .content-body h3[id]');
  headings.forEach(function (h) {
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.className = 'heading-anchor';
    a.setAttribute('aria-label', 'Link to this section');
    a.textContent = '#';
    h.appendChild(a);
  });
}

/* ---- Code tabs: click (or arrow-key through) a tab to switch panels. ---- */
function initCodeTabs() {
  document.querySelectorAll('.code-tabs').forEach(function (group) {
    var nav = group.querySelector('.code-tabs-nav');
    var buttons = Array.prototype.slice.call(group.querySelectorAll('.code-tab-btn'));
    var panels = Array.prototype.slice.call(group.querySelectorAll('.code-tabs-panel'));
    if (nav) nav.setAttribute('role', 'tablist');

    var activate = function (btn, focus) {
      var target = btn.dataset.tab;
      buttons.forEach(function (b) {
        var isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
        b.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      panels.forEach(function (p) { p.classList.toggle('active', p.dataset.tab === target); });
      if (focus) btn.focus();
    };

    buttons.forEach(function (btn, i) {
      var panel = panels[i];
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(btn.classList.contains('active')));
      btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
      if (panel) {
        if (!panel.id) panel.id = (group.id || 'code-tabs') + '-panel-' + i;
        btn.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
      }

      btn.addEventListener('click', function () { activate(btn, false); });

      btn.addEventListener('keydown', function (e) {
        var newIndex = null;
        if (e.key === 'ArrowRight') newIndex = (i + 1) % buttons.length;
        else if (e.key === 'ArrowLeft') newIndex = (i - 1 + buttons.length) % buttons.length;
        else if (e.key === 'Home') newIndex = 0;
        else if (e.key === 'End') newIndex = buttons.length - 1;
        if (newIndex !== null) {
          e.preventDefault();
          activate(buttons[newIndex], true);
        }
      });
    });
  });
}

/* ---- Copy button on fenced code blocks (skips mermaid/pseudocode blocks,
   which render as diagrams/typeset algorithms rather than copyable text). ---- */
function initCodeCopy() {
  document.querySelectorAll('.content-body .highlighter-rouge:not(.language-mermaid):not(.language-pseudocode)').forEach(function (block) {
    var codeEl = block.querySelector('code');
    if (!codeEl) return;
    var btn = document.createElement('button');
    btn.className = 'code-copy';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = '<i class="fa-solid fa-copy"></i>';
    btn.addEventListener('click', function () {
      var text = codeEl.textContent.trim();
      var done = function (ok) {
        var original = btn.innerHTML;
        btn.classList.add(ok ? 'copied' : 'copy-failed');
        btn.innerHTML = ok ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
        if (!ok) btn.setAttribute('title', 'Copy failed — select the code manually');
        setTimeout(function () {
          btn.classList.remove('copied', 'copy-failed');
          btn.innerHTML = original;
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }).catch(function () { done(fallbackCopy(text)); });
      } else {
        done(fallbackCopy(text));
      }
    });
    block.style.position = 'relative';
    block.appendChild(btn);
  });
}

function fallbackCopy(text) {
  try {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}

/* ---- Mermaid diagrams: fenced ```mermaid blocks render as SVG. Loaded
   from CDN only when a page actually has a diagram. ---- */
/* ---- Mermaid diagrams: fenced ```mermaid blocks render as SVG, themed
   to match the site's light/dark palette. Loaded from CDN only when a
   page actually has a diagram, and re-rendered when the theme toggles. ---- */
var mermaidSources = [];
var mermaidRenderCount = 0;

function getMermaidThemeConfig() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDark ? {
    theme: 'base',
    themeVariables: {
      primaryColor: '#101B29',
      primaryBorderColor: '#3DDC97',
      primaryTextColor: '#E7ECF2',
      lineColor: '#3DDC97',
      textColor: '#E7ECF2',
      background: '#070C12',
      fontFamily: 'inherit'
    }
  } : {
    theme: 'base',
    themeVariables: {
      primaryColor: '#EEF2F5',
      primaryBorderColor: '#0D1B2A',
      primaryTextColor: '#0D1B2A',
      lineColor: '#415A77',
      textColor: '#0D1B2A',
      background: '#FFFFFF',
      fontFamily: 'inherit'
    }
  };
}

function renderMermaidDiagrams(mermaid) {
  mermaidRenderCount++;
  var pass = mermaidRenderCount;
  mermaid.initialize(Object.assign({ startOnLoad: false, securityLevel: 'loose' }, getMermaidThemeConfig()));
  mermaidSources.forEach(function (item) {
    var holder = document.getElementById(item.id);
    if (!holder) return;
    mermaid.render(item.id + '-svg-' + pass, item.src).then(function (result) {
      holder.innerHTML = result.svg;
    }).catch(function () {
      holder.innerHTML = '<p class="mermaid-error">Diagram failed to render — check the syntax.</p>';
    });
  });
}

function initMermaid() {
  var blocks = document.querySelectorAll('.content-body .language-mermaid');
  if (!blocks.length) return;

  blocks.forEach(function (block, i) {
    var codeEl = block.tagName === 'CODE' ? block : block.querySelector('code');
    if (!codeEl) return;
    var container = block.tagName === 'CODE' ? (block.closest('pre') || block) : block;
    var holder = document.createElement('div');
    holder.className = 'mermaid-holder';
    holder.id = 'mermaid-diagram-' + i;
    container.replaceWith(holder);
    mermaidSources.push({ id: holder.id, src: codeEl.textContent });
  });
  if (!mermaidSources.length) return;

  import('https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs')
    .then(function (mod) {
      var mermaid = mod.default;
      renderMermaidDiagrams(mermaid);
      document.addEventListener('themechange', function () {
        renderMermaidDiagrams(mermaid);
      });
    })
    .catch(function () {
      mermaidSources.forEach(function (item) {
        var holder = document.getElementById(item.id);
        if (holder) holder.innerHTML = '<p class="mermaid-error">Diagram library failed to load — check your internet connection.</p>';
      });
    });
}

/* ---- Pseudocode: fenced ```pseudocode blocks with LaTeX algorithmic
   syntax render as a typeset algorithm box. ---- */
function initPseudocode() {
  var blocks = document.querySelectorAll('.content-body .language-pseudocode');
  if (!blocks.length) return;

  var pres = [];
  blocks.forEach(function (block, i) {
    var codeEl = block.tagName === 'CODE' ? block : block.querySelector('code');
    if (!codeEl) return;
    var container = block.tagName === 'CODE' ? (block.closest('pre') || block) : block;
    var pre = document.createElement('pre');
    pre.id = 'pseudocode-' + i;
    pre.textContent = codeEl.textContent.replace(/\$\$/g, '$');
    container.replaceWith(pre);
    pres.push(pre);
  });
  if (!pres.length) return;

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://cdn.jsdelivr.net/npm/pseudocode@2.4.1/build/pseudocode.min.css';
  document.head.appendChild(css);

  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/pseudocode@2.4.1/build/pseudocode.min.js';
  script.onload = function () {
    pres.forEach(function (pre) {
      try {
        window.pseudocode.renderElement(pre, { lineNumber: true, lineNumberPunc: ':' });
      } catch (e) {
        pre.textContent = 'Pseudocode failed to render — check the LaTeX syntax.';
      }
    });
  };
  document.head.appendChild(script);
}

/* ---- Publication abstract / BibTeX toggle (accordion) ---- */
function initAbstractToggles() {
  document.querySelectorAll('.abs-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.dataset.target);
      if (!panel) return;
      var isOpen = panel.classList.toggle('open');
      btn.classList.toggle('is-active', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

/* ---- Copy BibTeX to clipboard ---- */
function initBibCopy() {
  document.querySelectorAll('.bib-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.dataset.copyTarget);
      var text = (target ? target.textContent : '').trim();
      var done = function (ok) {
        var original = btn.innerHTML;
        btn.classList.add(ok ? 'copied' : 'copy-failed');
        btn.innerHTML = ok
          ? '<i class="fa-solid fa-check"></i> copied'
          : '<i class="fa-solid fa-xmark"></i> failed';
        setTimeout(function () {
          btn.classList.remove('copied', 'copy-failed');
          btn.innerHTML = original;
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }).catch(function () { done(fallbackCopy(text)); });
      } else {
        done(fallbackCopy(text));
      }
    });
  });
}

/* ---- Experience accordion ---- */
function initAccordion() {
  document.querySelectorAll('.exp-header').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.exp-item');
      var isOpen = item.getAttribute('data-open') === 'true';
      item.setAttribute('data-open', isOpen ? 'false' : 'true');
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });
}

/* ---- CV section accordion (below 1180px only — see .cv-section in
   main.css; the click handler itself is harmless at any width, since
   toggling data-open has no visual effect until that breakpoint's
   collapse styling applies) ---- */
function initSectionAccordion() {
  document.querySelectorAll('.cv-section > .section-head').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var section = btn.closest('.cv-section');
      var isOpen = section.getAttribute('data-open') === 'true';
      section.setAttribute('data-open', isOpen ? 'false' : 'true');
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });
}

/* ---- Projects page accordion — each project card collapses to a
   compact row (title + one-line summary) and expands into the full
   detail view built from _data/projects_detail.json. ---- */
function initProjectAccordion() {
  document.querySelectorAll('.proj-acc > .proj-collapsed').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.proj-acc');
      var isOpen = card.getAttribute('data-open') === 'true';
      card.setAttribute('data-open', isOpen ? 'false' : 'true');
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });
}

/* ---- Projects page category filter — tabs with zero matching
   projects hide themselves automatically (except "All Projects",
   which always shows), so an empty category never needs removing
   by hand in the template. ---- */
function initProjectFilters() {
  var filters = document.querySelectorAll('.proj-filter');
  var cards = document.querySelectorAll('.proj-acc');
  var emptyMsg = document.getElementById('projFilterEmpty');
  if (!filters.length || !cards.length) return;

  filters.forEach(function (btn) {
    var filter = btn.getAttribute('data-filter');
    if (filter === 'all') return;
    var hasMatch = Array.prototype.some.call(cards, function (card) {
      return card.getAttribute('data-category') === filter;
    });
    if (!hasMatch) btn.hidden = true;
  });

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var filter = btn.getAttribute('data-filter');
      var visibleCount = 0;
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('filtered-out', !match);
        if (match) visibleCount++;
      });
      if (emptyMsg) emptyMsg.hidden = visibleCount > 0;
    });
  });
}

/* ---- Publication search ---- */
function initPubSearch() {
  var input = document.getElementById('pubSearch');
  var list = document.getElementById('pubList');
  var empty = document.getElementById('pubSearchEmpty');
  var count = document.getElementById('pubSearchCount');
  if (!input || !list) return;
  var items = Array.prototype.slice.call(list.querySelectorAll('.pub-full'));
  var total = items.length;

  var filter = function () {
    var q = input.value.trim().toLowerCase();
    var visible = 0;
    items.forEach(function (item) {
      var match = !q || (item.dataset.search || '').toLowerCase().includes(q);
      item.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    if (empty) empty.classList.toggle('visible', visible === 0);
    if (count) count.textContent = q ? (visible + ' of ' + total) : '';
  };

  input.addEventListener('input', filter);
}

/* ---- Generic copy-to-clipboard button (Contact section: email/phone) ---- */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn[data-copy-value]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy-value');
      var done = function (ok) {
        var original = btn.innerHTML;
        btn.classList.toggle('copied', ok);
        btn.innerHTML = ok ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.innerHTML = original;
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }).catch(function () { done(fallbackCopy(text)); });
      } else {
        done(fallbackCopy(text));
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initHeadingAnchors();
  initCodeTabs();
  initCodeCopy();
  initMermaid();
  initPseudocode();
  initAbstractToggles();
  initBibCopy();
  initAccordion();
  initSectionAccordion();
  initProjectAccordion();
  initProjectFilters();
  initPubSearch();
  initCopyButtons();
});
