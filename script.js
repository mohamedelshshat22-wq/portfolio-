// Mobile navigation and gentle reveal-on-scroll effects.
const themeButton = document.querySelector('.theme-toggle');
const themeIcon = themeButton.querySelector('.theme-icon');
const themeLabel = themeButton.querySelector('.theme-label');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const themeStorageKey = 'mohamed-portfolio-theme';

// Restore the saved theme; dark remains the default if storage is unavailable.
let savedTheme = null;
try {
  savedTheme = localStorage.getItem(themeStorageKey);
} catch (error) {
  // Storage can be disabled by browser privacy settings or file:// restrictions.
}

function applyTheme(theme, save = false) {
  const isLight = theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
  themeButton.setAttribute('aria-pressed', String(isLight));
  themeLabel.textContent = isLight ? 'Light mode' : 'Dark mode';
  themeIcon.textContent = isLight ? '☼' : '☾';
  themeColorMeta.setAttribute('content', isLight ? '#f4f5f1' : '#0b0d12');

  if (save) {
    try {
      localStorage.setItem(themeStorageKey, isLight ? 'light' : 'dark');
    } catch (error) {
      // The toggle still works for this page view when storage is unavailable.
    }
  }
}

applyTheme(savedTheme === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme, true);
});

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function setMenuOpen(isOpen, returnFocus = false) {
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  navLinks.classList.toggle('open', isOpen);
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  setMenuOpen(!isOpen);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false, true);
  }
});

// Close the mobile menu after selecting a section.
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenuOpen(false);
  });
});

// Animate reveals only after the observer initializes successfully.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  try {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.documentElement.classList.add('js-reveal');
    revealItems.forEach((item) => observer.observe(item));
  } catch (error) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelector('#year').textContent = new Date().getFullYear();
