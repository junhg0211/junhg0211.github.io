document.addEventListener("DOMContentLoaded", () => {
  const navigation = document.querySelector("#navigation");
  const titleBox = document.querySelector("#title-content");

  new IntersectionObserver((e) => {
    e.forEach((box) => {
      if (box.isIntersecting) {
        navigation.style.transform = "";
      } else {
        navigation.style.transform = "none";
      }
    });
  }).observe(titleBox);

  const faviconEl = document.querySelector("link[rel='icon']");
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", themeChange);

  function themeChange(event) {
    if (event.matches) {
      // dark mode
      faviconEl.setAttribute("href", "/logo/logo_light_square.png");
    } else {
      faviconEl.setAttribute("href", "/logo/logo_dark_square.png");
    }
  }

  window.addEventListener("load", themeChange);
});
