(() => {
  "use strict";

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileClose = document.getElementById("mobileClose");
  const mobileLinks = mobileMenu.querySelectorAll(".mobile-menu__link");

  const setMenuState = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("no-scroll", open);
  };

  navToggle.addEventListener("click", () => {
    setMenuState(navToggle.getAttribute("aria-expanded") !== "true");
  });

  mobileClose.addEventListener("click", () => setMenuState(false));

  mobileLinks.forEach((link) => link.addEventListener("click", () => setMenuState(false)));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuState(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 720) setMenuState(false);
  });

  const onScrollNav = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  const navLinks = document.querySelectorAll(".nav__menu .nav__link");
  const sections = ["inicio", "servicios", "nosotros", "galeria", "ubicacion"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((section) => spyObserver.observe(section));
  }

  const galleryItems = Array.from(document.querySelectorAll(".gallery__item"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  let lightboxIndex = 0;
  let lastFocused = null;

  const renderLightbox = () => {
    const item = galleryItems[lightboxIndex];
    const img = item.querySelector("img");
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = img.alt;
    lightboxCaption.innerHTML =
      `<span>${item.dataset.title}</span><small>${item.dataset.cat}</small>`;
  };

  const openLightbox = (index) => {
    lastFocused = document.activeElement;
    lightboxIndex = index;
    renderLightbox();
    lightbox.classList.add("is-open");
    document.body.classList.add("no-scroll");
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    if (lastFocused) lastFocused.focus();
  };

  const stepLightbox = (dir) => {
    lightboxIndex = (lightboxIndex + dir + galleryItems.length) % galleryItems.length;
    renderLightbox();
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  lightboxNext.addEventListener("click", () => stepLightbox(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
})();