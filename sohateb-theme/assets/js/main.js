(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
  if (nodes.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const delay = Number(el.getAttribute("data-reveal-delay") || 0);
            window.setTimeout(() => el.classList.add("is-in"), delay);
            io.unobserve(el);
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
      );
      nodes.forEach((el) => io.observe(el));
    }
  }

  // Drag-to-scroll for mobile product rails
  document.querySelectorAll("[data-product-rail] .products, .st-shop ul.products").forEach((scroller) => {
    let active = false;
    let startX = 0;
    let scrollStart = 0;
    let moved = false;

    const isTouchPrimary = window.matchMedia("(hover: none), (max-width: 760px)").matches;
    if (!isTouchPrimary) return;

    scroller.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      active = true;
      moved = false;
      startX = event.clientX;
      scrollStart = scroller.scrollLeft;
      scroller.classList.add("is-dragging");
      scroller.setPointerCapture?.(event.pointerId);
    });

    scroller.addEventListener("pointermove", (event) => {
      if (!active) return;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      scroller.scrollLeft = scrollStart - dx;
    });

    const endDrag = (event) => {
      if (!active) return;
      active = false;
      scroller.classList.remove("is-dragging");
      try {
        scroller.releasePointerCapture?.(event.pointerId);
      } catch (_) {
        /* ignore */
      }
    };

    scroller.addEventListener("pointerup", endDrag);
    scroller.addEventListener("pointercancel", endDrag);

    scroller.addEventListener(
      "click",
      (event) => {
        if (!moved) return;
        event.preventDefault();
        event.stopPropagation();
      },
      true
    );
  });
})();
