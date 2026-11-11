// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const siteNav = document.getElementById('site-nav');
if (menuBtn && siteNav) {
  menuBtn.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
}

// Animate skill bars when they scroll into view
const bars = document.querySelectorAll('.bar i');
if (bars.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.level + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => io.observe(b));
}

// 1. Greeting that depends on the visitor's local time (Date object + if/else)
const greetingEl = document.getElementById('greeting');
if (greetingEl) {
  const hour = new Date().getHours();
  let greeting;
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';
  greetingEl.textContent = greeting + ' and welcome.';
}

// 2. Typing animation (array + setTimeout loop)
const typedEl = document.getElementById('typed');
if (typedEl) {
  const roles = ['Data Science student', 'AI researcher', 'web developer'];
  const typeSpeed = 90, deleteSpeed = 45, pauseTime = 1400;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, charIndex);
    let delay = deleting ? deleteSpeed : typeSpeed;
    if (!deleting && charIndex === word.length) { deleting = true; delay = pauseTime; }
    else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    setTimeout(typeLoop, delay);
  }
  if (reduceMotion) typedEl.textContent = roles[0]; else typeLoop();
}

// 3. Dark / light theme toggle (event handling + localStorage)
const headerWrap = document.querySelector('.site-header .wrap');
if (headerWrap) {
  const themeBtn = document.createElement('button');
  themeBtn.className = 'theme-btn';
  themeBtn.type = 'button';
  const applyTheme = theme => {
    document.documentElement.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    themeBtn.setAttribute('aria-pressed', theme === 'dark');
  };
  let saved = 'light';
  try { saved = localStorage.getItem('theme') || 'light'; } catch (e) {}
  applyTheme(saved);
  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
  const tools = document.createElement('div');
  tools.className = 'header-tools';
  tools.append(menuBtn, themeBtn);
  headerWrap.appendChild(tools);
}
