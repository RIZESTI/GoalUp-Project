document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('main-calendar');
  if (!calendarEl) return;

  // === tooltip (на будущее, если решим добавить всплывашки) ===
  const tooltip = document.createElement("div");
  tooltip.className = "holiday-tooltip";
  document.body.appendChild(tooltip);

  // === инициализация календаря ===
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    locale: 'ru',
    firstDay: 1, // неделя начинается с понедельника

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    buttonText: {
      today: 'Сегодня',
      month: 'Месяц',
      week: 'Неделя',
      day: 'День'
    },

    // === формат времени (для месячного вида) ===
    eventTimeFormat: { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },

    // === подгружаем события с API ===
    events: function(fetchInfo, successCallback, failureCallback) {
      fetch("/api/goals/")
        .then(response => response.json())
        .then(data => {
          const events = data.map(goal => ({
            id: goal.id,
            title: goal.title,
            description: goal.description,
            start: goal.datetime,      // поле даты из API
            className: goal.status || "default"
          }));
          successCallback(events);
        })
        .catch(error => failureCallback(error));
    },

    // === кастомный контент событий ===
    eventContent: function(arg) {
      // Определяем текущий вид (месяц / неделя / день)
      const viewType = arg.view.type;

      // Для "Месяц" показываем время и название
      if (viewType === "dayGridMonth") {
        return {
          html: `
            <div class="fc-event-title-custom">
              ${arg.timeText ? `<span class="fc-time">${arg.timeText}</span>` : ""}
              <span class="fc-title">${arg.event.title}</span>
            </div>
          `
        };
      }

      // Для "Неделя" и "День" — только название цели
      return {
        html: `<div class="fc-event-title-custom">${arg.event.title}</div>`
      };
    },

    // === клики по дате и событиям ===
    dateClick: function(info) {
      if (typeof openGoalModalWithDate === "function") {
        openGoalModalWithDate(info.dateStr + "T09:00:00");
      }
    },

    select: function(info) {
      if (typeof openGoalModalWithDate === "function") {
        openGoalModalWithDate(info.startStr);
      }
    },

    eventClick: function(info) {
      if (typeof openGoalModalForEdit === "function") {
        openGoalModalForEdit({
          id: info.event.id,
          title: info.event.title,
          description: info.event.extendedProps?.description || "",
          start: info.event.startStr,
          status: info.event.classNames[0] || "default"
        });
      }
    }
  });

  // === рендерим календарь ===
  calendar.render();
  window.calendar = calendar;
});
