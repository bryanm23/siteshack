import "@fontsource-variable/figtree";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource/dm-mono/400.css";
import "./samples.css";

document.querySelectorAll(".sample-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    if (status) {
      status.textContent =
        "This is a sample form. Nothing was sent. On a real site, this message would go to the shop.";
    }
    form.reset();
  });
});
