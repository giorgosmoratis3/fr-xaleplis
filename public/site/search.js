// Site-wide header search (static index, works on all devices)
(() => {
  const PAGES = [
    { t: 'Αρχική', u: 'index.html', k: 'αρχικη home φροντιστηριο χαλεπλης λαμια' },
    { t: 'Η διαδρομή μας', u: 'i-diadromi-mas.html', k: 'ιστορια διαδρομη ποιοι ειμαστε about 1993' },
    { t: 'Ο χώρος μας', u: 'o-xoros-mas.html', k: 'χωρος αιθουσες εγκαταστασεις φωτογραφιες' },
    { t: 'Τι προσφέρουμε', u: 'index.html#advantages', k: 'πλεονεκτηματα προσφερουμε υπηρεσιες' },
    { t: 'Πρόγραμμα Σπουδών Α΄ Λυκείου', u: 'a-lykeiou.html', k: 'α λυκειου πρωτη προγραμμα σπουδων ωρες αρχαια εκθεση' },
    { t: 'Πρόγραμμα Σπουδών Β΄ Λυκείου', u: 'b-lykeiou.html', k: 'β λυκειου δευτερα προγραμμα σπουδων ωρες' },
    { t: 'Πρόγραμμα Σπουδών Γ΄ Λυκείου', u: 'g-lykeiou.html', k: 'γ λυκειου τριτη πανελλαδικες προγραμμα σπουδων λατινικα ιστορια' },
    { t: 'Γυμνάσιο', u: 'gymnasio.html', k: 'γυμνασιο προγραμμα σπουδων' },
    { t: 'Μεταλυκειακοί', u: 'metalykeiakoi.html', k: 'μεταλυκειακοι αποφοιτοι επαναληπτικες' },
    { t: 'Επιτυχίες 2026', u: 'epitixies-2026.html', k: 'επιτυχιες 2026 αποτελεσματα βαθμολογιες' },
    { t: 'Επιτυχίες 2025', u: 'epitixies-2025.html', k: 'επιτυχιες 2025 αποτελεσματα βαθμολογιες' },
    { t: 'Ανακοινώσεις / Press', u: 'anakoinoseis.html', k: 'ανακοινωσεις press αρθρα δημοσιευσεις' },
    { t: 'Εκπαιδευτικά νέα', u: 'index.html#news', k: 'νεα εκπαιδευτικα ενημερωση' },
    { t: 'Εκδηλώσεις & δράσεις', u: 'ekdiloseis.html', k: 'εκδηλωσεις δρασεις φωτογραφιες' },
    { t: 'Εκπαιδευτικές εκδρομές', u: 'ekdromes.html', k: 'εκδρομες βουλη παρθενωνας ταξιδια' },
    { t: 'Προσομοιώσεις', u: 'prosomoiosis.html', k: 'προσομοιωσεις διαγωνισματα εξετασεις' },
    { t: 'Τράπεζα Θεμάτων', u: 'trapeza-thematon.html', k: 'τραπεζα θεματων εξασκηση ιεπ' },
    { t: 'Επικοινωνία', u: 'index.html#contact', k: 'επικοινωνια τηλεφωνο email ενημερωση φορμα' },
    { t: 'Τοποθεσία', u: 'index.html#location', k: 'τοποθεσια χαρτης διευθυνση πλατεια ελευθεριας λαμια' },
    { t: 'Συχνές Ερωτήσεις', u: 'syxnes-erotiseis.html', k: 'συχνες ερωτησεις faq' },
    { t: 'Όροι Χρήσης', u: 'oroi-xrisis.html', k: 'οροι χρησης' },
    { t: 'Πολιτική Απορρήτου', u: 'politiki-aporritou.html', k: 'πολιτικη απορρητου προσωπικα δεδομενα gdpr' },
    { t: 'Πολιτική Cookies', u: 'politiki-cookies.html', k: 'cookies πολιτικη' },
  ];

  const norm = (s) =>
    (s || '')
      .toLocaleLowerCase('el')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ς/g, 'σ');

  const init = () => {
    const label = document.querySelector('.reference-search');
    if (!label) return;
    const input = label.querySelector('input');
    if (!input) return;

    label.classList.add('site-search');
    const panel = document.createElement('div');
    panel.className = 'site-search-results';
    panel.setAttribute('role', 'listbox');
    label.appendChild(panel);

    const close = () => {
      label.classList.remove('search-open');
      panel.classList.remove('show');
    };

    const render = (q) => {
      const nq = norm(q).trim();
      if (nq.length < 2) {
        panel.classList.remove('show');
        panel.innerHTML = '';
        return;
      }
      const terms = nq.split(/\s+/);
      const hits = PAGES.filter((p) => {
        const hay = norm(p.t + ' ' + p.k);
        return terms.every((t) => hay.includes(t));
      }).slice(0, 8);

      panel.innerHTML = hits.length
        ? hits.map((p) => `<a href="${p.u}">${p.t}</a>`).join('')
        : '<span class="site-search-empty">Δεν βρέθηκαν αποτελέσματα</span>';
      panel.classList.add('show');
    };

    input.addEventListener('input', () => render(input.value));
    input.addEventListener('focus', () => {
      label.classList.add('search-open');
      if (input.value) render(input.value);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { close(); input.blur(); }
      if (e.key === 'Enter') {
        e.preventDefault();
        const first = panel.querySelector('a');
        if (first) window.location.href = first.getAttribute('href');
      }
    });

    // Mobile: tapping the icon expands the field
    label.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      label.classList.add('search-open');
      input.focus();
    });

    document.addEventListener('click', (e) => {
      if (!label.contains(e.target)) close();
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
