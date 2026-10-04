/* Joy — the quieter pages: both languages are in the page, one shows at a time. */
(function () {
  'use strict';
  var root = document.documentElement;
  var titles = { en: root.getAttribute('data-title-en'), ka: root.getAttribute('data-title-ka') };
  function set(lang, remember) {
    root.lang = lang;
    if (titles[lang]) document.title = titles[lang];
    Array.prototype.forEach.call(document.querySelectorAll('.lang button'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    if (remember) { try { localStorage.setItem('joy.lang', lang); } catch (e) {} }
  }
  Array.prototype.forEach.call(document.querySelectorAll('.lang button'), function (b) {
    b.addEventListener('click', function () { set(b.getAttribute('data-lang'), true); });
  });
  set(root.lang === 'ka' ? 'ka' : 'en', false);
})();
