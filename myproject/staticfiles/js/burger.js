document.addEventListener("DOMContentLoaded", () => {
  const burger    = document.getElementById("burger-btn");
  const dashboard = document.querySelector(".dashboard");
  const sidebar   = document.querySelector(".sidebar");
  let overlay     = document.querySelector(".overlay");

  if (!burger || !dashboard || !sidebar) return;

  // если overlay отсутствует в разметке — создаём
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
  }

  function openMenu() {
    dashboard.classList.add("menu-open");
    overlay.classList.add("show");
  }

  function closeMenu() {
    dashboard.classList.remove("menu-open");
    overlay.classList.remove("show");
  }

  // переключаем меню по кнопке
  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (dashboard.classList.contains("menu-open")) closeMenu();
    else openMenu();
  });

  // клики по overlay закрывают меню
  overlay.addEventListener("click", closeMenu);

  // клик ВНЕ sidebar и кнопки — тоже закрывает
  document.addEventListener("click", (e) => {
    if (!dashboard.classList.contains("menu-open")) return;
    const insideSidebar = e.target.closest(".sidebar");
    const onBurger      = e.target.closest("#burger-btn");
    if (!insideSidebar && !onBurger) closeMenu();
  });

  // чтобы клики внутри sidebar не «пробивались» наверх
  sidebar.addEventListener("click", (e) => e.stopPropagation());
});
