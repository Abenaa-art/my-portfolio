/* ======================================================================
   main.js  —  how the website BEHAVES
   ----------------------------------------------------------------------
   You don't need to edit this file to change your content (use config.js).
   Each numbered block below does one job. Search for the number to find it:
     1. Small helpers
     2. Image helpers
     3. Fill the page from config.js
     4. Project grid + filters + featured image
     5. Lightbox (the pop-up that shows a project in full size)
     6. Theme switch (light / dark)
     7. Navigation (menu, hide-on-scroll, active link)
     8. Scroll effects       (ruler, featured zoom, process line)
     9. Reveal-on-scroll + number counters
    10. Custom cursor + mouse coordinates
    11. Contact (copy email + form)
   ====================================================================== */

(function () {
  "use strict";

  /* ---------- 1. SMALL HELPERS ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const pad = (n) => String(n).padStart(2, "0");
  const pad4 = (n) => String(Math.max(0, Math.round(n))).padStart(4, "0");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Safety check: SITE comes from config.js. If it is missing, tell the beginner why.
  if (typeof SITE === "undefined") {
    console.error("config.js did not load. Check that js/config.js exists and is linked in index.html BEFORE main.js.");
    return;
  }

  // Makes text safe to put inside HTML (prevents weird characters breaking the page).
  function esc(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
  }

  // Small pop-up message at the bottom of the screen.
  const toastEl = $("#toast");
  let toastTimer;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 3600);
  }


  /* ---------- 2. IMAGE HELPERS ---------- */

  // Makes a file path safe for the browser (spaces etc.). Empty in → empty out.
  const safeSrc = (path) => (path ? encodeURI(String(path).trim()) : "");

  // Only accepts ratios like "4 / 5" or "16/9". Anything else uses the fallback.
  function safeRatio(value, fallback) {
    return /^\s*\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?\s*$/.test(value || "") ? value : fallback;
  }

  // Shows the "placeholder" look on a picture button (used when a file is missing).
  function markPlaceholder(btn) {
    btn.classList.add("is-placeholder");
    btn.setAttribute("aria-label", "Placeholder. Add your image in assets/projects/ and its path in config.js");
  }

  // Loads the card picture. If the file doesn't exist, the placeholder look appears.
  function loadThumb(btn, src) {
    const img = $(".thumb", btn);
    if (!src) { markPlaceholder(btn); return; }
    img.addEventListener("error", () => markPlaceholder(btn));
    img.src = src;
  }


  /* ---------- 3. FILL THE PAGE FROM config.js ---------- */
  function applyConfig() {
    document.title = `${SITE.name} — ${SITE.role}`;

    // <span data-config="name"> → text from SITE.name
    $$("[data-config]").forEach((el) => {
      const value = SITE[el.dataset.config];
      if (value) el.textContent = value;
    });

    // email links
    $$("[data-email]").forEach((a) => {
      a.href = "mailto:" + SITE.email;
      if (a.hasAttribute("data-email-text")) a.textContent = SITE.email;
    });

    // social links (hidden when left empty)
    $$("[data-social]").forEach((a) => {
      const url = SITE.socials && SITE.socials[a.dataset.social];
      if (url) {
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      } else {
        (a.closest("li") || a).hidden = true;
      }
    });

    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

    // Scrolling strip of tools (the list is repeated twice so the loop looks endless)
    const track = $("#marqueeTrack");
    const tools = SITE.tools || [];
    if (track && tools.length) {
      const items = tools.map((t) => `<span class="marquee__item">${esc(t)}</span>`).join("");
      track.innerHTML = items + items;
    }

    // "Tools I work with" chips
    const chips = $("#toolChips");
    if (chips) chips.innerHTML = tools.map((t) => `<li>${esc(t)}</li>`).join("");

    // Stats (numbers count up when they scroll into view — see section 9)
    const stats = $("#stats");
    if (stats) {
      stats.innerHTML = (SITE.stats || [])
        .map(
          (s) => `<div class="stat">
            <span class="stat__value"><span data-count="${Number(s.value) || 0}">0</span>${esc(s.suffix || "")}</span>
            <span class="stat__label">${esc(s.label)}</span>
          </div>`
        )
        .join("");
    }

    // Colour palette: click a swatch to copy its colour code
    const swatches = $("#swatches");
    const palette = (SITE.palette || []).filter((c) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c.hex || ""));
    if (swatches && palette.length) {
      swatches.innerHTML = "";
      palette.forEach((c) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "swatch";
        btn.setAttribute("aria-label", `Copy colour ${c.name || ""} ${c.hex}`);
        btn.innerHTML = `<span class="swatch__chip"></span>
          <span class="swatch__name">${esc(c.name || "")}</span>
          <span class="swatch__hex">${esc(c.hex.toUpperCase())}</span>`;
        $(".swatch__chip", btn).style.background = c.hex;
        btn.addEventListener("click", async () => {
          try { await navigator.clipboard.writeText(c.hex.toUpperCase()); toast(`Copied ${c.hex.toUpperCase()}`); }
          catch (e) { toast(`Colour code: ${c.hex.toUpperCase()}`); }
        });
        swatches.appendChild(btn);
      });
    } else if ($("#paletteWrap")) {
      $("#paletteWrap").hidden = true; // no palette in config.js → hide the whole block
    }
  }


  /* ---------- 4. PROJECT GRID + FILTERS + FEATURED IMAGE ---------- */
  const grid = $("#projectGrid");

  // Everything a card needs to open the lightbox.
  function projectData(p) {
    const images = (Array.isArray(p.images) ? p.images : []).filter(Boolean).map(safeSrc);
    const cover = safeSrc(p.cover) || images[0] || "";
    return {
      title: p.title || "Project",
      description: p.description || "",
      meta: [p.client, p.year, p.tools].filter(Boolean).join("  ·  "),
      cover,
      images: images.length ? images : cover ? [cover] : [],
    };
  }

  function createCard(project, index) {
    const data = projectData(project);

    const card = document.createElement("article");
    card.className = "card reveal" + (project.wide ? " card--wide" : "");
    card.dataset.category = project.category || "";
    card.style.setProperty("--delay", (index % 3) * 90 + "ms"); // stagger within a row

    const media = document.createElement("button");
    media.type = "button";
    media.className = "media frame";
    media.dataset.cursor = "view";
    media.style.setProperty("--ratio", safeRatio(project.ratio, project.wide ? "16 / 9" : "4 / 3"));
    media.setAttribute("aria-label", `View project: ${data.title}`);
    media.innerHTML = `
      <img class="thumb" alt="" loading="lazy" decoding="async" />
      <span class="media__ph"><strong>Image placeholder</strong><span>Add your file in <code>assets/projects/</code></span></span>
      <span class="media__tag">${esc(project.category || "Project")}</span>
      ${project.year ? `<span class="media__len">${esc(project.year)}</span>` : ""}
      <span class="media__play"><svg><use href="#i-plus" /></svg></span>`;

    loadThumb(media, data.cover);
    media.addEventListener("click", () => {
      if (media.classList.contains("is-placeholder")) {
        toast("Placeholder — put your image in assets/projects/ and its path in js/config.js");
        return;
      }
      openLightbox(data, media);
    });

    const body = document.createElement("div");
    body.className = "card__body";
    body.innerHTML = `
      <span class="card__cat">${esc(project.category || "")}</span>
      <h3 class="card__title">${esc(project.title)}</h3>
      <p class="card__text">${esc(project.description || "")}</p>`;

    card.append(media, body);
    return card;
  }

  function renderProjects() {
    const projects = SITE.projects || [];
    grid.innerHTML = "";
    projects.forEach((p, i) => grid.appendChild(createCard(p, i)));

    // Filter buttons: "All" + every category found in your project list
    const filters = $("#filters");
    const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))];
    filters.innerHTML = "";
    if (categories.length <= 2) return; // no need for filters with a single category

    categories.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter";
      btn.textContent = cat;
      btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      btn.addEventListener("click", () => {
        $$(".filter", filters).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        applyFilter(cat);
      });
      filters.appendChild(btn);
    });
  }

  function applyFilter(category) {
    grid.classList.add("is-filtering"); // fade out…
    setTimeout(() => {
      $$(".card", grid).forEach((card) => {
        card.hidden = !(category === "All" || card.dataset.category === category);
      });
      grid.classList.remove("is-filtering"); // …and fade back in
    }, reduceMotion ? 0 : 220);
  }

  function setupFeatured() {
    const btn = $("#featured");
    const src = safeSrc(SITE.featured);
    loadThumb(btn, src);
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-placeholder")) {
        toast("Placeholder — put your image in assets/projects/ and its path in js/config.js");
        return;
      }
      openLightbox({ title: SITE.featuredTitle || "Featured work", description: "", meta: "", images: [src] }, btn);
    });
  }


  /* ---------- 5. LIGHTBOX ---------- */
  const modal = $("#modal");
  const lbImg = $("#lbImg");
  const lbError = $("#lbError");
  const lbPrev = $("#lbPrev");
  const lbNext = $("#lbNext");
  let lb = { images: [], index: 0, title: "" };
  let lastFocused = null;
  let closeTimer;
  let loadToken = 0;

  const isLightboxOpen = () => modal.classList.contains("is-open");

  function showImage(index) {
    const count = lb.images.length;
    if (!count) return;
    lb.index = (index + count) % count; // wraps around: after the last comes the first
    const src = lb.images[lb.index];
    const token = ++loadToken;

    $("#lbCount").textContent = `${lb.index + 1} / ${count}`;
    lbImg.classList.add("is-loading");
    lbError.hidden = true;

    // Load in the background first, then swap — so the picture fades in smoothly.
    const probe = new Image();
    probe.onload = () => {
      if (token !== loadToken) return; // user already moved on
      lbImg.src = src;
      lbImg.alt = `${lb.title} — picture ${lb.index + 1} of ${count}`;
      lbImg.classList.remove("is-loading");
    };
    probe.onerror = () => {
      if (token !== loadToken) return;
      lbImg.removeAttribute("src");
      lbError.textContent = "Image not found: " + decodeURI(src) + " — check the file name in config.js";
      lbError.hidden = false;
    };
    probe.src = src;

    // Quietly load the neighbours so flipping through is instant.
    if (count > 1) {
      [lb.index + 1, lb.index - 1].forEach((i) => { new Image().src = lb.images[(i + count) % count]; });
    }
  }

  function openLightbox(data, trigger) {
    lastFocused = trigger || document.activeElement;
    clearTimeout(closeTimer);
    lb = { images: data.images, index: 0, title: data.title };

    $("#modalTitle").textContent = data.title;
    $("#lbDesc").textContent = data.description;
    $("#lbMeta").textContent = data.meta;
    $("#lbDesc").hidden = !data.description;
    $("#lbMeta").hidden = !data.meta;

    const many = data.images.length > 1;
    lbPrev.hidden = !many;
    lbNext.hidden = !many;
    $("#lbCount").hidden = !many;

    showImage(0);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    $("#modalClose").focus();
  }

  function closeLightbox() {
    if (!isLightboxOpen()) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    loadToken++;
    closeTimer = setTimeout(() => { lbImg.removeAttribute("src"); lbImg.classList.add("is-loading"); }, 400);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function setupLightbox() {
    $("#modalClose").addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", () => showImage(lb.index - 1));
    lbNext.addEventListener("click", () => showImage(lb.index + 1));
    modal.addEventListener("click", (e) => { if (e.target === modal) closeLightbox(); }); // click outside

    document.addEventListener("keydown", (e) => {
      if (!isLightboxOpen()) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showImage(lb.index + 1);
      if (e.key === "ArrowLeft") showImage(lb.index - 1);
    });

    // Swipe left/right on a phone or tablet
    const stage = $("#lbStage");
    let startX = 0;
    stage.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50 && lb.images.length > 1) showImage(lb.index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }


  /* ---------- 6. THEME SWITCH (light / dark) ---------- */
  function setupTheme() {
    const root = document.documentElement;
    const meta = $('meta[name="theme-color"]');
    const btn = $("#themeToggle");

    const sync = () => meta && meta.setAttribute("content", root.getAttribute("data-theme") === "light" ? "#f6f4ee" : "#0b0b0c");
    sync();

    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: ignore */ }
      sync();
    });
  }


  /* ---------- 7. NAVIGATION ---------- */
  const nav = $("#nav");
  const menu = $("#menu");
  const burger = $("#burger");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("no-scroll", open);
    if (open) nav.classList.remove("is-hidden");
  }

  function setupNav() {
    burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", () => { if (window.innerWidth >= 900) setMenu(false); });

    // Which section are we in? Highlights the menu link + updates the "Artboard" label.
    const sections = $$("main section[data-scene]");
    const sceneEl = $("#hudScene");
    const links = $$(".nav__links a");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = sections.indexOf(entry.target);
          sceneEl.textContent = `Artboard ${pad(index + 1)} · ${entry.target.dataset.scene}`;
          links.forEach((a) => {
            if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" } // "the section crossing the middle of the screen"
    );
    sections.forEach((s) => io.observe(s));
  }


  /* ---------- 8. SCROLL EFFECTS ----------
     One function runs on scroll (at most once per screen refresh) and updates:
       • the ruler at the top (green line + marker)
       • the Y coordinate in the bottom-left corner
       • the featured image's gentle zoom
       • the "filling" line in the Process section
       • the menu bar (blur background / hide when scrolling down) */
  const fill = $("#timelineFill");
  const head = $("#timelineHead");
  const featured = $("#featured");
  const processList = $("#processList");
  let lastY = 0;
  let ticking = false;

  function updateOnScroll() {
    ticking = false;
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? clamp(y / maxScroll, 0, 1) : 0;

    // Ruler line + marker
    fill.style.transform = `scaleX(${progress})`;
    head.style.left = progress * 100 + "%";

    renderCoords();

    // Featured image zoom: 0.94 → 1 as it comes into view
    if (featured && !reduceMotion) {
      const top = featured.getBoundingClientRect().top;
      const t = clamp((window.innerHeight - top) / (window.innerHeight * 0.7), 0, 1);
      featured.style.setProperty("--s", (0.94 + 0.06 * t).toFixed(4));
    }

    // Process line fill
    if (processList) {
      const r = processList.getBoundingClientRect();
      const p = clamp((window.innerHeight * 0.75 - r.top) / (r.height + window.innerHeight * 0.1), 0, 1);
      processList.style.setProperty("--pp", p.toFixed(4));
    }

    // Nav bar look + hide on scroll down / show on scroll up
    nav.classList.toggle("is-scrolled", y > 24);
    if (!menu.classList.contains("is-open")) {
      if (y > lastY + 6 && y > 240) nav.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 240) nav.classList.remove("is-hidden");
    }
    lastY = y;
  }

  function setupScroll() {
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateOnScroll); } };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    updateOnScroll();
  }


  /* ---------- 9. REVEAL-ON-SCROLL + COUNTERS ---------- */
  function setupReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target); // animate only once
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  function setupCounters() {
    const counters = $$("[data-count]");
    const run = (el) => {
      const target = Number(el.dataset.count) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const t = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3); // starts fast, ends slow
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { counters.forEach((c) => (c.textContent = c.dataset.count)); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
  }


  /* ---------- 10. CUSTOM CURSOR + MOUSE COORDINATES (desktop mouse only) ---------- */
  const hudXY = $("#hudXY");
  let mouse = { x: 0, y: 0, active: false };

  // Bottom-left readout: "X 0412 Y 1530" (Y includes the scroll distance, like a canvas position).
  // On touch screens there is no mouse, so it simply shows the scroll distance.
  function renderCoords() {
    hudXY.textContent = mouse.active
      ? `X ${pad4(mouse.x)} Y ${pad4(mouse.y + window.scrollY)}`
      : `Y ${pad4(window.scrollY)}`;
  }

  function setupCursor() {
    const cursor = $("#cursor");
    if (!finePointer || !cursor) return;

    let x = 0, y = 0, cx = 0, cy = 0;

    window.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      mouse = { x, y, active: true };
      renderCoords();
      if (!cursor.classList.contains("is-on")) {
        cx = x; cy = y;
        cursor.classList.add("is-on");
        document.documentElement.classList.add("has-cursor");
      }
    });
    document.addEventListener("mouseleave", () => cursor.classList.remove("is-on"));

    // Follow the mouse with a little smoothing ("lerp")
    (function loop() {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    })();

    // Change shape depending on what is under the mouse
    document.addEventListener("mouseover", (e) => {
      const view = e.target.closest('[data-cursor="view"]');
      const link = e.target.closest("a, button, .filter, select, input, textarea");
      cursor.classList.toggle("is-view", !!view && !view.classList.contains("is-placeholder"));
      cursor.classList.toggle("is-link", !!link && !(view && !view.classList.contains("is-placeholder")));
    });
  }


  /* ---------- 11. CONTACT: COPY EMAIL + FORM ---------- */
  function setupContact() {
    // Copy email button
    const copyBtn = $("#copyEmail");
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(SITE.email);
        copyBtn.textContent = "Copied ✓";
      } catch (e) {
        copyBtn.textContent = "Press Ctrl+C";
      }
      setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
    });

    // The form has no server (this is a front-end-only site), so on submit we open the
    // visitor's email app with everything already written out, addressed to you.
    const form = $("#contactForm");
    const status = $("#formStatus");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const required = ["name", "email", "message"];
      let valid = true;
      required.forEach((field) => {
        const input = form.elements[field];
        const ok = String(data.get(field) || "").trim() && (field !== "email" || input.checkValidity());
        input.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) { status.textContent = "Please fill in your name, a valid email and a message."; return; }

      const subject = `Project enquiry from ${data.get("name")}`;
      const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nProject type: ${data.get("type")}\n\n${data.get("message")}`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Opening your email app… if nothing happens, email me directly at " + SITE.email;
    });
  }


  /* ---------- START EVERYTHING ----------
     Order matters: first fill in the content, THEN set up the effects that need it. */
  applyConfig();
  renderProjects();
  setupFeatured();
  setupLightbox();
  setupTheme();
  setupNav();
  setupScroll();
  setupReveal();
  setupCounters();
  setupCursor();
  setupContact();
})();
