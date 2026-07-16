(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var nav = document.querySelector('[data-site-nav]');
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navPanel = document.querySelector('[data-nav-panel]');

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {}
  }

  function closeNavigation(restoreFocus) {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('title', 'Open menu');
    navToggle.querySelector('.sr-only').textContent = 'Open menu';
    var icon = navToggle.querySelector('i');
    if (icon) icon.className = 'glyphicon glyphicon-menu-hamburger';
    if (restoreFocus) navToggle.focus();
  }

  function openNavigation() {
    if (!nav || !navToggle) return;
    nav.classList.add('is-open');
    body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('title', 'Close menu');
    navToggle.querySelector('.sr-only').textContent = 'Close menu';
    var icon = navToggle.querySelector('i');
    if (icon) icon.className = 'glyphicon glyphicon-remove';
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeNavigation(false);
      else openNavigation();
    });

    navPanel.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNavigation(false);
    });

    document.addEventListener('click', function (event) {
      if (nav.classList.contains('is-open') && !nav.contains(event.target)) {
        closeNavigation(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNavigation(true);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 991) closeNavigation(false);
    }, { passive: true });
  }

  function updateNavigationTone() {
    if (nav) nav.classList.toggle('site-nav--scrolled', window.scrollY > 18);
  }

  updateNavigationTone();
  window.addEventListener('scroll', updateNavigationTone, { passive: true });

  function updateGiscusTheme(theme) {
    var frame = document.querySelector('iframe.giscus-frame');
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({
      giscus: { setConfig: { theme: theme === 'dark' ? 'dark' : 'light' } }
    }, 'https://giscus.app');
  }

  function applyTheme(theme, persist) {
    var nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', nextTheme === 'dark' ? '#0d1110' : '#f4f6f2');
    document.querySelectorAll('[data-theme-icon]').forEach(function (icon) {
      icon.className = 'glyphicon glyphicon-adjust';
    });
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.setAttribute('aria-label', nextTheme === 'dark' ? 'Use light theme' : 'Use dark theme');
      button.setAttribute('title', nextTheme === 'dark' ? 'Use light theme' : 'Use dark theme');
    });
    if (persist) writeStorage('theme', nextTheme);
    updateGiscusTheme(nextTheme);
  }

  var initialTheme = root.getAttribute('data-theme') || readStorage('theme') || 'light';
  applyTheme(initialTheme, false);

  document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  });

  window.addEventListener('message', function (event) {
    if (event.origin === 'https://giscus.app') {
      updateGiscusTheme(root.getAttribute('data-theme'));
    }
  });

  function applyLanguage(language, persist) {
    var nextLanguage = language === 'en' ? 'en' : 'zh';
    root.setAttribute('data-language', nextLanguage);
    root.lang = nextLanguage === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-language-label]').forEach(function (label) {
      label.textContent = nextLanguage === 'zh' ? 'EN' : '中';
    });
    document.querySelectorAll('[data-language-toggle]').forEach(function (button) {
      var title = nextLanguage === 'zh' ? 'Switch to English' : '切换到中文';
      button.setAttribute('aria-label', title);
      button.setAttribute('title', title);
    });
    if (persist) writeStorage('site-language', nextLanguage);
  }

  var initialLanguage = root.getAttribute('data-language') || readStorage('site-language') || 'zh';
  applyLanguage(initialLanguage, false);

  document.querySelectorAll('[data-language-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
      applyLanguage(root.getAttribute('data-language') === 'zh' ? 'en' : 'zh', true);
    });
  });

  function initializeSearch() {
    var overlay = document.querySelector('.search-page');
    var input = document.getElementById('search-input');
    var results = document.getElementById('search-results');
    var closeButton = overlay && overlay.querySelector('.search-icon-close');
    var openButtons = document.querySelectorAll('.search-icon');
    if (!overlay || !input || !results || !closeButton || !openButtons.length) return;

    var searchIndex = null;
    var searchRequest = null;
    var lastFocused = null;

    function setMessage(message) {
      results.replaceChildren();
      var empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = message;
      results.appendChild(empty);
    }

    function loadIndex() {
      if (searchIndex) return Promise.resolve(searchIndex);
      if (searchRequest) return searchRequest;
      searchRequest = window.fetch(overlay.getAttribute('data-search-url'), { credentials: 'same-origin' })
        .then(function (response) {
          if (!response.ok) throw new Error('Search index returned ' + response.status);
          return response.json();
        })
        .then(function (data) {
          searchIndex = Array.isArray(data) ? data : [];
          return searchIndex;
        })
        .catch(function (error) {
          searchRequest = null;
          throw error;
        });
      return searchRequest;
    }

    function createResult(item) {
      var article = document.createElement('article');
      article.className = 'search-result';
      var link = document.createElement('a');
      link.href = item.url;
      var title = document.createElement('h2');
      title.textContent = item.title || 'Untitled';
      link.appendChild(title);
      if (item.subtitle) {
        var subtitle = document.createElement('p');
        subtitle.textContent = item.subtitle;
        link.appendChild(subtitle);
      }
      article.appendChild(link);
      return article;
    }

    function renderSearch() {
      var query = input.value.trim().toLocaleLowerCase();
      results.replaceChildren();
      if (!query) return;
      var terms = query.split(/\s+/).filter(Boolean);
      var matches = searchIndex.filter(function (item) {
        var haystack = [item.title, item.subtitle, item.content].join(' ').toLocaleLowerCase();
        return terms.every(function (term) { return haystack.indexOf(term) !== -1; });
      }).slice(0, 12);

      if (!matches.length) {
        setMessage(root.getAttribute('data-language') === 'zh' ? '没有匹配的文章' : 'No matching notes');
        return;
      }
      var fragment = document.createDocumentFragment();
      matches.forEach(function (item) { fragment.appendChild(createResult(item)); });
      results.appendChild(fragment);
    }

    function openSearch(trigger) {
      lastFocused = trigger || document.activeElement;
      closeNavigation(false);
      overlay.classList.add('search-active');
      overlay.setAttribute('aria-hidden', 'false');
      body.classList.add('no-scroll');
      input.focus();
      setMessage(root.getAttribute('data-language') === 'zh' ? '正在载入文章…' : 'Loading notes...');
      loadIndex().then(function () {
        if (input.value.trim()) renderSearch();
        else results.replaceChildren();
      }).catch(function () {
        setMessage(root.getAttribute('data-language') === 'zh' ? '搜索暂时不可用' : 'Search is temporarily unavailable');
      });
    }

    function closeSearch() {
      overlay.classList.remove('search-active');
      overlay.setAttribute('aria-hidden', 'true');
      body.classList.remove('no-scroll');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    openButtons.forEach(function (button) {
      button.addEventListener('click', function () { openSearch(button); });
    });
    closeButton.addEventListener('click', closeSearch);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeSearch();
    });
    input.addEventListener('input', function () {
      loadIndex().then(renderSearch).catch(function () {});
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && overlay.classList.contains('search-active')) closeSearch();
    });
  }

  initializeSearch();

  function initializeSignalField() {
    var canvas = document.getElementById('signal-field');
    var hero = canvas && canvas.closest('.home-hero');
    if (!canvas || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var context = canvas.getContext('2d');
    if (!context) return;

    var width = 0;
    var height = 0;
    var ratio = 1;
    var pointer = { x: 0.72, y: 0.48 };
    var target = { x: 0.72, y: 0.48 };
    var running = true;

    function resizeCanvas() {
      var bounds = hero.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(time) {
      if (!running) return;
      context.clearRect(0, 0, width, height);
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;

      var originX = pointer.x * width;
      var originY = pointer.y * height;
      var spacing = width < 700 ? 34 : 42;
      var startX = Math.max(width * 0.42, 0);
      var pulse = time * 0.0014;

      for (var x = startX; x < width + spacing; x += spacing) {
        for (var y = 70; y < height - 45; y += spacing) {
          var dx = x - originX;
          var dy = y - originY;
          var distance = Math.sqrt(dx * dx + dy * dy);
          var wave = Math.sin(distance * 0.035 - pulse * 3.5);
          var influence = Math.max(0, 1 - distance / Math.max(width * 0.48, 320));
          var radius = 1.1 + influence * 2.4 + Math.max(0, wave) * influence * 1.4;
          var alpha = 0.12 + influence * 0.36;
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fillStyle = wave > 0.7 ? 'rgba(242,106,61,' + alpha + ')' : 'rgba(85,214,190,' + alpha + ')';
          context.fill();
        }
      }

      context.lineWidth = 1;
      for (var ring = 0; ring < 3; ring += 1) {
        var ringRadius = 34 + ring * 44 + ((pulse * 28) % 44);
        context.beginPath();
        context.arc(originX, originY, ringRadius, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(85,214,190,' + (0.2 - ring * 0.045) + ')';
        context.stroke();
      }

      window.requestAnimationFrame(draw);
    }

    hero.addEventListener('pointermove', function (event) {
      var bounds = hero.getBoundingClientRect();
      target.x = Math.min(0.96, Math.max(0.04, (event.clientX - bounds.left) / bounds.width));
      target.y = Math.min(0.9, Math.max(0.1, (event.clientY - bounds.top) / bounds.height));
    }, { passive: true });

    hero.addEventListener('pointerleave', function () {
      target.x = 0.72;
      target.y = 0.48;
    });

    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) window.requestAnimationFrame(draw);
    });

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();
    window.requestAnimationFrame(draw);
  }

  initializeSignalField();
})();
