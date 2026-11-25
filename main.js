// ===== Настройки =====
// Адрес, на который приходят сообщения из формы обратной связи.
const FEEDBACK_EMAIL = ''; // TODO: вписать почту команды, например 'medstart@mail.ru'
const PHOTO_CREDITS = 'Unsplash (unsplash.com) — свободная лицензия';

// Header background on scroll
const header = document.querySelector('.header');
const onScroll = () => { if (!header.classList.contains('solid')) header.classList.toggle('scrolled', window.scrollY > 40); };
window.addEventListener('scroll', onScroll); onScroll();

// Mobile menu
const burger = document.getElementById('burger');
const links = document.getElementById('navLinks');
burger.addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// Active link highlight
const sections = [...document.querySelectorAll('section[id]')];
const navA = [...links.querySelectorAll('a[href^="#"]')];
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

// Reveal on scroll + counters
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    const n = e.target.querySelector('[data-count]');
    if (n && !n.dataset.done) {
      n.dataset.done = 1;
      const end = +n.dataset.count, pre = n.dataset.prefix || '', suf = n.dataset.suffix || '';
      const t0 = performance.now();
      const tick = t => { const p = Math.min((t - t0) / 1200, 1); n.textContent = pre + Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }
    io.unobserve(e.target);
  });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// SWOT tabs
document.querySelectorAll('.swot-tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.swot-tab').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.swot-panel').forEach(p => p.classList.toggle('active', p.dataset.k === btn.dataset.k));
}));

// Email + credits
document.querySelectorAll('.js-email').forEach(a => { if (FEEDBACK_EMAIL) { a.textContent = FEEDBACK_EMAIL; a.href = 'mailto:' + FEEDBACK_EMAIL; } else { a.textContent = 'появится перед запуском'; a.removeAttribute('href'); } });
document.querySelectorAll('.js-credits').forEach(s => s.textContent = PHOTO_CREDITS);

// Feedback form -> opens mail client with a prepared letter
const form = document.getElementById('feedbackForm');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const subject = `MedStart: ${d.get('topic')} — ${d.get('name')}`;
  const body = `Имя: ${d.get('name')}\nE-mail: ${d.get('email')}\nКто я: ${d.get('who')}\nТема: ${d.get('topic')}\n\n${d.get('message')}`;
  const ok = document.getElementById('formOk');
  ok.style.display = 'block';
  if (!FEEDBACK_EMAIL) { ok.textContent = 'Форма обратной связи заработает после публичного запуска проекта (11.12.2026). Спасибо за интерес к MedStart!'; return; }
  window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
