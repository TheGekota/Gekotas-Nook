/* Bascially Sets a timer that displays the Loading screen 
and then sets its display to none after 2 seconds is reached*/
window.addEventListener('DOMContentLoaded', function () {

  // If the URL has a hash (e.g. #featured-projects), skip loader
  if (window.location.hash) {
    const loader = document.getElementById('loader-overlay');
    if (loader) {
      loader.style.display = 'none';
    }
    document.body.classList.add('loaded');
    return;
  }

  // Normal home-page load animation
  const loader = document.getElementById('loader-overlay');

  setTimeout(() => {
    document.body.classList.add('loaded');

    setTimeout(() => {
      if (loader) loader.style.display = 'none';
    }, 700); // matches CSS transition
  }, 2000);
});


// Frog scroll animation and click to projects
document.addEventListener('DOMContentLoaded', function() {
  const frog = document.getElementById('scroll-frog');
  if (!frog) return;

  // Make frog scroll to projects on click
  frog.addEventListener('click', function() {
    const projects = document.getElementById('featured-projects');
    if (projects) {
      projects.scrollIntoView({ behavior: 'smooth' });
    }
  });

  let hasBlushed = false;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
      frog.classList.add('faded');
      if (!hasBlushed) {
        frog.src = 'assets/frog/blush_frog.png';
        hasBlushed = true;
      }
    } else {
      frog.classList.remove('faded');
      frog.src = 'assets/frog/frog.png';
      hasBlushed = false;
    }
  });
});


// Copy email to clipboard
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("copy-email");
  const email = "gekotasnook@email.com"; 

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    navigator.clipboard.writeText(email).then(() => {
      btn.classList.add("copied");
      btn.querySelector(".copy-tooltip").textContent = "Copied!";

      setTimeout(() => {
        btn.classList.remove("copied");
        btn.querySelector(".copy-tooltip").textContent = "Copy";
      }, 1200);
    });
  });
});


// Smooth mouse-based parallax for grid backgrounds
(function () {
  const section = document.body;
  const parallaxStrength = 40;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let autoParallax = window.innerWidth <= 1050;

  function updateParallaxMode() {
    autoParallax = window.innerWidth <= 1050;
    if (autoParallax) {
      targetX = 0;
      targetY = 0;
    }
  }

  window.addEventListener('resize', updateParallaxMode);

  document.addEventListener('mousemove', (e) => {
    if (!autoParallax) {
      targetX = (e.clientX / window.innerWidth - 0.5) * parallaxStrength;
      targetY = (e.clientY / window.innerHeight - 0.5) * parallaxStrength;
    }
  });

  function animateParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    section.style.backgroundPosition =
      `${Math.round(currentX)}px ${Math.round(currentY)}px, ` +
      `${Math.round(currentX)}px ${Math.round(currentY)}px`;

    requestAnimationFrame(animateParallax);
  }

  animateParallax();
})();


// About page illustration slideshow
const slides = document.querySelectorAll('.about-illustration .slide');
  let index = 0;

  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }, 2800);