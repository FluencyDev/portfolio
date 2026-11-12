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

/* -----------------------------------------------------------------
   Riza Mix: animacao das guias (componente do snippet, logica sem alteracao)
   ----------------------------------------------------------------- */
(function () {
  'use strict';
  document.querySelectorAll('.rmg').forEach(function(f){
    var b=f.querySelector('.rmg-toggle');
    b.addEventListener('click',function(){
      var p=f.dataset.paused!=='true';
      f.dataset.paused=p;
      b.setAttribute('aria-label',p?'Play animation':'Pause animation');
    });
  });
})();

/* -----------------------------------------------------------------
   Riza Mix: palco com seletor das cinco sublinhas.
   Ciclo de 4s a partir de Precoce; pausa com hover, foco, clique num cartao
   ou botao Pause/Play. Sem aria-live. Com prefers-reduced-motion: sem
   autoplay e sem botao; os cartoes continuam selecionaveis.
   ----------------------------------------------------------------- */
(function () {
  'use strict';

  var root = document.querySelector('.rmx-lines');
  if (!root) return;

  var cards = root.querySelectorAll('.rmx-card');
  var pics = root.querySelectorAll('.rmx-stack picture');
  var toggle = root.querySelector('.rmx-toggle');
  if (!cards.length || !toggle) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var INTERVAL = 4000;
  var current = 0;
  var timer = null;
  var userPaused = false;
  var hovering = false;
  var focusing = false;
  var touching = false;
  var strip = root.querySelector('.rmx-cards');

  function show(index) {
    current = (index + cards.length) % cards.length;
    var key = cards[current].getAttribute('data-line');
    var i;
    for (i = 0; i < cards.length; i++) {
      var on = i === current;
      cards[i].classList.toggle('is-active', on);
      cards[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    for (i = 0; i < pics.length; i++) {
      var match = pics[i].getAttribute('data-line') === key;
      pics[i].classList.toggle('is-active', match);
      if (match) pics[i].removeAttribute('aria-hidden');
      else pics[i].setAttribute('aria-hidden', 'true');
    }
    centerActiveCard();
  }

  /* Mobile: a fileira de cartoes rola na horizontal. Leva o ativo ao centro
     rolando so o container (scrollIntoView puxaria a pagina na vertical a cada
     troca do ciclo). Sem animacao com prefers-reduced-motion. */
  function centerActiveCard() {
    if (!strip || strip.scrollWidth <= strip.clientWidth + 1) return;
    var card = cards[current];
    var left = card.offsetLeft - (strip.clientWidth - card.offsetWidth) / 2;
    strip.scrollTo({ left: left, behavior: reduce.matches ? 'auto' : 'smooth' });
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function sync() {
    stop();
    if (reduce.matches || userPaused || hovering || focusing || touching) return;
    timer = setInterval(function () { show(current + 1); }, INTERVAL);
  }

  function setUserPaused(value) {
    userPaused = value;
    toggle.setAttribute('data-paused', value ? 'true' : 'false');
    toggle.setAttribute('aria-label', value ? 'Play sub-line cycle' : 'Pause sub-line cycle');
    sync();
  }

  function applyMotionPreference() {
    toggle.hidden = reduce.matches;
    if (reduce.matches) { stop(); show(0); }
    else sync();
  }

  for (var i = 0; i < cards.length; i++) {
    (function (index) {
      cards[index].addEventListener('click', function () {
        show(index);
        setUserPaused(true);
      });
    })(i);
  }

  toggle.addEventListener('click', function () {
    /* Play explicito vale mesmo com o mouse ou o foco ainda no palco */
    if (userPaused) { hovering = false; focusing = false; }
    setUserPaused(!userPaused);
  });

  /* Nao deixa o ciclo disputar com o gesto de arrastar a fileira no toque */
  root.addEventListener('touchstart', function () { touching = true; sync(); }, { passive: true });
  root.addEventListener('touchend', function () { touching = false; sync(); }, { passive: true });
  root.addEventListener('touchcancel', function () { touching = false; sync(); }, { passive: true });

  root.addEventListener('mouseenter', function () { hovering = true; sync(); });
  root.addEventListener('mouseleave', function () { hovering = false; sync(); });
  root.addEventListener('focusin', function (e) {
    if (e.target.classList.contains('rmx-card')) { focusing = true; sync(); }
  });
  root.addEventListener('focusout', function (e) {
    var next = e.relatedTarget;
    if (!next || !next.classList || !next.classList.contains('rmx-card')) { focusing = false; sync(); }
  });

  if (reduce.addEventListener) reduce.addEventListener('change', applyMotionPreference);
  applyMotionPreference();
})();


/* -----------------------------------------------------------------
   Home: relogios do Working together (New York, Sao Paulo, Sydney).
   Cada <figure class="clock" data-tz="..."> recebe o horario ao vivo do seu fuso.
   ----------------------------------------------------------------- */
(function () {
  'use strict';

  var clocks = document.querySelectorAll('.clock[data-tz]');
  if (!clocks.length || !window.Intl || !Intl.DateTimeFormat) return;

  var items = [];
  Array.prototype.forEach.call(clocks, function (el) {
    var tz = el.getAttribute('data-tz');
    try {
      items.push({
        h: el.querySelector('.clock-hand--h'),
        m: el.querySelector('.clock-hand--m'),
        s: el.querySelector('.clock-hand--s'),
        label: el.querySelector('.clock-time'),
        parts: new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' }),
        text: new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' })
      });
    } catch (e) { /* fuso nao suportado: o relogio fica parado */ }
  });

  function rotate(line, deg) {
    if (line) line.setAttribute('transform', 'rotate(' + deg.toFixed(2) + ' 50 50)');
  }

  function tick() {
    var now = new Date();
    items.forEach(function (it) {
      var p = {};
      it.parts.formatToParts(now).forEach(function (x) { p[x.type] = parseInt(x.value, 10); });
      var h = (p.hour || 0) % 12, m = p.minute || 0, s = p.second || 0;
      rotate(it.h, (h + m / 60) * 30);
      rotate(it.m, (m + s / 60) * 6);
      rotate(it.s, s * 6);
      if (it.label) it.label.textContent = it.text.format(now);
    });
  }

  tick();
  setInterval(tick, 1000);
})();

/* Yvy: o ano, mes a mes.
   Desktop: prende a secao e converte o scroll vertical em deslocamento horizontal.
   Mobile ou movimento reduzido: faixa nativa com scroll-snap.
   Nos dois modos, o indicador e uma linha de comprimento fixo que se curva
   ate fechar um circulo em dezembro: do linear ao circular. */
(function () {
  var sec = document.querySelector('.yvy-year');
  if (!sec) return;
  var pin = sec.querySelector('.yvy-year-pin');
  var track = sec.querySelector('.yvy-year-track');
  var months = sec.querySelectorAll('.yvy-month:not(.yvy-month--end)');
  var base = sec.querySelector('.yvy-loop-base');
  var path = sec.querySelector('.yvy-loop-path');
  var dots = sec.querySelectorAll('.yvy-loop-dot');
  var numEl = sec.querySelector('.yvy-loop-n');
  var monEl = sec.querySelector('.yvy-loop-m');
  var header = document.querySelector('.site-header');

  var L = 214, N = 12, CX = 110, BY = 74;
  var desktop = window.matchMedia('(min-width: 769px)');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ticking = false;

  function pt(k, s) {
    if (k < 1e-6) return [CX + s, BY];
    return [CX + Math.sin(k * s) / k, BY - (1 - Math.cos(k * s)) / k];
  }

  function draw(p) {
    var k = p * 2 * Math.PI / L, d = '';
    for (var i = 0; i <= 72; i++) {
      var q = pt(k, -L / 2 + L * i / 72);
      d += (i ? 'L' : 'M') + q[0].toFixed(2) + ' ' + q[1].toFixed(2);
    }
    base.setAttribute('d', d);
    path.setAttribute('d', d);
    path.style.strokeDashoffset = (L * (1 - p)).toFixed(1);
    var active = Math.min(N - 1, Math.floor(p * N * 0.999));
    for (var j = 0; j < dots.length; j++) {
      var c = pt(k, -L / 2 + (j + 0.5) * L / N);
      dots[j].setAttribute('cx', c[0].toFixed(2));
      dots[j].setAttribute('cy', c[1].toFixed(2));
      dots[j].classList.toggle('is-on', (j + 0.5) / N <= p + 0.001);
    }
    numEl.textContent = String(active + 1).padStart(2, '0');
    monEl.textContent = months[active].getAttribute('data-month');
    sec.classList.toggle('is-full', p > 0.995);
  }

  function pinned() { return desktop.matches && !calm.matches; }

  function layout() {
    var on = pinned();
    sec.classList.toggle('is-pinned', on);
    if (on) {
      var top = header ? header.offsetHeight : 0;
      sec.style.setProperty('--yvy-top', top + 'px');
      var dist = track.scrollWidth - window.innerWidth;
      sec.style.height = (dist + window.innerHeight - top) + 'px';
    } else {
      sec.style.height = '';
      track.style.transform = '';
    }
    update();
  }

  /* Ponto de leitura: anda da borda esquerda a direita conforme o scroll.
     O progresso do circulo sai da posicao dos cards em relacao a esse ponto,
     entao o mes indicado e sempre o que esta na tela. */
  var cards = sec.querySelectorAll('.yvy-month');
  function progress(s, box) {
    /* fica no centro da tela; so nas pontas corre ate a borda,
       para a linha comecar reta e o circulo fechar no fim */
    var f = s < 0.04 ? 0.5 * s / 0.04 : (s > 0.92 ? 0.5 + 0.5 * (s - 0.92) / 0.08 : 0.5);
    var read = box.left + f * box.width;
    var xs = [], ps = [];
    var r0 = cards[0].getBoundingClientRect();
    xs.push(r0.left); ps.push(0);
    for (var i = 0; i < cards.length; i++) {
      var r = cards[i].getBoundingClientRect();
      xs.push(r.left + r.width / 2);
      ps.push(i < N ? (i + 0.5) / N : 1);
    }
    if (read <= xs[0]) return 0;
    for (var j = 1; j < xs.length; j++) {
      if (read <= xs[j]) {
        return ps[j - 1] + (ps[j] - ps[j - 1]) * (read - xs[j - 1]) / (xs[j] - xs[j - 1]);
      }
    }
    return 1;
  }

  function update() {
    ticking = false;
    var s, box;
    if (pinned()) {
      var top = header ? header.offsetHeight : 0;
      var range = sec.offsetHeight - pin.offsetHeight;
      var y = -sec.getBoundingClientRect().top + top;
      s = range > 0 ? Math.min(1, Math.max(0, y / range)) : 0;
      var dist = track.scrollWidth - window.innerWidth;
      track.style.transform = 'translate3d(' + (-s * dist).toFixed(1) + 'px,0,0)';
      box = { left: 0, width: window.innerWidth };
    } else {
      var max = track.scrollWidth - track.clientWidth;
      s = max > 0 ? track.scrollLeft / max : 0;
      box = track.getBoundingClientRect();
    }
    draw(progress(s, box));
  }

  function request() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', request, { passive: true });
  track.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', layout);
  desktop.addEventListener('change', layout);
  calm.addEventListener('change', layout);
  window.addEventListener('load', layout);
  layout();
})();

/* Nossa Terra: revela o logo escondido no vazio do desenho */
(function () {
  var btn = document.querySelector('.yvy-reveal-btn');
  var art = document.querySelector('.yvy-art');
  if (!btn || !art) return;
  btn.addEventListener('click', function () {
    var on = !art.classList.contains('is-revealed');
    art.classList.toggle('is-revealed', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? 'Show the drawing' : 'Find the logo';
  });
})();

/* Home, What I Do: luz que segue o mouse sobre a textura (so com mouse de verdade) */
(function () {
  var sec = document.querySelector('.services-section--light');
  if (!sec) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var tx = 0, ty = 0, x = 0, y = 0, raf = null;
  function set() {
    sec.style.setProperty('--mx', x.toFixed(1) + 'px');
    sec.style.setProperty('--my', y.toFixed(1) + 'px');
  }
  function tick() {
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    set();
    raf = (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) ? requestAnimationFrame(tick) : null;
  }
  function target(e) {
    var r = sec.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
  }
  sec.addEventListener('pointerenter', function (e) {
    target(e); x = tx; y = ty; set();
    sec.classList.add('is-lit');
  });
  sec.addEventListener('pointermove', function (e) {
    target(e);
    if (!raf) raf = requestAnimationFrame(tick);
  });
  sec.addEventListener('pointerleave', function () { sec.classList.remove('is-lit'); });
})();
