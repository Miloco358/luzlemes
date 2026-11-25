/* Página de portfólio: filtros por categoria e lightbox com teclado */
(function () {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  const shots = Array.from(gallery.querySelectorAll('.shot'));
  const filters = Array.from(document.querySelectorAll('.filter'));
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('figcaption');
  const btnClose = lightbox.querySelector('.lb-close');
  const btnPrev = lightbox.querySelector('.lb-prev');
  const btnNext = lightbox.querySelector('.lb-next');

  let visible = [];
  let current = 0;
  let lastFocus = null;

  /* Filtros — o estado também fica na URL (?categoria=mujeres) */
  function applyFilter(cat) {
    shots.forEach((s) => { s.hidden = cat !== 'todos' && s.dataset.cat !== cat; });
    visible = shots.filter((s) => !s.hidden);
    filters.forEach((f) => f.setAttribute('aria-pressed', String(f.dataset.filter === cat)));

    const url = new URL(window.location.href);
    if (cat === 'todos') url.searchParams.delete('categoria');
    else url.searchParams.set('categoria', cat);
    history.replaceState(null, '', url);
  }

  filters.forEach((f) => f.addEventListener('click', () => applyFilter(f.dataset.filter)));

  const initial = new URLSearchParams(window.location.search).get('categoria');
  applyFilter(filters.some((f) => f.dataset.filter === initial) ? initial : 'todos');

  /* Lightbox */
  function show(index) {
    current = (index + visible.length) % visible.length;
    const shot = visible[current];
    const img = shot.querySelector('img');
    lbImg.src = shot.dataset.full;
    lbImg.alt = img.alt;
    lbCaption.textContent = shot.querySelector('figcaption').textContent;
  }

  function open(index) {
    lastFocus = document.activeElement;
    show(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  gallery.addEventListener('click', (e) => {
    const btn = e.target.closest('.shot-btn');
    if (!btn) return;
    open(visible.indexOf(btn.closest('.shot')));
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
