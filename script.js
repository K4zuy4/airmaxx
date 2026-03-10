const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const year = document.getElementById('year');
const animatedElements = document.querySelectorAll(
  '.hero > .container > *, .section-head, .card, .gallery-item, .steps li, .review-card, .cta-box, .site-footer'
);
const heroVisual = document.querySelector('.hero-visual');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    }
  });
}

animatedElements.forEach((element, index) => {
  element.setAttribute('data-animate', '');
  element.style.transitionDelay = `${Math.min(index * 45, 320)}ms`;
});

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );

  animatedElements.forEach((element) => revealObserver.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add('in-view'));
}

if (!prefersReducedMotion && heroVisual) {
  heroVisual.addEventListener('pointermove', (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 8;

    heroVisual.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  heroVisual.addEventListener('pointerleave', () => {
    heroVisual.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}
