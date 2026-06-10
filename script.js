// ============================================================
// AdhikarAI – script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observerNav.observe(s));

  /* ---- Mobile menu toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ---- Scroll-triggered animations ---- */
  const animatedEls = document.querySelectorAll('[data-animate]');
  const observerAnim = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerAnim.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  animatedEls.forEach(el => observerAnim.observe(el));

  /* ---- Counter animation ---- */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  const startCounters = () => {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 16);
    });
  };

  const statsSection = document.querySelector('.stats-section');
  const observerStats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startCounters();
    });
  }, { threshold: 0.3 });
  if (statsSection) observerStats.observe(statsSection);

  /* ---- Features Carousel ---- */
  const track = document.getElementById('features-track');
  const slides = document.querySelectorAll('.features-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let currentSlide = 0;
  const totalSlides = slides.length;

  const goToSlide = (index) => {
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  };

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  dots.forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.getAttribute('data-index'), 10)));
  });

  // Auto-advance carousel every 5s
  let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  const trackOuter = document.querySelector('.features-track-outer');
  trackOuter.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
  trackOuter.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    }
  });

  /* ---- Newsletter Form ---- */
  const form = document.getElementById('newsletter-form');
  const successMsg = document.getElementById('newsletter-success');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    if (!emailInput.value || !emailInput.checkValidity()) {
      emailInput.style.borderColor = '#E74C3C';
      setTimeout(() => { emailInput.style.borderColor = ''; }, 2000);
      return;
    }
    form.style.display = 'none';
    successMsg.classList.add('show');
  });

  /* ---- Smooth scroll for nav links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 64; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
