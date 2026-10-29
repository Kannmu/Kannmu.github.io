/* ==========================================================================
   site.js — interactions for the Kannmu research site
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- utils */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); }
  function raf(fn) { return window.requestAnimationFrame(fn); }

  function throttle(fn, wait) {
    var last = 0, timer = null;
    return function () {
      var now = Date.now(), args = arguments, self = this;
      if (now - last >= wait) { last = now; fn.apply(self, args); }
      else {
        clearTimeout(timer);
        timer = setTimeout(function () { last = Date.now(); fn.apply(self, args); }, wait - (now - last));
      }
    };
  }

  /* ----------------------------------------------------------- tiny toast */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      toastEl.style.cssText = [
        'position:fixed', 'left:50%', 'bottom:28px', 'z-index:10050',
        'transform:translate(-50%,14px)', 'opacity:0', 'pointer-events:none',
        'padding:10px 18px', 'border-radius:999px', 'font-size:13px',
        'font-family:var(--font-mono)', 'letter-spacing:.04em',
        'background:var(--ink)', 'color:var(--paper)',
        'box-shadow:var(--shadow-md)', 'transition:opacity .28s var(--ease),transform .28s var(--ease)'
      ].join(';');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    raf(function () {
      toastEl.style.opacity = '1';
      toastEl.style.transform = 'translate(-50%,0)';
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translate(-50%,14px)';
    }, 2200);
  }

  /* --------------------------------------------------------------- theme */
  var themeBtn = $('#themeToggle');
  function setTheme(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  }
  on(themeBtn, 'click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* React to OS changes when the visitor has never picked a theme */
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onScheme = function (e) {
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (err) {}
      if (!stored) setTheme(e.matches ? 'dark' : 'light');
    };
    if (mq.addEventListener) mq.addEventListener('change', onScheme);
    else if (mq.addListener) mq.addListener(onScheme);
  }

  /* -------------------------------------------------------------- header */
  var header = $('#siteHeader');
  var progress = $('#readProgress');
  var heroBlock = $('.hero, .page-hero, .about-hero, .intro-header');
  var lastY = window.pageYOffset;

  function headerState() {
    if (!header) return;
    var y = window.pageYOffset;

    header.classList.toggle('is-solid', y > 24);

    /* On any page that opens with a photo band, the header floats above the
       image in white until the band scrolls past. This covers the new `.hero`
       blocks as well as the legacy `.intro-header` used by blog posts. */
    if (heroBlock) {
      var limit = Math.max(120, heroBlock.offsetHeight - 90);
      header.classList.toggle('on-hero', y < limit);
    }

    /* Tuck away while reading downwards, come back on scroll up */
    if (y > 480 && y > lastY + 6 && !header.classList.contains('nav-open')) {
      header.classList.add('is-hidden');
    } else if (y < lastY - 4 || y < 240) {
      header.classList.remove('is-hidden');
    }
    lastY = y;

    if (progress) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
      progress.style.transform = 'scaleX(' + ratio + ')';
    }
  }

  on(window, 'scroll', throttle(headerState, 60), { passive: true });
  on(window, 'resize', throttle(headerState, 120));
  headerState();

  /* ----------------------------------------------------------- mobile nav */
  var burger = $('#navBurger');
  function closeNav() {
    if (!header) return;
    header.classList.remove('nav-open');
    body.classList.remove('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  on(burger, 'click', function () {
    var open = header.classList.toggle('nav-open');
    body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('.site-nav a').forEach(function (a) { on(a, 'click', closeNav); });
  on(window, 'resize', function () { if (window.innerWidth > 900) closeNav(); });

  /* -------------------------------------------------------------- search */
  var searchPage = $('#searchPage');
  var searchInput = $('#search-input');
  var searchOpen = $('#searchOpen');
  var searchClose = $('#searchClose');

  function openSearch() {
    if (!searchPage) return;
    searchPage.classList.add('search-active');
    body.classList.add('no-scroll');
    setTimeout(function () { if (searchInput) searchInput.focus(); }, 80);
  }
  function closeSearch() {
    if (!searchPage) return;
    searchPage.classList.remove('search-active');
    body.classList.remove('no-scroll');
  }
  on(searchOpen, 'click', openSearch);
  on(searchClose, 'click', closeSearch);
  on(searchPage, 'click', function (e) { if (e.target === searchPage) closeSearch(); });
  on(document, 'keydown', function (e) {
    if (e.key === 'Escape') { closeSearch(); closeNav(); }
    var tag = (e.target.tagName || '').toLowerCase();
    if (e.key === '/' && tag !== 'input' && tag !== 'textarea') {
      e.preventDefault();
      openSearch();
    }
  });

  /* ------------------------------------------------------------ language */
  function currentLang() { return root.getAttribute('data-lang') || 'zh'; }

  function applyLang(lang, push) {
    root.setAttribute('data-lang', lang);
    try { localStorage.setItem('lang', lang); } catch (e) {}
    var label = $('#langToggleLabel');
    if (label) label.textContent = lang === 'en' ? '中文' : 'EN';
    if (push) {
      var url = new URL(window.location.href);
      if (lang === 'en') url.searchParams.set('lang', 'en');
      else url.searchParams.delete('lang');
      window.history.replaceState({}, '', url.toString());
    }
  }

  var langBtn = $('#langToggle');
  on(langBtn, 'click', function () {
    applyLang(currentLang() === 'en' ? 'zh' : 'en', true);
    var l = currentLang();
    toast(l === 'en' ? 'Switched to English' : '已切换到中文');
  });
  applyLang(currentLang(), false);

  /* Legacy hook used by old selects */
  window.onLanChange = function (index) {
    applyLang(String(index) === '1' || index === 'en' ? 'en' : 'zh', true);
  };

  /* -------------------------------------------------------- reveal on view */
  var revealables = $$('[data-reveal]');
  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      /* Anything already on screen at load is shown straight away — the
         entrance animation is for content the visitor scrolls down to, not
         for the first screen. This also guarantees no invisible content if
         the observer is late to fire. */
      var inViewAtLoad = [];
      revealables.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
          el.classList.add('is-in');
          inViewAtLoad.push(el);
        }
      });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = el.getAttribute('data-reveal-delay');
          if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
          el.classList.add('is-in');
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      revealables.forEach(function (el) {
        if (inViewAtLoad.indexOf(el) !== -1) return;
        io.observe(el);
      });
    }
  }

  /* --------------------------------------------- section index (about page) */
  var indexLinks = $$('.about-index a');
  if (indexLinks.length && 'IntersectionObserver' in window) {
    var targets = indexLinks
      .map(function (a) { return document.getElementById(a.getAttribute('data-target')); })
      .filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        indexLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('data-target') === id);
        });
      });
    }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });

    targets.forEach(function (t) { spy.observe(t); });
  }

  /* --------------------------------------------------- publications filters */
  var pubList = $('[data-publist]');
  if (pubList) {
    var pubs = $$('.pub', pubList);
    var filters = $$('.pub-filter');
    var empty = $('[data-pub-empty]');

    function applyFilter(key) {
      var shown = 0;
      pubs.forEach(function (p) {
        var match = key === 'all' ||
          p.getAttribute('data-year') === key ||
          p.getAttribute('data-type') === key ||
          p.getAttribute('data-role') === key ||
          (p.getAttribute('data-topics') || '').indexOf(key) !== -1;
        p.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
      var counter = $('[data-pub-count]');
      if (counter) counter.textContent = shown;
    }

    filters.forEach(function (btn) {
      on(btn, 'click', function () {
        filters.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        applyFilter(btn.getAttribute('data-filter'));
      });
    });
  }

  /* ------------------------------------------- abstract / bibtex expansion */
  $$('[data-toggle-pub]').forEach(function (btn) {
    on(btn, 'click', function () {
      var pub = btn.closest('.pub');
      if (!pub) return;
      var target = btn.getAttribute('data-toggle-pub');
      if (target === 'abstract') {
        var open = pub.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.querySelector('span').textContent = open ? '收起' : '摘要';
      }
    });
  });

  /* --------------------------------------------------------- copy helpers */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (err) { reject(err); }
    });
  }

  $$('[data-copy]').forEach(function (btn) {
    on(btn, 'click', function () {
      var sel = btn.getAttribute('data-copy');
      var src = sel === 'prev' ? btn.previousElementSibling : document.querySelector(sel);
      if (!src) return;
      copyText(src.textContent.trim()).then(function () {
        var original = btn.getAttribute('data-label') || btn.textContent;
        toast(btn.getAttribute('data-copied') || '已复制');
        btn.classList.add('pub__copy-flash');
        setTimeout(function () { btn.classList.remove('pub__copy-flash'); }, 1400);
        void original;
      }).catch(function () { toast('复制失败，请手动选择'); });
    });
  });

  /* ------------------------------------------------------------ archive */
  var arcFilters = $$('[data-arc-filter]');
  if (arcFilters.length) {
    var arcItems = $$('.arc-item');
    var arcYears = $$('.arc-year');

    function applyArc(tag) {
      var shown = 0;
      arcItems.forEach(function (item) {
        var tags = (item.getAttribute('data-tags') || '').split('|');
        var match = tag === '*' || tags.indexOf(tag) !== -1;
        item.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      arcYears.forEach(function (year) {
        var visible = $$('.arc-item', year).some(function (i) { return !i.classList.contains('is-hidden'); });
        year.classList.toggle('is-hidden', !visible);
      });
      arcFilters.forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-arc-filter') === tag);
        b.setAttribute('aria-pressed', b.getAttribute('data-arc-filter') === tag ? 'true' : 'false');
      });
      var count = $('[data-arc-count]');
      if (count) count.textContent = shown;
      var empty = $('[data-arc-empty]');
      if (empty) empty.hidden = shown !== 0;

      if (tag !== '*') {
        try {
          var url = new URL(window.location.href);
          url.hash = 'tag-' + encodeURIComponent(tag);
          window.history.replaceState({}, '', url.toString());
        } catch (e) {}
      }
    }

    arcFilters.forEach(function (btn) {
      on(btn, 'click', function () { applyArc(btn.getAttribute('data-arc-filter')); });
    });

    var initial = null;
    try {
      var params = new URLSearchParams(window.location.search);
      initial = params.get('tag') || (window.location.hash || '').replace(/^#tag-/, '');
      if (initial) initial = decodeURIComponent(initial);
    } catch (e) {}
    if (initial) applyArc(initial);

    /* Reveal the long tail of single-post tags on demand */
    var cloud = document.getElementById('tagCloud');
    var more = document.getElementById('tagMore');
    var moreDefault = more ? more.innerHTML : '';
    on(more, 'click', function () {
      if (!cloud) return;
      var open = cloud.classList.toggle('is-expanded');
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var zh = more.getAttribute('data-less-zh') || '收起低频标签';
        var en = more.getAttribute('data-less-en') || 'Collapse low-frequency topics';
        more.innerHTML =
          '<span data-zh>' + zh + '</span><span data-en>' + en + '</span>' +
          '<span aria-hidden="true"> ↑</span>';
      } else {
        more.innerHTML = moreDefault;
      }
    });
  }

  /* --------------------------------------------------- smooth in-page links */
  $$('a[href^="#"]').forEach(function (a) {
    on(a, 'click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      try { window.history.replaceState({}, '', id); } catch (err) {}
    });
  });

  /* ------------------------------------------------ external link hardening */
  $$('a[href^="http"]').forEach(function (a) {
    if (a.hostname && a.hostname !== window.location.hostname) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });

  /* --------------------------------------------------------- image loading */
  $$('img').forEach(function (img) {
    if (!img.hasAttribute('loading') && !img.closest('.about-portrait')) {
      img.setAttribute('loading', 'lazy');
    }
    img.setAttribute('decoding', 'async');
  });
})();
