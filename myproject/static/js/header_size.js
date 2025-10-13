// header_size.js
document.addEventListener('DOMContentLoaded', () => {
  function updateHeaderHeightVar() {
    const header = document.querySelector('header'); // предполагаем, что шапка в теге <header>
    if (!header) return;
    const h = header.offsetHeight;
    // записываем в корень документа
    document.documentElement.style.setProperty('--header-height', `${h}px`);
  }

  // установить сразу
  updateHeaderHeightVar();

  // подписаться на ресайз — если меняется размер окна, пересчитаем
  window.addEventListener('resize', updateHeaderHeightVar);

  // если на странице есть элементы, которые могут изменить высоту шапки после загрузки
  // (например, динамическое изменение контента), можно повторно вызвать updateHeaderHeightVar
});
