const fallbackMenuGroups = [
  {
    id: "paninis",
    label: "Paninis",
    badge: "Free chips with panini purchase",
    items: [
      {
        name: "Philly w/ Attitude",
        description: "Steak, onions, peppers, cherry peppers, mushrooms, cheese",
        price: "$17",
      },
      {
        name: "Chicken Bacon Ranch",
        description: "Chicken, bacon, ranch, cheese",
        price: "$16",
      },
      {
        name: "Buff n' Tuff",
        description: "Chicken, buffalo sauce, bacon, cheese",
        price: "$16",
      },
      {
        name: "Big Mac",
        description: "Beef, cheese, Big Mac sauce, lettuce, onions",
        price: "$17",
      },
    ],
  },
  {
    id: "breakfast",
    label: "Breakfast",
    badge: "Served until 11 AM",
    items: [
      {
        name: "Phat Betch",
        description: "French toast, egg, cheese, sausage or bacon, syrup, powdered sugar, hashbrown",
        price: "$14",
      },
      {
        name: "Get It Girl",
        description: "Egg, cheese, avocado",
        price: "$10",
      },
      {
        name: "Basic Betch",
        description: "Egg, cheese, sausage or bacon",
        price: "$8",
      },
      {
        name: "Philly w/ Morning Attitude",
        description: "Steak, egg, cheese, mushroom, roasted peppers, hot peppers, onion, hashbrown",
        price: "$15",
      },
      {
        name: "Hashbrowns",
        description: "Crispy breakfast side",
        price: "$1.50",
      },
    ],
  },
  {
    id: "appetizers",
    label: "Appetizers",
    badge: "Finger foods and sides",
    items: [
      { name: "Fries", description: "Hot, crispy fries", price: "$9" },
      { name: "Loaded Fries", description: "Fries loaded Logi Bears style", price: "$12" },
      { name: "Mozzarella Sticks (6)", description: "Six golden mozzarella sticks", price: "$9" },
      { name: "Cheese Quesadilla", description: "Melty cheese quesadilla", price: "$8" },
      {
        name: "Chicken & Cheese Quesadilla",
        description: "Chicken and cheese folded hot",
        price: "$9",
      },
      { name: "Rice Balls (3)", description: "Three crispy rice balls", price: "$5" },
      { name: "Chicken Tenders & Fries", description: "Chicken tenders with fries", price: "$15" },
      { name: "Hot Dog & Fries", description: "Classic hot dog with fries", price: "$5" },
    ],
  },
  {
    id: "beverages",
    label: "Beverages",
    badge: "Cold drinks",
    items: [
      { name: "Water", description: "Bottled water", price: "$1" },
      { name: "Lemonade", description: "Cold lemonade", price: "$2.25" },
      { name: "Soda", description: "Assorted soda", price: "$2.25" },
    ],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  loadMenu();
  loadFoodSlideshow();
  loadSchedule();
  setupFormToggles();
  setupWeb3Forms();
  setupNavToggle();
  closeMobileNavOnClick();
});

async function loadMenu() {
  const categoryNav = document.getElementById("menuCategoryNav");
  const content = document.getElementById("menuContent");

  if (!categoryNav || !content) {
    return;
  }

  content.innerHTML = '<div class="loading-panel">Loading menu...</div>';

  try {
    const response = await fetch("menu.csv", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Menu request failed with ${response.status}`);
    }

    const rows = parseCsv(await response.text());
    const menuGroups = normalizeMenuGroups(rows);

    renderMenu(menuGroups.length ? menuGroups : fallbackMenuGroups);
  } catch (error) {
    renderMenu(fallbackMenuGroups);
  }
}

function normalizeMenuGroups(rows) {
  const groupMap = new Map();

  rows.forEach((row, rowIndex) => {
    const itemName = row.item_name || row.name;
    const categoryLabel = row.category_label || row.category || row.section;

    if (!itemName || !categoryLabel) {
      return;
    }

    const categoryId = row.category_id || slugify(categoryLabel);
    const categoryOrder = parseOrder(row.category_order, rowIndex);
    const itemOrder = parseOrder(row.item_order || row.order, rowIndex);

    if (!groupMap.has(categoryId)) {
      groupMap.set(categoryId, {
        id: categoryId,
        label: categoryLabel,
        badge: row.category_badge || row.badge || "",
        order: categoryOrder,
        items: [],
      });
    }

    const group = groupMap.get(categoryId);

    group.order = Math.min(group.order, categoryOrder);
    group.badge = group.badge || row.category_badge || row.badge || "";
    group.items.push({
      name: itemName,
      description: row.description || "",
      price: row.price || "",
      order: itemOrder,
    });
  });

  return [...groupMap.values()]
    .sort((a, b) => a.order - b.order)
    .map((group) => ({
      id: group.id,
      label: group.label,
      badge: group.badge,
      items: group.items
        .sort((a, b) => a.order - b.order)
        .map(({ name, description, price }) => ({ name, description, price })),
    }));
}

function parseOrder(value, fallback) {
  const order = Number(value);
  return Number.isFinite(order) ? order : fallback;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderMenu(menuGroups) {
  const categoryNav = document.getElementById("menuCategoryNav");
  const content = document.getElementById("menuContent");

  if (!categoryNav || !content) {
    return;
  }

  if (!menuGroups.length) {
    categoryNav.innerHTML = "";
    content.innerHTML = '<div class="empty-panel">Menu items are being updated. Check back soon.</div>';
    return;
  }

  categoryNav.innerHTML = menuGroups
    .map(
      (group) => `
        <a class="menu-chip" href="#menu-${group.id}">
          ${escapeHtml(group.label)}
        </a>
      `,
    )
    .join("");

  content.innerHTML = menuGroups
    .map((group) => {
      const items = group.items
        .map(
          (item) => `
            <article class="menu-item">
              <div>
                <h3>${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.description)}</p>
              </div>
            ${item.price ? `<span class="price">${escapeHtml(item.price)}</span>` : ""}
            </article>
          `,
        )
        .join("");

      return `
        <section class="menu-category" id="menu-${group.id}">
          <div class="menu-category-heading">
            <div>
              <p class="eyebrow">${escapeHtml(group.label)}</p>
              <h3>${escapeHtml(group.label)}</h3>
            </div>
            ${group.badge ? `<span class="menu-badge">${escapeHtml(group.badge)}</span>` : ""}
          </div>
          <div class="menu-grid">${items}</div>
        </section>
      `;
    })
    .join("");
}

async function loadFoodSlideshow() {
  const slideshow = document.getElementById("foodSlideshow");

  if (!slideshow) {
    return;
  }

  try {
    const response = await fetch("food-photos.csv", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Food photo request failed with ${response.status}`);
    }

    const listedPhotos = parseCsv(await response.text())
      .map(normalizeFoodPhoto)
      .filter(Boolean);
    const photos = await filterLoadablePhotos(listedPhotos);

    renderFoodSlideshow(photos, slideshow, listedPhotos);
  } catch (error) {
    renderFoodSlideshow([], slideshow, []);
  }
}

function filterLoadablePhotos(photos) {
  return Promise.all(
    photos.map(
      (photo) =>
        new Promise((resolve) => {
          const image = new Image();

          image.onload = () => resolve(photo);
          image.onerror = () => resolve(null);
          image.src = photo.image;
        }),
    ),
  ).then((results) => results.filter(Boolean));
}

function normalizeFoodPhoto(row) {
  const image = row.image || row.src || row.file;

  if (!image) {
    return null;
  }

  const imagePath = /^(https?:)?\/\//.test(image) || image.includes("/") ? image : `assets/food/${image}`;

  return {
    image: imagePath,
    alt: row.alt || row.caption || "Logi Bears food photo",
    caption: row.caption || "",
  };
}

function renderFoodSlideshow(photos, slideshow, listedPhotos = []) {
  if (!photos.length) {
    const missingList = listedPhotos
      .map((photo) => photo.image)
      .map((image) => `<li>${escapeHtml(image)}</li>`)
      .join("");
    const isLocal = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);

    slideshow.innerHTML =
      isLocal && missingList
        ? `
          <div class="slideshow-empty slideshow-missing">
            <span>Food photos are listed, but these files are missing:</span>
            <ul>${missingList}</ul>
          </div>
        `
        : '<div class="slideshow-empty">Food photos coming soon.</div>';
    return;
  }

  const slides = photos
    .map(
      (photo, index) => `
        <figure class="food-slide${index === 0 ? " active" : ""}" aria-hidden="${index === 0 ? "false" : "true"}">
          <img
            src="${escapeHtml(photo.image)}"
            alt="${escapeHtml(photo.alt)}"
            loading="${index === 0 ? "eager" : "lazy"}"
          >
          ${photo.caption ? `<figcaption>${escapeHtml(photo.caption)}</figcaption>` : ""}
        </figure>
      `,
    )
    .join("");

  const dots = photos
    .map(
      (_photo, index) => `
        <button
          class="slide-dot${index === 0 ? " active" : ""}"
          type="button"
          aria-label="Show food photo ${index + 1}"
          aria-pressed="${index === 0 ? "true" : "false"}"
          data-slide-index="${index}"
        ></button>
      `,
    )
    .join("");

  slideshow.innerHTML = `
    <div class="slideshow-frame">
      <div class="slides">${slides}</div>
      <button class="slide-control slide-prev" type="button" aria-label="Previous food photo">
        <span aria-hidden="true">&lsaquo;</span>
      </button>
      <button class="slide-control slide-next" type="button" aria-label="Next food photo">
        <span aria-hidden="true">&rsaquo;</span>
      </button>
    </div>
    <div class="slide-dots" aria-label="Food photo controls">${dots}</div>
  `;

  setupFoodSlideshow(slideshow);
}

function setupFoodSlideshow(slideshow) {
  const slides = [...slideshow.querySelectorAll(".food-slide")];
  const dots = [...slideshow.querySelectorAll(".slide-dot")];
  const previous = slideshow.querySelector(".slide-prev");
  const next = slideshow.querySelector(".slide-next");
  let activeIndex = 0;
  let timerId = null;

  if (slides.length <= 1) {
    previous?.setAttribute("hidden", "");
    next?.setAttribute("hidden", "");
    slideshow.querySelector(".slide-dots")?.setAttribute("hidden", "");
    return;
  }

  const showSlide = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  };

  const stopAutoplay = () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    timerId = window.setInterval(() => showSlide(activeIndex + 1), 6500);
  };

  previous?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    startAutoplay();
  });
  next?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    startAutoplay();
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slideIndex));
      startAutoplay();
    });
  });

  slideshow.addEventListener("mouseenter", stopAutoplay);
  slideshow.addEventListener("mouseleave", startAutoplay);
  slideshow.addEventListener("focusin", stopAutoplay);
  slideshow.addEventListener("focusout", startAutoplay);
  startAutoplay();
}

function setupFormToggles() {
  const toggles = document.querySelectorAll("[data-form-toggle]");

  toggles.forEach((toggle) => {
    const formId = toggle.getAttribute("data-form-toggle");
    const form = formId ? document.getElementById(formId) : null;

    if (!form) {
      return;
    }

    toggle.addEventListener("click", () => {
      const isOpening = form.hasAttribute("hidden");

      form.toggleAttribute("hidden", !isOpening);
      toggle.setAttribute("aria-expanded", String(isOpening));

      if (isOpening) {
        const firstField = form.querySelector("input:not([type='hidden']):not(.botcheck), select, textarea");

        requestAnimationFrame(() => {
          renderHCaptcha(form);
          form.scrollIntoView({ behavior: "smooth", block: "start" });
          firstField?.focus({ preventScroll: true });
        });
      }
    });
  });
}

function setupWeb3Forms() {
  const forms = document.querySelectorAll("[data-web3forms-form]");

  forms.forEach((form) => {
    const status = form.querySelector(".form-status");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const accessKey = form.querySelector("input[name='access_key']")?.value.trim();

      if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
        setFormStatus(status, "Add your Web3Forms access key before using this form.", "error");
        return;
      }

      const captcha = form.querySelector(".h-captcha");
      const captchaResponse = captcha ? getHCaptchaResponse(captcha) : "";

      if (captcha && !captchaResponse) {
        setFormStatus(status, "Please complete the hCaptcha check before sending.", "error");
        return;
      }

      const submitButton = form.querySelector("button[type='submit']");
      const formData = new FormData(form);

      setFormStatus(status, "Sending your request...", "");
      submitButton?.setAttribute("disabled", "");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "The form could not be sent.");
        }

        form.reset();
        resetHCaptcha(form);
        setFormStatus(status, "Thanks! Your catering request has been sent.", "success");
      } catch (error) {
        setFormStatus(
          status,
          "Sorry, the form could not be sent. Please try again or message Logi Bears on Facebook.",
          "error",
        );
      } finally {
        submitButton?.removeAttribute("disabled");
      }
    });
  });
}

function resetHCaptcha(form) {
  const captcha = form.querySelector(".h-captcha");

  if (!window.hcaptcha || !captcha) {
    return;
  }

  try {
    const widgetId = captcha.dataset.widgetId;
    window.hcaptcha.reset(widgetId ? Number(widgetId) : undefined);
  } catch (error) {
    // hCaptcha may not expose a reset handle if it has not finished loading.
  }
}

function renderHCaptcha(form) {
  const captcha = form.querySelector(".h-captcha");

  if (!captcha || captcha.dataset.widgetId) {
    return;
  }

  if (!window.hcaptcha) {
    window.setTimeout(() => renderHCaptcha(form), 250);
    return;
  }

  try {
    const widgetId = window.hcaptcha.render(captcha, {
      sitekey: captcha.dataset.sitekey,
    });
    captcha.dataset.widgetId = String(widgetId);
  } catch (error) {
    // If hCaptcha is already rendered by the browser, leave it alone.
  }
}

function getHCaptchaResponse(captcha) {
  const widgetId = captcha.dataset.widgetId;

  if (window.hcaptcha && widgetId) {
    return window.hcaptcha.getResponse(Number(widgetId));
  }

  return captcha.closest("form")?.querySelector("textarea[name='h-captcha-response']")?.value.trim() || "";
}

function setFormStatus(status, message, state) {
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.toggle("success", state === "success");
  status.classList.toggle("error", state === "error");
}

async function loadSchedule() {
  const scheduleList = document.getElementById("scheduleList");

  if (!scheduleList) {
    return;
  }

  try {
    const response = await fetch("schedule.csv", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Schedule request failed with ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parseCsv(csvText);
    const today = startOfToday();
    const upcomingEvents = rows
      .map(normalizeEvent)
      .filter(Boolean)
      .filter((event) => event.date >= today)
      .sort((a, b) => a.date - b.date);

    renderSchedule(upcomingEvents, scheduleList);
  } catch (error) {
    scheduleList.innerHTML = `
      <div class="col-12">
        <div class="empty-panel">
          Upcoming stops are being finalized. Check back soon for fresh dates.
        </div>
      </div>
    `;
  }
}

function renderSchedule(events, scheduleList) {
  if (!events.length) {
    scheduleList.innerHTML = `
      <div class="col-12">
        <div class="empty-panel">
          No upcoming stops are listed right now. Check back soon for the next Logi Bears location.
        </div>
      </div>
    `;
    return;
  }

  scheduleList.innerHTML = events
    .map((event, index) => {
      const month = event.date.toLocaleString(undefined, { month: "short" });
      const day = event.date.toLocaleString(undefined, { day: "2-digit" });
      const mapQuery = encodeURIComponent(event.address || event.location);
      const mapsHref = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
      const nextLabel = index === 0 ? '<span class="next-label">Next Stop</span>' : "";
      const timeMarkup = event.time
        ? `<span><i class="bi bi-clock-fill" aria-hidden="true"></i>${escapeHtml(event.time)}</span>`
        : "";
      const noteMarkup = event.notes
        ? `<span><i class="bi bi-chat-square-heart-fill" aria-hidden="true"></i>${escapeHtml(event.notes)}</span>`
        : "";

      return `
        <div class="col-lg-6">
          <article class="schedule-card${index === 0 ? " next-stop" : ""}">
            <div class="date-tile" aria-label="${event.dateLabel}">
              <span class="month">${escapeHtml(month)}</span>
              <span class="day">${escapeHtml(day)}</span>
            </div>
            <div>
              ${nextLabel}
              <h3>${escapeHtml(event.location)}</h3>
              <div class="schedule-meta">
                ${timeMarkup}
                <span><i class="bi bi-geo-alt-fill" aria-hidden="true"></i>${escapeHtml(event.address)}</span>
                ${noteMarkup}
              </div>
              <a class="btn btn-outline-dark btn-sm" href="${mapsHref}" target="_blank" rel="noopener">
                <i class="bi bi-map-fill" aria-hidden="true"></i>
                Open Map
              </a>
            </div>
          </article>
        </div>
      `;
    })
    .join("");
}

function normalizeEvent(row) {
  const date = parseLocalDate(row.date);

  if (!date || !row.location || !row.address) {
    return null;
  }

  return {
    date,
    dateLabel: date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: row.time || "",
    location: row.location,
    address: row.address,
    notes: row.notes || "",
  };
}

function parseCsv(text) {
  const cleanText = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < cleanText.length; index += 1) {
    const char = cleanText[index];
    const nextChar = cleanText[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value.trim());
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(value.trim());
      pushCsvRow(rows, row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value.length || row.length) {
    row.push(value.trim());
    pushCsvRow(rows, row);
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows.shift().map((header) => header.toLowerCase().trim());

  return rows.map((cells) =>
    headers.reduce((record, header, index) => {
      record[header] = cells[index] || "";
      return record;
    }, {}),
  );
}

function pushCsvRow(rows, row) {
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }
}

function parseLocalDate(value) {
  if (!value) {
    return null;
  }

  const isoMatch = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const usMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  let year;
  let month;
  let day;

  if (isoMatch) {
    year = Number(isoMatch[1]);
    month = Number(isoMatch[2]);
    day = Number(isoMatch[3]);
  } else if (usMatch) {
    year = Number(usMatch[3]);
    month = Number(usMatch[1]);
    day = Number(usMatch[2]);
  } else {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function closeMobileNavOnClick() {
  const nav = document.getElementById("navbarLinks");

  if (!nav) {
    return;
  }

  const toggle = document.querySelector(".navbar-toggler");
  const links = nav.querySelectorAll("a[href^='#']");

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.bootstrap) {
        const collapse = window.bootstrap.Collapse.getInstance(nav);

        if (collapse) {
          collapse.hide();
        }

        return;
      }

      nav.classList.remove("show");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });
}

function setupNavToggle() {
  const toggle = document.querySelector(".navbar-toggler");
  const nav = document.getElementById("navbarLinks");

  if (!toggle || !nav || window.bootstrap) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("show");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
