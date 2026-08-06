(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.querySelector("[data-header]");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 18);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll(".nav-group").forEach((group) => {
    const btn = group.querySelector(".nav-group__btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      group.classList.toggle("is-open");
    });
  });

  const root = document.querySelector("[data-slider]");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const dots = Array.from(root.querySelectorAll("[data-slider-dots] button"));
  const prev = root.querySelector("[data-slider-prev]");
  const next = root.querySelector("[data-slider-next]");
  const progress = root.querySelector("[data-slider-progress]");
  let index = slides.findIndex((s) => s.classList.contains("is-active"));
  if (index < 0) index = 0;
  let timer = null;
  const DURATION = 5500;

  const setActive = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (progress) {
      progress.style.transition = "none";
      progress.style.width = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progress.style.transition = `width ${DURATION}ms linear`;
          progress.style.width = "100%";
        });
      });
    }
  };

  const play = () => {
    stop();
    timer = window.setInterval(() => setActive(index + 1), DURATION);
    setActive(index);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  prev?.addEventListener("click", () => {
    setActive(index - 1);
    play();
  });
  next?.addEventListener("click", () => {
    setActive(index + 1);
    play();
  });
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      setActive(i);
      play();
    });
  });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", play);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", play);

  play();
})();
