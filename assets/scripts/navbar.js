// Simple active-link highlighter for the top navigation.
// Mirrors the role of clarity-template's assets/scripts/navbar.js,
// adapted for Jekyll's pretty permalinks (/about/ instead of about.html)
// instead of the original static-HTML filenames.
document.addEventListener('DOMContentLoaded', function () {
  // Normalize away trailing slashes (except the root) so "/about/" and
  // "/about" compare equal, and drop any baseurl prefix by comparing
  // full pathnames as Jekyll renders them in each link's href.
  var normalize = function (path) {
    if (path.length > 1) { path = path.replace(/\/$/, ''); }
    return path || '/';
  };
  var current = normalize(window.location.pathname);
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = normalize(link.getAttribute('href'));
    if (href === current) {
      link.classList.add('active');
    }
  });

  // Highlight the current section in the sticky in-page table of contents.
  var tocLinks = document.querySelectorAll('.toc a');
  var sections = Array.prototype.map.call(tocLinks, function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if (tocLinks.length && sections.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  // Collapse/expand the in-page dock via its hamburger button.
  var tocToggle = document.getElementById('tocToggle');
  var tocDock = document.getElementById('tocDock');
  if (tocToggle && tocDock) {
    tocToggle.addEventListener('click', function () {
      var collapsed = tocDock.classList.toggle('collapsed');
      tocToggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  // Mobile nav toggle: same open/close-on-link-click pattern as the base
  // project's burger/crumbs handler, adapted to this site's nav-toggle/nav-links.
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Dark/light theme toggle. The initial data-theme attribute is already
  // set by the pre-paint inline script in head-meta.html (avoids a flash
  // of the wrong theme); this just handles the click and persistence.
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var root = document.documentElement;
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable — theme just won't persist */ }
      // Let content-features.js know, so any Mermaid diagrams on the
      // page can re-render in the matching theme.
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
    });
  }

  // Back-to-top button: fade in after scrolling down, scroll to top on click.
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    var toggleVisibility = function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    };
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
