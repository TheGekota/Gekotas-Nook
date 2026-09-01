/* ==========================================================================
   Gekota's Nook — site scripts

   Every block below guards for the elements it needs, because one script is
   shared by the home page, the about page and the case studies.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* --- Loading screen ---------------------------------------------------
     Shows the frog for two seconds, then fades out. Skipped when the URL
     already points at a section, so deep links land where they should. */
  function initLoader() {
    var loader = document.getElementById("loader-overlay");
    if (!loader) return;

    if (window.location.hash || prefersReducedMotion) {
      loader.style.display = "none";
      document.body.classList.add("loaded");
      return;
    }

    setTimeout(function () {
      document.body.classList.add("loaded");
      setTimeout(function () {
        loader.style.display = "none";
      }, 700); // matches the CSS fade
    }, 2000);
  }

  /* --- Hero frog --------------------------------------------------------
     Clicking it scrolls to the projects; it blushes and fades on scroll. */
  function initScrollFrog() {
    var frog = document.getElementById("scroll-frog");
    if (!frog) return;

    var restSrc = frog.getAttribute("src");
    var blushSrc = restSrc.replace("frog.png", "blush_frog.png");
    var isBlushing = false;

    frog.addEventListener("click", function () {
      var projects = document.getElementById("featured-projects");
      if (projects) {
        projects.scrollIntoView({ behavior: "smooth" });
      }
    });

    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 10) {
          frog.classList.add("faded");
          if (!isBlushing) {
            frog.src = blushSrc;
            isBlushing = true;
          }
        } else {
          frog.classList.remove("faded");
          if (isBlushing) {
            frog.src = restSrc;
            isBlushing = false;
          }
        }
      },
      { passive: true }
    );
  }

  /* --- Rotating job title in the hero -----------------------------------
     Types a role out, holds it, deletes it, moves to the next. The full list
     is in the markup as visually-hidden text, so screen readers get all three
     roles at once instead of a half-typed word. */
  function initRoleTypewriter() {
    var el = document.getElementById("role-text");
    if (!el) return;

    var roles = ["Product Designer", "HCI Researcher", "Project Coordinator"];
    var roleIndex = 0;

    if (prefersReducedMotion) {
      el.textContent = roles[0];
      return;
    }

    var TYPE_MS = 85; // per character, typing
    var ERASE_MS = 40; // per character, deleting
    var HOLD_MS = 1900; // pause on a finished role
    var GAP_MS = 350; // pause on an empty line

    var charCount = 0;
    var erasing = false;

    function tick() {
      var role = roles[roleIndex];

      if (!erasing) {
        charCount++;
        el.textContent = role.slice(0, charCount);

        if (charCount === role.length) {
          erasing = true;
          setTimeout(tick, HOLD_MS);
          return;
        }
        setTimeout(tick, TYPE_MS);
        return;
      }

      charCount--;
      el.textContent = role.slice(0, charCount);

      if (charCount === 0) {
        erasing = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, GAP_MS);
        return;
      }
      setTimeout(tick, ERASE_MS);
    }

    tick();
  }

  /* --- Copy email button ------------------------------------------------ */
  function initCopyEmail() {
    var btn = document.getElementById("copy-email");
    if (!btn) return;

    var tooltip = btn.querySelector(".copy-tooltip");
    var email = btn.dataset.email;
    if (!email) return;

    btn.addEventListener("click", function (e) {
      e.preventDefault();

      function confirmCopy(message) {
        btn.classList.add("copied");
        if (tooltip) tooltip.textContent = message;
        setTimeout(function () {
          btn.classList.remove("copied");
          if (tooltip) tooltip.textContent = "Copy";
        }, 1200);
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(
          function () {
            confirmCopy("Copied!");
          },
          function () {
            confirmCopy(email);
          }
        );
      } else {
        confirmCopy(email);
      }
    });
  }

  /* --- Background parallax ----------------------------------------------
     Nudges the grid with the cursor. Disabled on narrow screens, where
     there is no cursor to follow. */
  function initParallax() {
    if (prefersReducedMotion) return;

    var strength = 40;
    var targetX = 0;
    var targetY = 0;
    var currentX = 0;
    var currentY = 0;
    var enabled = window.innerWidth > 1050;

    window.addEventListener("resize", function () {
      enabled = window.innerWidth > 1050;
      if (!enabled) {
        targetX = 0;
        targetY = 0;
      }
    });

    document.addEventListener("mousemove", function (e) {
      if (!enabled) return;
      targetX = (e.clientX / window.innerWidth - 0.5) * strength;
      targetY = (e.clientY / window.innerHeight - 0.5) * strength;
    });

    (function animate() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      var x = Math.round(currentX);
      var y = Math.round(currentY);
      document.body.style.backgroundPosition = x + "px " + y + "px, " + x + "px " + y + "px";

      requestAnimationFrame(animate);
    })();
  }

  /* --- About page illustration ------------------------------------------ */
  function initAboutSlideshow() {
    var slides = document.querySelectorAll(".about-illustration .slide");
    if (slides.length < 2) return;

    var index = 0;
    setInterval(function () {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, 2800);
  }

  /* --- Case study section nav -------------------------------------------
     Builds the sidebar from the sections on the page, so adding a new
     <section class="case-section"> to a case study is all it takes for a
     link to appear. Highlights whichever section you are reading. */
  function initCaseNav() {
    var nav = document.getElementById("case-nav");
    if (!nav) return;

    var sections = Array.prototype.slice.call(
      document.querySelectorAll(".case-section[id]")
    );
    if (!sections.length) return;

    // Build the list
    var title = document.createElement("p");
    title.className = "case-nav-title";
    title.textContent = "On this page";

    var list = document.createElement("ul");
    list.className = "case-nav-list";

    var links = sections.map(function (section) {
      var heading = section.querySelector("h2");
      var item = document.createElement("li");
      var link = document.createElement("a");

      link.href = "#" + section.id;
      link.textContent = section.dataset.navLabel || (heading ? heading.textContent.trim() : section.id);

      item.appendChild(link);
      list.appendChild(item);
      return link;
    });

    nav.appendChild(title);
    nav.appendChild(list);

    // Highlight the section currently in view
    function setActive(link) {
      links.forEach(function (other) {
        var active = other === link;
        other.classList.toggle("is-active", active);
        if (active) {
          other.setAttribute("aria-current", "true");
        } else {
          other.removeAttribute("aria-current");
        }
      });
    }

    // The section you are reading is the last one whose top has passed an
    // imaginary line a quarter of the way down the viewport.
    function updateActive() {
      var line = window.innerHeight * 0.25;
      var current = 0;

      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= line) {
          current = i;
        }
      }

      // A short final section can run out of page before its top ever reaches
      // the line, so claim the last stretch of scroll for it.
      var remaining =
        document.documentElement.scrollHeight -
        (window.innerHeight + window.scrollY);
      if (remaining < 120) current = sections.length - 1;

      setActive(links[current]);
    }

    updateActive();

    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    // Reflect the click straight away, before the smooth scroll settles
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        setActive(link);
      });
    });
  }

  /* --- Start ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initLoader();
    initScrollFrog();
    initRoleTypewriter();
    initCopyEmail();
    initParallax();
    initAboutSlideshow();
    initCaseNav();
  });
})();
