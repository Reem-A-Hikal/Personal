document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const scrollTopBtn = document.querySelector(".scroll-top");
  document.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 100;
    body.classList.toggle("scrolled", scrolled);
    if (scrollTopBtn) scrollTopBtn.classList.toggle("active", scrolled);
  });
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const navBtn = document.querySelector(".mobile-nav-toggle");
  if (navBtn) {
    navBtn.addEventListener("click", () => {
      body.classList.toggle("mobile-nav-active");
      navBtn.classList.toggle("bi-list");
      navBtn.classList.toggle("bi-x");
    });
    document.querySelectorAll("#navmenu a").forEach((link) =>
      link.addEventListener("click", () => {
        if (body.classList.contains("mobile-nav-active")) navBtn.click();
      }),
    );
  }

  // Preloader
  window.addEventListener("load", () =>
    document.querySelector("#preloader")?.remove(),
  );

  const targets = document.querySelectorAll("[data-aos], .progress-bar");
  if (targets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;

          if (el.dataset.aos) {
            el.classList.add("aos-animate");
          } else if (el.classList.contains("progress-bar")) {
            const value = Number.parseInt(
              el.getAttribute("aria-valuenow") ||
                el.getAttribute("value") ||
                "0",
              10,
            );
            el.style.width = `${value}%`;
            el.setAttribute("aria-valuenow", String(value));
            el.setAttribute("value", String(value));
          }

          observer.unobserve(el);
        });
      },
      { threshold: 0.2 },
    );
    targets.forEach((el) => observer.observe(el));
  }

  const typedEl = document.querySelector(".typed");
  if (typedEl) {
    const words = typedEl.dataset.typedItems.split(",").map((w) => w.trim());
    if (words.length) {
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const typeText = () => {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
          typedEl.textContent = currentWord.slice(0, charIndex + 1);
          charIndex += 1;

          if (charIndex === currentWord.length) {
            isDeleting = true;
            window.setTimeout(typeText, 1200);
            return;
          }
        } else {
          typedEl.textContent = currentWord.slice(0, charIndex - 1);
          charIndex -= 1;

          if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
          }
        }

        window.setTimeout(typeText, isDeleting ? 60 : 120);
      };

      typedEl.textContent = "";
      typedEl.style.opacity = 1;
      typeText();
    }
  }

  const glightboxLinks = document.querySelectorAll(".glightbox");
  if (glightboxLinks.length) {
    const items = Array.from(glightboxLinks).map((a) => ({
      href: a.getAttribute("href"),
      title: a.getAttribute("title") || "",
    }));
    const overlay = document.createElement("div");
    overlay.className = "lb-overlay";
    overlay.innerHTML = `
      <button class="lb-close" aria-label="Close">&times;</button>
      <button class="lb-prev" aria-label="Previous">&#10094;</button>
      <img class="lb-img" src="" alt="" />
      <button class="lb-next" aria-label="Next">&#10095;</button>
      <div class="lb-caption"></div>`;
    document.body.appendChild(overlay);
    const img = overlay.querySelector(".lb-img");
    const caption = overlay.querySelector(".lb-caption");
    let current = 0;

    const show = (i) => {
      current = (i + items.length) % items.length;
      img.src = items[current].href;
      caption.textContent = items[current].title;
    };
    const open = (i) => {
      show(i);
      overlay.classList.add("active");
      body.style.overflow = "hidden";
    };
    const close = () => {
      overlay.classList.remove("active");
      body.style.overflow = "";
    };

    glightboxLinks.forEach((a, i) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        open(i);
      });
    });
    overlay.querySelector(".lb-close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    overlay
      .querySelector(".lb-prev")
      .addEventListener("click", () => show(current - 1));
    overlay
      .querySelector(".lb-next")
      .addEventListener("click", () => show(current + 1));
    document.addEventListener("keydown", (e) => {
      if (!overlay.classList.contains("active")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  document.querySelectorAll(".isotope-filters li").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".isotope-layout");
      const filter = btn.dataset.filter;
      wrap
        .querySelectorAll(".isotope-filters li")
        .forEach((b) => b.classList.remove("filter-active"));
      btn.classList.add("filter-active");
      wrap.querySelectorAll(".isotope-item").forEach((item) => {
        item.style.display =
          filter === "*" || item.matches(filter) ? "" : "none";
      });
    });
  });

  document.querySelectorAll(".portfolio-image-wrap").forEach((wrap) => {
    const img = wrap.querySelector("img");
    if (!img) return;

    wrap.classList.add("is-loading");

    const revealImage = () => {
      window.setTimeout(() => {
        img.classList.add("loaded");
        wrap.classList.remove("is-loading");
        wrap.classList.add("is-loaded");
      }, 250);
    };

    if (img.complete && img.naturalWidth > 0) {
      revealImage();
      return;
    }

    img.addEventListener("load", revealImage);
    img.addEventListener("error", revealImage);
  });
});

const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

const applyTheme = (theme) => {
  html.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-pressed",
      theme === "dark" ? "true" : "false",
    );
    themeToggle.setAttribute(
      "title",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
  }
};

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  const initialTheme = html.dataset.theme || "light";
  applyTheme(initialTheme);
}
