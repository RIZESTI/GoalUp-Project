document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('main-calendar');
  if (!calendarEl) return;

  // создаём контейнер для tooltip (на будущее)
  const tooltip = document.createElement("div");
  tooltip.className = "holiday-tooltip";
  document.body.appendChild(tooltip);

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    locale: 'ru',
    firstDay: 1, // начинаем неделю с понедельника
    eventTimeFormat: { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false   // 24-часовой формат
    },
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

    events: function(fetchInfo, successCallback, failureCallback) {
      fetch("/api/goals/")
        .then(response => response.json())
        .then(data => {
          const events = data.map(goal => ({
            id: goal.id,
            title: goal.title,
            description: goal.description,
            start: goal.start,
            className: goal.status ? goal.status : "default" // ставим класс по статусу
          }));
          successCallback(events);
        })
        .catch(error => failureCallback(error));
    },

    // клик по дате
    dateClick: function(info) {
      if (typeof openGoalModalWithDate === "function") {
        openGoalModalWithDate(info.dateStr + "T09:00:00");
      }
    },

    // выделение диапазона
    select: function(info) {
      if (typeof openGoalModalWithDate === "function") {
        openGoalModalWithDate(info.startStr);
      }
    },

    // клик по событию = редактирование
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
