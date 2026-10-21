// Site search, al-folio style: a small Fuse.js fuzzy index built from a
// Jekyll-generated search.json (publications, projects, teaching, news,
// blog posts). Only runs on pages that actually have the search box —
// currently just the home page — everything else is a silent no-op.
(function () {
  var input = document.getElementById('siteSearchInput');
  var box = document.getElementById('siteSearch');
  var results = document.getElementById('searchResults');
  if (!input || !results || typeof Fuse === 'undefined') return;

  var fuse = null;
  var indexPromise = fetch(input.dataset.indexUrl || '/search.json')
    .then(function (res) { return res.ok ? res.json() : []; })
    .then(function (data) {
      fuse = new Fuse(data, {
        keys: [
          { name: 'title', weight: 0.6 },
          { name: 'description', weight: 0.25 },
          { name: 'category', weight: 0.15 }
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2
      });
    })
    .catch(function () { fuse = null; });

  var renderResults = function (matches, query) {
    if (!matches.length) {
      results.innerHTML = '<div class="search-empty">No matches for "' + escapeHtml(query) + '"</div>';
      results.hidden = false;
      return;
    }
    var html = matches.slice(0, 8).map(function (m) {
      var item = m.item;
      return (
        '<a class="search-result" href="' + item.url + '">' +
          '<span class="search-result-cat">' + escapeHtml(item.category) + '</span>' +
          '<span class="search-result-body">' +
            '<span class="search-result-title">' + escapeHtml(item.title) + '</span>' +
            '<span class="search-result-desc">' + escapeHtml(item.description) + '</span>' +
          '</span>' +
        '</a>'
      );
    }).join('');
    results.innerHTML = html;
    results.hidden = false;
  };

  var escapeHtml = function (s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var runSearch = function () {
    var q = input.value.trim();
    if (!q) { results.hidden = true; results.innerHTML = ''; return; }
    if (!fuse) {
      indexPromise.then(function () { if (fuse) runSearch(); });
      return;
    }
    renderResults(fuse.search(q), q);
  };

  input.addEventListener('input', runSearch);
  input.addEventListener('focus', function () { if (input.value.trim()) runSearch(); });

  // Enter jumps straight to the top result.
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var first = results.querySelector('.search-result');
      if (first) { window.location.href = first.getAttribute('href'); }
    } else if (e.key === 'Escape') {
      results.hidden = true;
      input.blur();
    }
  });

  // Click outside closes the dropdown.
  document.addEventListener('click', function (e) {
    if (box && !box.contains(e.target)) { results.hidden = true; }
  });
})();
