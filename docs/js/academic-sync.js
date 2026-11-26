/* Refresh the latest published snapshot on About without making it depend on external APIs. */
(async function () {
  const list = document.querySelector('[data-publist]');
  const status = document.querySelector('[data-sync-state]');
  if (!list || !status) return;

  const endpoint = 'https://api.crossref.org/works/';
  const orcidId = list.dataset.orcid;
  const snapshot = document.getElementById('publication-snapshot')?.dateTime || '';
  const cacheKey = 'kannmu:academic:v3';
  const ttl = 12 * 60 * 60 * 1000;
  const rows = () => [...list.querySelectorAll('.pub[data-doi]')];
  const metric = (name, value) => {
    document.querySelectorAll(`[data-metric="${name}"]`).forEach((node) => { node.textContent = value; });
  };
  const messages = (zh, en) => {
    status.replaceChildren();
    for (const [language, text] of [['zh', zh], ['en', en]]) {
      const label = document.createElement('span');
      label.setAttribute(`data-${language}`, '');
      label.textContent = text;
      status.append(label);
    }
  };
  const normalizeDoi = (doi) => String(doi || '').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').toLowerCase();
  const doiHref = (doi) => 'https://doi.org/' + doi.split('/').map(encodeURIComponent).join('/');
  const validCount = (count) => Number.isSafeInteger(count) && count >= 0;
  const known = new Set(rows().map((row) => row.dataset.doi).map(normalizeDoi).filter(Boolean));

  const addWorks = (works) => {
    const fragment = document.createDocumentFragment();
    for (const work of works) {
      const doi = normalizeDoi(work.doi);
      if (!doi.startsWith('10.') || known.has(doi) || !work.title) continue;
      known.add(doi);
      const row = list.querySelector('template').content.firstElementChild.cloneNode(true);
      row.dataset.doi = doi;
      row.dataset.year = work.year;
      row.dataset.type = work.type;
      row.querySelector('.pub__year').textContent = work.year;
      row.querySelector('.pub__venue .j').textContent = work.venue || 'ORCID';
      row.querySelectorAll('a').forEach((link) => { link.href = doiHref(doi); });
      row.querySelector('.pub__title a').textContent = work.title;
      fragment.append(row);
    }
    list.prepend(fragment);
  };

  const apply = (data) => {
    addWorks(data.works);
    let total = 0;
    for (const row of rows()) {
      const slot = row.querySelector('[data-citation]');
      if (!slot) continue;
      const count = data.counts[normalizeDoi(row.dataset.doi)];
      if (validCount(count)) {
        slot.dataset.citation = count;
        slot.querySelectorAll('[data-citation-value]').forEach((node) => { node.textContent = count; });
        slot.hidden = false;
      }
      const displayed = Number(slot.dataset.citation);
      if (!slot.hidden && validCount(displayed)) total += displayed;
    }
    metric('works', rows().length);
    metric('citations', total);
    list.dispatchEvent(new Event('publicationsupdated'));
    if (data.complete) messages('已核对 ORCID 与 Crossref。', 'Checked against ORCID and Crossref.');
    else if (data.works.length || Object.keys(data.counts).length) {
      messages('部分数据已刷新；其余沿用构建数据。', 'Partially refreshed; other values use the build snapshot.');
    } else {
      messages('暂时无法在线更新，显示构建数据。', 'Live refresh unavailable; showing the build snapshot.');
    }
  };

  try {
    const saved = JSON.parse(localStorage.getItem(cacheKey));
    if (saved?.snapshot === snapshot && saved.at > Date.now() - ttl &&
        Array.isArray(saved.works) && saved.counts && typeof saved.counts === 'object') {
      apply(saved);
      return;
    }
  } catch { /* Unavailable storage or old cache; fall back to network. */ }

  const getJson = async (url) => {
    const res = await fetch(url, {
      credentials: 'omit', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  const fetchWorks = async () => {
    if (!orcidId) return [];
    const { group } = await getJson(`https://pub.orcid.org/v3.0/${encodeURIComponent(orcidId)}/works`);
    const extras = new Map();
    for (const entry of group || []) {
      for (const work of entry['work-summary'] || []) {
        const id = (work['external-ids']?.['external-id'] || []).find((value) =>
          value['external-id-type'] === 'doi' && value['external-id-relationship'] !== 'part-of');
        const doi = normalizeDoi(id?.['external-id-value']);
        const title = work.title?.title?.value;
        if (!doi || !title || work.type === 'other' || known.has(doi) || extras.has(doi)) continue;
        extras.set(doi, {
          doi, title, year: work['publication-date']?.year?.value || '',
          venue: work['journal-title']?.value || '',
          type: work.type?.startsWith('conference-') ? 'conference' : work.type === 'journal-article' ? 'journal' : ''
        });
      }
    }
    return [...extras.values()].sort((a, b) => b.year.localeCompare(a.year));
  };

  // Bound concurrency to avoid sending one parallel request per article.
  const works = await fetchWorks().catch(() => null);
  const dois = [...known, ...(works || []).map((w) => w.doi)];
  const counts = Object.create(null);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(4, dois.length) }, async () => {
    while (cursor < dois.length) {
      const doi = dois[cursor++];
      try {
        const { message } = await getJson(endpoint + encodeURIComponent(doi));
        const count = message?.['is-referenced-by-count'];
        if (validCount(count)) counts[doi] = count;
      } catch { /* Keep the value already rendered for this DOI. */ }
    }
  }));
  const data = { snapshot, at: Date.now(), counts, works: works || [], complete: works !== null && Object.keys(counts).length === dois.length };
  apply(data);
  if (data.complete) {
    try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch { /* Storage is optional. */ }
  }
})();
