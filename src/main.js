import "@fontsource-variable/figtree";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./style.css";

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const emailLink = document.querySelector("#studio-email");
const email = emailLink.textContent.trim();
const year = document.querySelector("#year");
const form = document.querySelector("#project-form");
const status = document.querySelector("#form-status");
const composed = document.querySelector("#composed");
const composedBody = document.querySelector("#composed-body");
const composedEmail = document.querySelector("#composed-email");
const intro = document.querySelector("#site-intro");
const introSkip = document.querySelector("#site-intro-skip");
const introName = document.querySelector(".site-intro-name");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const INTRO_KEY = "siteshack-intro-seen";

year.textContent = String(new Date().getFullYear());

function finishIntro() {
  document.body.classList.remove("is-introing");
  document.body.classList.add("intro-ready");
  if (!intro) return;
  intro.classList.add("is-leaving", "is-exiting");
  intro.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    intro.classList.add("is-gone");
    intro.removeAttribute("aria-modal");
  }, 780);
}

function playIntro() {
  if (!intro || !introName) {
    document.body.classList.remove("is-introing");
    document.body.classList.add("intro-ready");
    return;
  }

  const text = introName.dataset.text || introName.textContent || "The Site Shack";
  introName.textContent = "";
  [...text].forEach((char, index) => {
    const span = document.createElement("span");
    span.className = char === " " ? "char is-space" : "char";
    span.textContent = char === " " ? "\u00a0" : char;
    span.style.setProperty("--i", String(index));
    introName.appendChild(span);
  });

  let settled = false;
  let exitTimer = 0;
  let finishTimer = 0;

  const settle = () => {
    if (settled) return;
    settled = true;
    window.clearTimeout(exitTimer);
    window.clearTimeout(finishTimer);
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode */
    }
    finishIntro();
  };

  introSkip?.addEventListener("click", settle, { once: true });
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        settle();
      }
    },
    { once: true },
  );

  requestAnimationFrame(() => {
    intro.classList.add("is-live");
  });

  const letterCount = text.length;
  // Letter cascade, a short hold, then zoom-out into the site.
  const holdMs = Math.min(3200, 1200 + letterCount * 42 + 720);
  exitTimer = window.setTimeout(() => {
    intro.classList.add("is-exiting");
  }, holdMs);
  finishTimer = window.setTimeout(settle, holdMs + 780);
}

const seenIntro = (() => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
})();

const skipIntro =
  reduceMotion ||
  seenIntro ||
  (location.hash && location.hash !== "#top" && location.hash !== "#");

if (skipIntro) {
  intro?.classList.add("is-gone");
  intro?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-introing");
  document.body.classList.add("intro-ready");
} else {
  playIntro();
}

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "The Site Shack",
  description:
    "The Site Shack builds phone-first websites for New Jersey small businesses. Simple sites start at $500 for 5 years, with SEO basics included.",
  email,
  areaServed: {
    "@type": "AdministrativeArea",
    name: "New Jersey",
  },
  priceRange: "$500+",
  knowsAbout: ["Website design", "Local SEO", "Small business websites"],
};

if (location.protocol.startsWith("http")) {
  schema.url = location.origin;
}

const schemaScript = document.createElement("script");
schemaScript.type = "application/ld+json";
schemaScript.textContent = JSON.stringify(schema);
document.head.appendChild(schemaScript);

const samplesDrop = document.querySelector(".nav-drop");
const samplesToggle = document.querySelector(".submenu-toggle");

function setSamples(open) {
  if (!samplesDrop || !samplesToggle) return;
  samplesDrop.classList.toggle("is-open", open);
  samplesToggle.setAttribute("aria-expanded", String(open));
}

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  toggle.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (!open) setSamples(false);
}

toggle.addEventListener("click", () => {
  const next = !nav.classList.contains("is-open");
  setMenu(next);
  if (next && window.matchMedia("(max-width: 1040px)").matches) setSamples(true);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

samplesToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  setSamples(!samplesDrop.classList.contains("is-open"));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSamples(false);
    setMenu(false);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (samplesDrop && !samplesDrop.contains(target) && !toggle.contains(target)) setSamples(false);
  if (!nav.classList.contains("is-open")) return;
  if (nav.contains(target) || toggle.contains(target)) return;
  setMenu(false);
});

window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  },
  { passive: true },
);

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = ["name", "business", "trade", "town", "email", "message"];
  let invalid = null;

  fields.forEach((name) => {
    const field = form.elements.namedItem(name);
    field.setCustomValidity("");
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      if (!field.value.trim()) field.setCustomValidity("Fill this in to send the note.");
    }
    if (!invalid && !field.checkValidity()) invalid = field;
  });

  const emailField = form.elements.namedItem("email");
  if (emailField instanceof HTMLInputElement && emailField.value.trim() && !emailField.validity.valid) {
    emailField.setCustomValidity("Enter an email address you can be reached at.");
    invalid = invalid || emailField;
  }

  if (invalid) {
    invalid.reportValidity();
    invalid.focus();
    return;
  }

  const data = new FormData(form);
  const read = (name) => String(data.get(name) || "").trim();
  const subject = `Website project: ${read("business")}`;
  const body = [
    `Name: ${read("name")}`,
    `Business: ${read("business")}`,
    `What they do: ${read("trade")}`,
    `Town: ${read("town")}`,
    `Email: ${read("email")}`,
    `Phone: ${read("phone") || "Not given"}`,
    "",
    read("message"),
  ].join("\n");

  composed.hidden = false;
  composedBody.textContent = body;
  composedEmail.textContent = email;
  composedEmail.href = `mailto:${email}`;
  status.textContent = "Your email app should open with this note. A copy is here in case it doesn't.";

  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

form?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.setCustomValidity("");
    }
  });
});

const revealNodes = document.querySelectorAll(".reveal");

if (revealNodes.length) {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  }
}
