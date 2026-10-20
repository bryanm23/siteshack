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

year.textContent = String(new Date().getFullYear());

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
