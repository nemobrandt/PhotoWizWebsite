// Photo Wiz: small progressive enhancements. The site works fine without JS.
(function () {
  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Header shadow once scrolled
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Before/after slider
  var ba = document.getElementById('ba');
  if (ba) {
    var range = ba.querySelector('.ba-range');
    var syncSlider = function () {
      var v = Number(range.value);
      ba.style.setProperty('--pos', v + '%');
      ba.classList.toggle('show-after', v > 30);    // "After Photo Wiz" once enough edited photo shows
      ba.classList.toggle('show-before', v < 70);   // "Before Photo Wiz" while the original is still showing
    };
    range.addEventListener('input', function () { syncSlider(); ba.classList.add('touched'); });
    // browsers can restore the slider's old position on reload, so keep the picture in step
    window.addEventListener('pageshow', syncSlider);
    syncSlider();
  }

  // Copy email buttons
  document.querySelectorAll('.copy-email').forEach(function (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      var hint = copyBtn.querySelector('.copy-hint');
      function done(msg) {
        hint.textContent = msg;
        setTimeout(function () { hint.textContent = 'Copy'; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done('Copied!'); }, function () { done('Press Ctrl+C'); });
      } else {
        done('Copy failed');
      }
    });
  });

  // Highlight the navbar link for the section currently on screen
  if ('IntersectionObserver' in window) {
    var links = {};
    menu.querySelectorAll('a[href^="#"]:not(.btn)').forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      links[id === 'about' ? 'contact' : id] = a;   // "About" lives in the contact section
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        var link = links[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (sec) { spy.observe(sec); });
  }

  // Floating arrow: appears once you start scrolling and jumps to the next
  // section. At the bottom of the page it flips to take you back to the top.
  var nextBtn = document.querySelector('.next-arrow');
  if (nextBtn) {
    var sections = Array.prototype.slice.call(document.querySelectorAll('main > section'));
    var atEnd = function () {
      return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    };
    var updateArrow = function () {
      var end = atEnd();
      nextBtn.classList.toggle('show', window.scrollY > 40);
      nextBtn.classList.toggle('up', end);
      nextBtn.setAttribute('aria-label', end ? 'Back to the top' : 'Go to the next section');
    };
    window.addEventListener('scroll', updateArrow, { passive: true });
    window.addEventListener('resize', updateArrow);
    updateArrow();

    nextBtn.addEventListener('click', function () {
      if (atEnd()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      var next = sections.filter(function (sec) { return sec.getBoundingClientRect().top > 30; })[0];
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Fade sections in on scroll
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var items = document.querySelectorAll('.section-head, .card, .steps li, .privacy-list li, .meet > *, .faq');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });
    items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
