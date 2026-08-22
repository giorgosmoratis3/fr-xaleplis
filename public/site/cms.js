// Δυναμικό περιεχόμενο (εκπαιδευτικά νέα, ανακοινώσεις, επιτυχίες, ώρες προγράμματος)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';

export const SUPABASE_URL = 'https://alclzcrzokleoanaqkgh.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_JV0C8IzldOZc7Bp8u3K9pg_BbNDq98J';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'chalepelis-admin-auth' },
});

const YEAR_SEC = 60 * 60 * 24 * 365;

export async function resolveMedia(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  const { data } = await supabase.storage.from('site-media').createSignedUrl(value, YEAR_SEC);
  return data?.signedUrl || '';
}

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('el-GR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch { return ''; }
};

/* ---------- Άρθρα / Ανακοινώσεις ---------- */
async function hydrateArticles() {
  const lists = Array.from(document.querySelectorAll('[data-cms-articles]'));
  if (!lists.length) return;

  for (const list of lists) {
    const category = list.getAttribute('data-cms-articles');
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) { list.innerHTML = '<p class="cms-empty">Δεν ήταν δυνατή η φόρτωση του περιεχομένου.</p>'; continue; }
    if (!data || !data.length) { list.innerHTML = '<p class="cms-empty">Δεν υπάρχουν καταχωρήσεις ακόμη.</p>'; continue; }

    const items = await Promise.all(data.map(async (a) => {
      const img = await resolveMedia(a.image_url);
      return `<article class="cms-card">
        ${img ? `<div class="cms-card-media"><img src="${img}" alt="${(a.title || '').replace(/"/g, '&quot;')}" loading="lazy"/></div>` : ''}
        <div class="cms-card-body">
          <span class="cms-card-date">${fmtDate(a.published_at)}</span>
          <h3>${a.title || ''}</h3>
          ${a.excerpt ? `<p class="cms-card-excerpt">${a.excerpt}</p>` : ''}
          ${a.body ? `<div class="cms-card-text">${(a.body || '').split('\n').filter(Boolean).map((p) => `<p>${p}</p>`).join('')}</div>` : ''}
          ${a.link_url ? `<a class="cms-card-link" href="${a.link_url}" target="_blank" rel="noopener">ΔΕΙΤΕ ΠΕΡΙΣΣΟΤΕΡΑ →</a>` : ''}
        </div>
      </article>`;
    }));
    list.innerHTML = items.join('');
  }
}

/* ---------- Επιτυχίες (κάρτες στα carousel αποτελεσμάτων) ---------- */
async function hydrateSuccesses() {
  const sections = Array.from(document.querySelectorAll('[data-cms-year]'));
  if (!sections.length) return;
  const { data } = await supabase.from('successes').select('*').order('sort_order', { ascending: true });
  if (!data || !data.length) return;

  for (const section of sections) {
    const year = Number(section.getAttribute('data-cms-year'));
    const rows = data.filter((r) => Number(r.year) === year);
    if (!rows.length) continue;
    const carousel = section.querySelector('.results-carousel');
    const stage = section.querySelector('.results-stage');
    if (!stage || !carousel) continue;
    for (const row of rows) {
      const src = await resolveMedia(row.image_url);
      if (!src) continue;
      const fig = document.createElement('figure');
      fig.className = 'results-card far';
      fig.innerHTML = `<img alt="${(row.caption || 'Επιτυχίες ' + year).replace(/"/g, '&quot;')}" loading="lazy" src="${src}"/>`;
      stage.appendChild(fig);
    }
    if (typeof window.initResultsCarousel === 'function') {
      const fresh = carousel.cloneNode(true);
      carousel.replaceWith(fresh);
      window.initResultsCarousel(fresh);
    }
  }
}

/* ---------- Ώρες προγράμματος ---------- */
async function hydrateProgram() {
  const tables = Array.from(document.querySelectorAll('[data-cms-program]'));
  if (!tables.length) return;
  const classKey = document.body.getAttribute('data-cms-class');
  if (!classKey) return;
  const { data } = await supabase
    .from('program_hours')
    .select('*')
    .eq('class_key', classKey)
    .order('sort_order', { ascending: true });
  if (!data || !data.length) return;

  tables.forEach((table) => {
    const season = table.getAttribute('data-cms-program');
    const rows = data.filter((r) => r.season === season);
    if (!rows.length) return;
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot td:last-child');
    if (!tbody) return;
    tbody.innerHTML = rows.map((r) => `<tr><td>${r.subject}</td><td>${Number(r.hours)}</td></tr>`).join('');
    if (tfoot) tfoot.textContent = String(rows.reduce((s, r) => s + Number(r.hours), 0));
  });
}


/* ---------- Εκπαιδευτικά νέα (grid στην αρχική) ---------- */
async function hydrateNewsGrid() {
  const grid = document.querySelector('[data-cms-news-grid]');
  if (!grid) return;
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('category', 'news')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(4);
  if (!data || !data.length) return;
  const cards = await Promise.all(data.map(async (a) => {
    const img = await resolveMedia(a.image_url);
    if (!img) return '';
    const esc = (v) => (v || '').replace(/"/g, '&quot;');
    return `<a class="news-hl-card" href="nea.html">
      <img alt="${esc(a.title)}" loading="lazy" src="${img}"/>
      <span class="news-hl-overlay"></span>
      <span class="news-hl-text"><span class="news-hl-label">${fmtDate(a.published_at)}</span><span class="news-hl-name">${a.title || ''}</span></span>
    </a>`;
  }));
  const html = cards.filter(Boolean).join('');
  if (html) grid.innerHTML = html;
}

const boot = () => {
  hydrateArticles();
  hydrateNewsGrid();
  hydrateSuccesses();
  hydrateProgram();
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
