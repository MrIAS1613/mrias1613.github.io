// Smooth scroll for anchor links + active nav highlight + accessible menu + theme toggle + reveal animations

// Helper: select
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if(!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if(target) target.scrollIntoView({behavior: 'smooth', block: 'start'});

    // close mobile nav if open
    if(window.innerWidth < 980){
      toggleNav(false);
    }
  });
});

// Mobile nav toggle
const navToggle = $('#navToggle');
const navList = $('#navList');
if(navToggle){
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    toggleNav(!expanded);
  });
}
function toggleNav(open){
  navToggle.setAttribute('aria-expanded', open);
  if(open){ navList.style.display = 'flex'; } else { navList.style.display = ''; }
}

// Active nav based on scroll
const navLinks = $$('.nav-link');
const sections = navLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

function onScroll(){
  const top = window.scrollY + 100;
  let current = sections[0];
  for(const sec of sections){
    if(sec.offsetTop <= top) current = sec;
  }
  navLinks.forEach(l => l.classList.toggle('active', document.querySelector(l.getAttribute('href')) === current));
}
window.addEventListener('scroll', onScroll);
onScroll();

// IntersectionObserver for reveal animations
const reveals = $$('.animate');
const obs = new IntersectionObserver((entries) =>{
  entries.forEach(e =>{ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
},{threshold:0.18});
reveals.forEach(r => obs.observe(r));

// Theme toggle with saved preference
const themeToggle = $('#themeToggle');
const root = document.documentElement;

function setTheme(isDark){
  if(isDark){ root.classList.add('dark'); themeToggle.textContent = '☀️'; themeToggle.setAttribute('aria-pressed', 'true'); }
  else{ root.classList.remove('dark'); themeToggle.textContent = '🌙'; themeToggle.setAttribute('aria-pressed', 'false'); }
  try{ localStorage.setItem('prefers-dark', isDark ? '1' : '0'); } catch(e){}
}

// Initialize theme from localStorage or OS
(function(){
  let pref = null;
  try{ pref = localStorage.getItem('prefers-dark'); } catch(e){}
  if(pref === null){
    const osDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(osDark);
  } else {
    setTheme(pref === '1');
  }
})();

themeToggle.addEventListener('click', () => setTheme(!root.classList.contains('dark')));

// Accessibility: close menu on resize "desktop"
window.addEventListener('resize', () => { if(window.innerWidth > 980) { navList.style.display = ''; navToggle.setAttribute('aria-expanded','false'); } });

// Small UX: focus visible outline for keyboard users
window.addEventListener('keydown', (e)=>{ if(e.key === 'Tab') document.body.classList.add('show-focus'); }, { once: true });
