// Waru Portfolio - Main JavaScript

/* -----------------------------------------------------------------
   NAV: hambúrguer mobile + destaque do item da página atual
   ver prompts-ajustes-site-renatowaru.md item 1
   ----------------------------------------------------------------- */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  if (!header) return;

  var toggle = header.querySelector('.nav-toggle');
  var nav = header.querySelector('.site-nav');
  if (!toggle || !nav) return;

  function isOpen() {
    return nav.classList.contains('is-open');
  }

  function openNav() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.addEventListener('click', onOutsideClick, true);
    document.addEventListener('keydown', onKeydown);
  }

  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.removeEventListener('click', onOutsideClick, true);
    document.removeEventListener('keydown', onKeydown);
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (isOpen()) {
      closeNav();
    } else {
      openNav();
    }
  });

  // fecha ao clicar num link do menu
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  // fecha ao clicar fora do header
  function onOutsideClick(e) {
    if (!header.contains(e.target)) closeNav();
  }

  // fecha com ESC e devolve o foco ao botão
  function onKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeNav();
      toggle.focus();
    }
  }

  // se a janela voltar para largura desktop com o menu aberto, fecha
  var desktop = window.matchMedia('(min-width: 769px)');
  function onBreakpoint(e) {
    if (e.matches) closeNav();
  }
  if (desktop.addEventListener) {
    desktop.addEventListener('change', onBreakpoint);
  } else if (desktop.addListener) {
    desktop.addListener(onBreakpoint);
  }

  // destaca o item correspondente à página atual (só links de página "cheia")
  var here = window.location.pathname.split('/').pop() || 'index.html';
  var links = nav.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href') || '';
    var hasHash = href.indexOf('#') > -1;
    var file = href.split('#')[0].split('/').pop();
    if (!hasHash && file === here) {
      links[i].classList.add('is-current');
      links[i].setAttribute('aria-current', 'page');
    }
  }
})();

/* -----------------------------------------------------------------
   VOLTAR AO TOPO: so no mobile (o CSS esconde no desktop).
   Aparece depois de 600px de rolagem; ao clicar volta ao topo
   (suave, exceto com prefers-reduced-motion) e o foco vai para o logo.
   ----------------------------------------------------------------- */
(function () {
  'use strict';

  var btn = document.querySelector('.back-to-top');
  if (!btn) return;
  btn.hidden = false;   // sem JS o botao continua escondido

  var THRESHOLD = 600;
  var ticking = false;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function update() {
    ticking = false;
    btn.classList.toggle('is-visible', window.scrollY > THRESHOLD);
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  update();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    var logo = document.querySelector('.site-wordmark');
    if (logo) logo.focus({ preventScroll: true });
  });
})();

/* -----------------------------------------------------------------
   In their words (testimonials): setas alternam os depoimentos em loop, sem autoplay.
   O fade vem do CSS (desligado com prefers-reduced-motion).
   ----------------------------------------------------------------- */
(function () {
  'use strict';

  var wrapper = document.querySelector('.testimonial-wrapper');
  if (!wrapper) return;

  var slides = wrapper.querySelectorAll('.testimonial-slide');
  var prev = wrapper.querySelector('.testimonial-prev');
  var next = wrapper.querySelector('.testimonial-next');
  if (slides.length < 2 || !prev || !next) return;

  var current = 0;
  for (var i = 0; i < slides.length; i++) {
    if (slides[i].classList.contains('is-active')) current = i;
  }

  function show(index) {
    current = (index + slides.length) % slides.length;
    for (var j = 0; j < slides.length; j++) {
      slides[j].classList.toggle('is-active', j === current);
    }
  }

  prev.addEventListener('click', function () { show(current - 1); });
  next.addEventListener('click', function () { show(current + 1); });
})();
