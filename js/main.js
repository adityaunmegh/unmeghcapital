const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const header = document.querySelector('.motion-header');

root.classList.add('has-js');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('[data-reveal]').forEach((element, index) => {
  element.style.setProperty('--i', index % 4);
  revealObserver.observe(element);
});

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const currentScroll = window.scrollY;
    root.style.setProperty('--page-progress', `${Math.min(currentScroll / Math.max(document.documentElement.scrollHeight - innerHeight, 1), 1)}`);
    ticking = false;
  });
}, { passive: true });
header?.classList.add('is-solid');

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.motion-nav');
const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menu?.classList.toggle('is-open', !open);
  document.body.classList.toggle('menu-open', !open);
});
document.querySelectorAll('.motion-nav a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const businessButtons = [...document.querySelectorAll('[data-business-index]')];
const businessPanels = [...document.querySelectorAll('[data-business-panel]')];
function activateBusiness(index, shouldScroll = false) {
  if (index < 0 || index >= businessPanels.length) return;
  businessButtons.forEach((button, buttonIndex) => button.setAttribute('aria-selected', String(buttonIndex === index)));
  businessPanels.forEach((panel, panelIndex) => panel.classList.toggle('is-active', panelIndex === index));
  if (shouldScroll) businessPanels[index].scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
}
businessButtons.forEach((button, index) => button.addEventListener('click', () => activateBusiness(index, true)));

const businessObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) activateBusiness(businessPanels.indexOf(entry.target));
  });
}, { rootMargin: '-28% 0px -58% 0px' });
businessPanels.forEach((panel) => businessObserver.observe(panel));

const serviceLinks = document.querySelectorAll('[data-service]');
const serviceSelect = document.getElementById('f-svc');
serviceLinks.forEach((link) => link.addEventListener('click', () => {
  if (serviceSelect) serviceSelect.value = link.dataset.service;
  if (link.closest('.site-footer')) {
    activateBusiness(['corporate-finance', 'ma-advisory', 'valuation'].indexOf(link.dataset.service));
  }
}));

const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = (id) => document.getElementById(id).value.trim();
  const errors = {
    name: value('f-name') ? '' : 'Please enter your name.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('f-email')) ? '' : 'Please enter a valid email.',
    svc: value('f-svc') ? '' : 'Please choose a service.',
  };
  Object.entries(errors).forEach(([field, message]) => {
    document.getElementById(`e-${field}`).textContent = message;
  });
  if (Object.values(errors).some(Boolean)) {
    formMessage.textContent = '';
    return;
  }
  const service = serviceSelect.options[serviceSelect.selectedIndex].text;
  formMessage.textContent = `Thank you, ${value('f-name')}. Your enquiry about ${service} is ready. This page does not send messages yet. Please email connect@unmeghcapital.com or call +91 84110 27000 and our team will respond.`;
});

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.button--primary').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.12}px, ${(event.clientY - rect.top - rect.height / 2) * 0.12}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}
