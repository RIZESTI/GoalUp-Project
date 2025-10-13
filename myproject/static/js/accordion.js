document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach((header) => {
    const content = header.nextElementSibling;

    // Если стрелка уже есть (после перезагрузок кода) — не дублируем
    let arrow = header.querySelector(".accordion-arrow");
    if (!arrow) {
      arrow = document.createElement("span");
      arrow.className = "accordion-arrow";
      header.appendChild(arrow);
    }

    // Утилита: отрисовать нужную иконку (вправо/вниз)
    const renderIcon = (isOpen) => {
      // Плавный кросс-фейд
      arrow.style.opacity = "0";
      setTimeout(() => {
        try {
          if (window.lucide && lucide.icons) {
            const name = isOpen ? "chevron-down" : "chevron-right";
            // ширину/высоту можно подстроить под твои размеры
            arrow.innerHTML = lucide.icons[name].toSvg({ width: 18, height: 18 });
          } else {
            // Фолбэк, если почему-то lucide не загрузился
            arrow.textContent = isOpen ? "v" : ">";
          }
        } catch (e) {
          arrow.textContent = isOpen ? "v" : ">";
        }
        arrow.style.opacity = "1";
      }, 90);
    };

    // Начальное состояние
    const initiallyOpen = content.classList.contains("show");
    renderIcon(initiallyOpen);

    // Переключение аккордеона
    header.addEventListener("click", () => {
      content.classList.toggle("show");
      renderIcon(content.classList.contains("show"));
    });
  });
});
