document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('main-calendar');
  if (!calendarEl) return;

  // === tooltip (на будущее) ===
  const tooltip = document.createElement("div");
  tooltip.className = "holiday-tooltip";
  document.body.appendChild(tooltip);

  // 🧩 защита от двойного открытия модалки
  let isCreatingGoal = false;

  // === инициализация календаря ===
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    locale: 'ru',
    firstDay: 1,

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

    eventTimeFormat: { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },

    // === загрузка событий ===
    events: function(fetchInfo, successCallback, failureCallback) {
      fetch("/api/goals/")
        .then(response => response.json())
        .then(data => {
          const events = data.map(goal => ({
            id: goal.id,
            title: goal.title,
            description: goal.description,
            start: goal.datetime,
            className: goal.status || "default"
          }));
          successCallback(events);
        })
        .catch(error => failureCallback(error));
    },

    eventContent: function(arg) {
      const viewType = arg.view.type;
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
      return {
        html: `<div class="fc-event-title-custom">${arg.event.title}</div>`
      };
    },

    // === клики по дате и диапазону ===
    dateClick: function(info) {
      if (isCreatingGoal) return; // 🚫 предотвращает дубль
      isCreatingGoal = true;

      if (typeof openGoalModalWithDate === "function") {
        openGoalModalWithDate(info.dateStr + "T09:00:00");
      }

      setTimeout(() => isCreatingGoal = false, 1000);
    },

    select: function(info) {
      if (isCreatingGoal) return; // 🚫 предотвращает дубль
      isCreatingGoal = true;

      if (typeof openGoalModalWithDate === "function") {
        openGoalModalWithDate(info.dateStr + "T09:00:00");
      }

      setTimeout(() => isCreatingGoal = false, 1000);
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

  calendar.render();
  window.calendar = calendar;
});
