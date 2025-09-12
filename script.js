// Atualiza o ano no rodapé
document.getElementById('current-year').textContent = new Date().getFullYear();

/* Cache de seletores usados frequentemente */
const hero = document.querySelector('.hero');
const photos = Array.from(document.querySelectorAll('.photo'));
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-content img');
const lightboxClose = document.querySelector('.lightbox-close');
const header = document.querySelector('header');

/* Ajusta posição do background da hero conforme largura (melhora UX visual) */
function adjustHeroBackground() {
  if (!hero) return;
  if (window.innerWidth >= 1024) {
    hero.style.backgroundPosition = 'center 30%';
  } else {
    hero.style.backgroundPosition = 'center center';
  }
}

/* Lightbox: abrir imagem (com controle de foco e aria) */
function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

/* Fecha o lightbox e limpa atributos */
function closeLightbox() {
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

/* Inicializa efeitos de lightbox nas imagens da galeria */
function initLightbox() {
  if (!lightbox) return;

  photos.forEach(photo => {
    const src = photo.getAttribute('data-src');
    if (!src) return; // ignora placeholders vazios

    const openHandler = () => openLightbox(src, photo.querySelector('img')?.alt);
    photo.addEventListener('click', openHandler);
    photo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openHandler();
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox(); });
}

/* Scroll suave para âncoras internas, considerando a altura do header */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}

/* Inicialização */
document.addEventListener('DOMContentLoaded', () => {
  adjustHeroBackground();
  window.addEventListener('resize', adjustHeroBackground);

  initLightbox();
  initSmoothScroll();
});