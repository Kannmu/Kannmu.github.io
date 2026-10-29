/* ==========================================================================
   academic-sync.js — live reconciliation of the publication list
   --------------------------------------------------------------------------
   Two public, CORS-enabled, key-free endpoints are used:
     • ORCID public API   https://pub.orcid.org/v3.0/<id>/works
     • Crossref REST API  https://api.crossref.org/works/<doi>
   What it does on the About page:
     1. Refreshes the "cited" counters and the total citation metric.
     2. Detects works that exist on ORCID but not yet in _data/publications.yml
        and appends them under a "Newly indexed" heading.
   Results are cached in localStorage for 12h so repeat visits are instant and
   the APIs are not hammered. Any failure leaves the server-rendered page
   untouched — this is strictly an enhancement.
   ========================================================================== */
(function () {
  'use strict';

  var ORCID = '0009-0000-8611-7194';
  var MAILTO = 'kannmu@163.com';
  var CACHE_KEY = 'kannmu:academic:v2';
  var TTL = 12 * 60 * 60 * 1000;

  var list = document.querySelector('[data-publist]');
  var stateEl = document.querySelector('[data-sync-state]');
  if (!list || !stateEl) return;

  var stateText = stateEl.querySelector('[data-zh], [data-en]');

  function setState(state, zh, en) {
    stateEl.setAttribute('data-state', state);
    if (zh && stateText) {
      stateEl.innerHTML = '<i aria-hidden="true"></i>' +
        '<span data-zh>' + zh + '</span><span data-en>' + (en || zh) + '</span>';
    }
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts) return null;
      if (Date.now() - parsed.ts > TTL) return null;
      return parsed;
    } catch (e) { return null; }
  }

  function writeCache(data) {
    try {
      data.ts = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) { /* quota / private mode */ }
  }

  function normDoi(doi) {
    return String(doi || '').toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, '').trim();
  }

  function knownDois() {
    return Array.prototype.map.call(
      document.querySelectorAll('.pub[data-doi]'),
      function (el) { return normDoi(el.getAttribute('data-doi')); }
    ).filter(Boolean);
  }

  function fetchJson(url, timeout) {
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, timeout || 9000);
    return fetch(url, {
      signal: controller ? controller.signal : undefined,
      headers: { Accept: 'application/json' },
      credentials: 'omit'
    }).then(function (res) {
      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).catch(function (err) {
      clearTimeout(timer);
      throw err;
    });
  }

  function fetchCitation(doi) {
    return fetchJson(
      'https://api.crossref.org/works/' + encodeURIComponent(doi) +
      '?mailto=' + encodeURIComponent(MAILTO),
      8000
    ).then(function (json) {
      var msg = json && json.message;
      if (!msg) return null;
      return typeof msg['is-referenced-by-count'] === 'number' ? msg['is-referenced-by-count'] : null;
    }).catch(function () { return null; });
  }

  /* Run the Crossref lookups a few at a time so we never open 12 sockets. */
  function mapLimit(items, limit, worker) {
    var index = 0;
    var results = new Array(items.length);
    function next() {
      if (index >= items.length) return Promise.resolve(results);
      var i = index++;
      return worker(items[i], i).then(function (value) {
        results[i] = value;
        return next();
      });
    }
    var runners = [];
    for (var k = 0; k < Math.min(limit, items.length); k++) runners.push(next());
    return Promise.all(runners).then(function () { return results; });
  }

  /* ------------------------------------------------------------ ORCID ---- */
  function fetchOrcidWorks() {
    return fetchJson('https://pub.orcid.org/v3.0/' + ORCID + '/works', 9000)
      .then(function (json) {
        var groups = (json && json.group) || [];
        return groups.map(function (group) {
          var s = group['work-summary'] && group['work-summary'][0];
          if (!s) return null;
          var ids = (s['external-ids'] && s['external-ids']['external-id']) || [];
          var doi = null;
          ids.forEach(function (id) {
            if (!doi && id['external-id-type'] === 'doi') {
              doi = normDoi(id['external-id-relationship'] === 'self'
                ? id['external-id-value']
                : id['external-id-value']);
            }
          });
          var year = s['publication-date'] && s['publication-date'].year
            ? s['publication-date'].year.value : '';
          return {
            title: (s.title && s.title.title && s.title.title.value) || '',
            doi: doi,
            year: year,
            venue: (s['journal-title'] && s['journal-title'].value) || '',
            type: s.type || 'journal-article'
          };
        }).filter(function (w) { return w && w.title; });
      });
  }

  /* --------------------------------------------------------- rendering ---- */
  function applyCitations(map) {
    var total = 0;
    document.querySelectorAll('.pub[data-doi]').forEach(function (pub) {
      var doi = normDoi(pub.getAttribute('data-doi'));
      var value = map[doi];
      if (typeof value !== 'number') return;
      total += value;

      var slot = pub.querySelector('[data-cite-of]');
      if (slot) {
        slot.textContent = value + ' cited';
        slot.style.display = value > 0 ? '' : 'none';
      } else if (value > 0) {
        var venue = pub.querySelector('.pub__venue');
        if (venue) {
          var sep = document.createElement('span');
          sep.className = 'sep';
          sep.setAttribute('aria-hidden', 'true');
          var span = document.createElement('span');
          span.setAttribute('data-cite-of', doi);
          span.textContent = value + ' cited';
          venue.appendChild(sep);
          venue.appendChild(span);
        }
      }
    });

    /* Anything that is not on the page still counts towards the total */
    Object.keys(map).forEach(function (doi) {
      if (!document.querySelector('.pub[data-doi="' + doi + '"]') && knownDois().indexOf(doi) === -1) {
        total += map[doi] || 0;
      }
    });

    var metric = document.querySelector('[data-metric="citations"]');
    if (metric) metric.textContent = total;
    return total;
  }

  function renderExtra(works, known) {
    var extras = works.filter(function (w) {
      return w.doi && known.indexOf(normDoi(w.doi)) === -1 && w.type !== 'other';
    });
    if (!extras.length) return 0;

    extras.forEach(function (w) {
      var article = document.createElement('article');
      article.className = 'pub';
      article.setAttribute('data-doi', normDoi(w.doi));
      article.setAttribute('data-year', w.year);
      article.setAttribute('data-type', 'journal');
      article.setAttribute('data-role', 'coauthor');
      article.setAttribute('data-topics', '');
      article.setAttribute('data-reveal', '');

      article.innerHTML =
        '<div class="pub__year">' + (w.year || '') + '</div>' +
        '<div class="pub__main">' +
          '<h3 class="pub__title">' +
            '<a href="https://doi.org/' + w.doi + '" target="_blank" rel="noopener">' +
              (w.title || '') +
            '</a>' +
          '</h3>' +
          '<div class="pub__venue">' +
            '<span class="j">' + (w.venue || 'ORCID record') + '</span>' +
            '<span class="sep" aria-hidden="true"></span><span>ORCID</span>' +
          '</div>' +
          '<div class="pub__badges">' +
            '<span class="chip chip--teal">Newly indexed</span>' +
          '</div>' +
          '<div class="pub__actions">' +
            '<a class="pub-act" href="https://doi.org/' + w.doi + '" target="_blank" rel="noopener">DOI ↗</a>' +
          '</div>' +
        '</div>';

      list.insertBefore(article, list.firstChild);
    });

    var counter = document.querySelector('[data-pub-count]');
    if (counter) counter.textContent = String(Number(counter.textContent) + extras.length);

    setState(
      'ok',
      '已从 ORCID 同步，新增 ' + extras.length + ' 篇未收录成果',
      'Synced from ORCID — ' + extras.length + ' newly indexed work(s) added'
    );
    return extras.length;
  }

  /* ---------------------------------------------------------------- run --- */
  var known = knownDois();

  function run(useCache) {
    var cached = useCache ? readCache() : null;
    if (cached && cached.citations) {
      applyCitations(cached.citations);
      setState('ok', '引用数已同步 · 缓存', 'Citations synced · cached');
      if (useCache) return Promise.resolve();
    }

    return Promise.all([
      mapLimit(known, 4, function (doi) { return fetchCitation(doi); })
        .then(function (values) {
          var map = {};
          known.forEach(function (doi, i) {
            if (typeof values[i] === 'number') map[doi] = values[i];
          });
          return map;
        }),
      fetchOrcidWorks().catch(function () { return []; })
    ]).then(function (results) {
      var citations = results[0];
      var works = results[1];

      if (Object.keys(citations).length) {
        applyCitations(citations);
      }
      var added = works.length ? renderExtra(works, known) : 0;

      writeCache({ citations: citations, works: works });

      if (!added) {
        setState(
          'ok',
          '引用数已与 Crossref 同步',
          'Citation counts synced with Crossref'
        );
      }
    }).catch(function () {
      setState(
        'error',
        '离线数据 · 实时同步暂不可用',
        'Using cached data — live sync unavailable'
      );
    });
  }

  var start = function () {
    var cached = readCache();
    if (cached && cached.citations) {
      applyCitations(cached.citations);
      setState('ok', '引用数已同步 · 缓存', 'Citations synced · cached');
    }
    run(!cached);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
