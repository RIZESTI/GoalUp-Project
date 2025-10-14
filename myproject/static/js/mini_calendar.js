// static/js/mini_calendar.js
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("mini-calendar-grid");
  const monthLabel = document.getElementById("mini-month");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  let current = new Date();

  // 🎉 Праздники Казахстана с названиями
  const HOLIDAYS = {
    "01-01": "Новый год",
    "01-02": "Новый год",
    "01-07": "Рождество",
    "03-08": "Международный женский день",
    "03-21": "Наурыз",
    "03-22": "Наурыз",
    "03-23": "Наурыз",
    "05-01": "Праздник единства народа Казахстана",
    "05-07": "День защитника Отечества",
    "05-09": "День Победы",
    "07-06": "День столицы",
    "08-30": "День Конституции",
    "10-25": "День Республики",
    "12-01": "День Первого Президента",
    "12-16": "День Независимости",
    "12-17": "День Независимости"
  };

  // tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "mini-tooltip";
  document.body.appendChild(tooltip);

  function renderCalendar(date) {
    grid.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    monthLabel.textContent = date.toLocaleString("ru-RU", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // пустые ячейки до начала месяца
    for (let i = 1; i < startDay; i++) {
      grid.innerHTML += `<div></div>`;
    }

    // дни месяца
    for (let d = 1; d <= daysInMonth; d++) {
      const dayDate = new Date(year, month, d);
      const today = new Date();
      const isToday =
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
      const key = `${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const holidayName = HOLIDAYS[key];

      const cell = document.createElement("div");
      cell.className = "day";
      if (isToday) cell.classList.add("today");
      if (isWeekend) cell.classList.add("weekend");
      if (holidayName) cell.classList.add("holiday");

      cell.textContent = d;

      // если праздник → наведение показывает кастомный tooltip
      if (holidayName) {
        cell.addEventListener("mouseenter", (e) => {
          tooltip.textContent = holidayName;
          tooltip.style.display = "block";
          tooltip.style.left = e.pageX + 10 + "px";
          tooltip.style.top = e.pageY + 10 + "px";
        });
        cell.addEventListener("mousemove", (e) => {
          tooltip.style.left = e.pageX + 10 + "px";
          tooltip.style.top = e.pageY + 10 + "px";
        });
        cell.addEventListener("mouseleave", () => {
          tooltip.style.display = "none";
        });
      }

      grid.appendChild(cell);
    }
  }

  prevBtn.addEventListener("click", () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar(current);
  });

  nextBtn.addEventListener("click", () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar(current);
  });

  renderCalendar(current);
});
