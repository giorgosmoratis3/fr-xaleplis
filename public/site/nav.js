(() => {
  const init = () => {
    const toggle = document.querySelector('.reference-menu-toggle');
    const nav = document.querySelector('.reference-nav');
    if (!toggle || !nav) return;

    const items = Array.from(nav.querySelectorAll('.has-dropdown'));
    const closeDropdowns = (except = null) => {
      items.forEach(item => {
        if (item === except) return;
        item.classList.remove('dropdown-open');
        item.querySelector('.nav-link')?.setAttribute('aria-expanded', 'false');
      });
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (!open) closeDropdowns();
    });

    items.forEach(item => {
      const button = item.querySelector('.nav-link');
      button?.addEventListener('click', (event) => {
        event.preventDefault();
        const willOpen = !item.classList.contains('dropdown-open');
        closeDropdowns(item);
        item.classList.toggle('dropdown-open', willOpen);
        button.setAttribute('aria-expanded', String(willOpen));
      });
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      closeDropdowns();
    }));

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeDropdowns();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDropdowns();
        nav.classList.remove('is-open');
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
