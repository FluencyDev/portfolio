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

  var savedScrollY = 0;

  function isOpen() {
    return nav.classList.contains('is-open');
  }

  function openNav() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    nav.classList.add('is-open');
    document.body.classList.add('nav-open');   /* trava o scroll do body (overflow:hidden) */
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.addEventListener('click', onOutsideClick, true);
    document.addEventListener('keydown', onKeydown);
  }

  function closeNav() {
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');   /* destrava o scroll do body */
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.removeEventListener('click', onOutsideClick, true);
    document.removeEventListener('keydown', onKeydown);
    // restaura a posição caso o browser tenha zerado o scroll durante o overflow:hidden
    window.scrollTo(0, savedScrollY);
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
