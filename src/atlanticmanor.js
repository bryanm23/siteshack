import "@fontsource-variable/figtree";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./atlanticmanor.css";

const header = document.querySelector(".am-header");
const toggle = document.querySelector(".am-toggle");
const nav = document.querySelector("#am-nav");
const status = document.querySelector("#am-status");

const ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SCHEDULE = {
  Sun: { open: 12 * 60, close: 22 * 60, label: "12:00 PM" },
  Mon: null,
  Tue: null,
  Wed: { open: 11 * 60 + 30, close: 22 * 60, label: "11:30 AM" },
  Thu: { open: 11 * 60 + 30, close: 22 * 60, label: "11:30 AM" },
  Fri: { open: 11 * 60 + 30, close: 23 * 60, label: "11:30 AM" },
  Sat: { open: 11 * 60 + 30, close: 23 * 60, label: "11:30 AM" },
};

const DAY_NAMES = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

function clockLabel(minutes) {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 || 12;
  const mm = String(minute).padStart(2, "0");
  return `${hour}:${mm} ${suffix}`;
}

function zonedNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type)?.value || "";
  return {
    weekday: get("weekday"),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function nextOpening(weekday, minutes) {
  const start = ORDER.indexOf(weekday);
  if (start < 0) return null;
  for (let step = 0; step < 7; step += 1) {
    const day = ORDER[(start + step) % 7];
    const slot = SCHEDULE[day];
    if (!slot) continue;
    if (step === 0 && minutes >= slot.open) continue;
    return { day, slot, soon: step === 0 || step === 1 };
  }
  return null;
}

function describeStatus(now) {
  const today = SCHEDULE[now.weekday];
  if (today && now.minutes >= today.open && now.minutes < today.close) {
    const closes = clockLabel(today.close);
    if (today.close - now.minutes <= 60) return `Open · Closes soon, ${closes}`;
    return `Open · Closes ${closes}`;
  }
  const next = nextOpening(now.weekday, now.minutes);
  if (!next) return "Closed";
  if (next.day === now.weekday) return `Closed · Opens today at ${next.slot.label}`;
  const tomorrow = ORDER[(ORDER.indexOf(now.weekday) + 1) % 7];
  if (next.day === tomorrow) return `Closed · Opens tomorrow at ${next.slot.label}`;
  return `Closed · Opens ${DAY_NAMES[next.day]} at ${next.slot.label}`;
}

function paintStatus() {
  const now = zonedNow();
  document.querySelectorAll(".am-table tr").forEach((row) => {
    row.classList.toggle("is-today", row.dataset.day === now.weekday);
  });
  if (!status) return;
  const text = describeStatus(now);
  status.textContent = text;
  status.classList.toggle("is-open", text.startsWith("Open"));
  status.classList.toggle("is-closed", text.startsWith("Closed"));
}

function setMenu(open) {
  if (!nav || !toggle) return;
  nav.classList.toggle("is-open", open);
  toggle.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  const label = toggle.querySelector(".visually-hidden");
  if (label) label.textContent = open ? "Close menu" : "Open menu";
  document.body.classList.toggle("nav-open", open);
}

toggle?.addEventListener("click", () => {
  setMenu(!nav.classList.contains("is-open"));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

document.addEventListener("click", (event) => {
  if (!nav?.classList.contains("is-open")) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (nav.contains(target) || toggle?.contains(target)) return;
  setMenu(false);
});

window.addEventListener(
  "scroll",
  () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  },
  { passive: true },
);

paintStatus();
window.setInterval(paintStatus, 60_000);
