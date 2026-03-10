const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const year = document.getElementById('year');
const animatedElements = document.querySelectorAll(
  '.hero-grid, main .section > .container, .site-footer .footer-inner'
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

animatedElements.forEach((element) => {
  element.setAttribute('data-animate', '');
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
    { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
  );

  const revealRemainingAtPageEnd = () => {
    const reachedPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    if (!reachedPageEnd) {
      return;
    }

    animatedElements.forEach((element) => {
      if (!element.classList.contains('in-view')) {
        element.classList.add('in-view');
        revealObserver.unobserve(element);
      }
    });

    window.removeEventListener('scroll', revealRemainingAtPageEnd);
    window.removeEventListener('resize', revealRemainingAtPageEnd);
  };

  animatedElements.forEach((element) => revealObserver.observe(element));
  revealRemainingAtPageEnd();
  window.addEventListener('scroll', revealRemainingAtPageEnd, { passive: true });
  window.addEventListener('resize', revealRemainingAtPageEnd);
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
