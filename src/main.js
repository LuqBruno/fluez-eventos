const header = document.querySelector('[data-header]');
const meter = document.querySelector('.scroll-meter');
const process = document.querySelector('[data-process]');
const menu = document.querySelector('.menu');
const mobile = document.querySelector('#mobile-nav');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const progress = max > 0 ? Math.min(1, scrollY / max) : 0;
  meter.style.setProperty('--scroll', `${progress * 100}%`);
  header.classList.toggle('solid', scrollY > 24);

  if (process) {
    const rect = process.getBoundingClientRect();
    const span = rect.height + innerHeight * .55;
    const local = Math.max(0, Math.min(1, (innerHeight * .72 - rect.top) / span));
    process.style.setProperty('--process', `${local * 100}%`);
  }

  if (!reduced) {
    const visual = document.querySelector('[data-parallax]');
    if (visual && scrollY < innerHeight * 1.3) visual.style.transform = `translateY(${scrollY * .09}px)`;

    // Fallback para entradas por âncora e saltos longos de rolagem: a fotografia
    // nunca depende exclusivamente do IntersectionObserver para ficar visível.
    document.querySelectorAll('.image-reveal:not(.in-view)').forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < innerHeight * .96 && rect.bottom > 0) item.classList.add('in-view');
    });
  }
}
addEventListener('scroll', updateScroll, { passive: true });
addEventListener('resize', updateScroll, { passive: true });
updateScroll();

menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  menu.querySelector('span').textContent = open ? '＋' : '−';
  mobile.hidden = open;
});
mobile.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobile.hidden = true;
  menu.setAttribute('aria-expanded', 'false');
  menu.querySelector('span').textContent = '＋';
}));

const revealItems = document.querySelectorAll('.statement>*:not(.statement-grid),.statement-grid>*,.solution-content>*,.case-intro>*,.case-sequence>*,.project-heading>*,.secondary-cases>*,.process-head>*,.process-track>article,.about-copy>*,.briefing-grid>*,.image-reveal');
if (!reduced) {
  revealItems.forEach(item => {
    if (!item.classList.contains('image-reveal')) item.classList.add('reveal');
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }), { threshold: .08, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  document.querySelectorAll('.image-reveal').forEach(item => item.classList.add('in-view'));
}

const preview = document.querySelector('[data-service-preview]');
const previewBox = document.querySelector('.solution-preview');
const previewLabel = document.querySelector('[data-service-label]');
document.querySelectorAll('.solution-list article').forEach(item => {
  const activate = () => {
    const src = item.dataset.image;
    if (preview.getAttribute('src') === src) return;
    previewBox.classList.add('changing');
    const next = new Image();
    next.onload = () => {
      preview.src = src;
      previewLabel.textContent = item.dataset.label;
      requestAnimationFrame(() => previewBox.classList.remove('changing'));
    };
    next.src = src;
  };
  item.addEventListener('mouseenter', activate);
  item.addEventListener('focus', activate);
  item.addEventListener('click', activate);
});

if (!reduced && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .12;
      const y = (event.clientY - rect.top - rect.height / 2) * .16;
      button.style.transform = `translate(${x}px,${y}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

document.querySelector('#budget-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = `Olá! Gostaria de apresentar um evento à Fluez.\n\nNome: ${data.get('nome')}\nEmpresa: ${data.get('empresa')}\nTelefone: ${data.get('telefone')}\nE-mail: ${data.get('email')}\nTipo de evento: ${data.get('tipo')}\nCidade: ${data.get('cidade')}\nObjetivo e contexto: ${data.get('mensagem') || 'A conversar'}`;
  form.querySelector('.form-status').textContent = 'Briefing pronto. Abrindo o WhatsApp…';
  window.open(`https://wa.me/5548996276449?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
