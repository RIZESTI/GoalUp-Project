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

    // === как отображать события ===
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
  if (isCreatingGoal) return;
  isCreatingGoal = true;

  if (typeof openGoalModalWithDate === "function") {
    let clickedDate;

    // 🧠 На ПК FullCalendar отдаёт info.date (Date), а на мобилке info.dateStr (string)
    if (info.date instanceof Date) {
      clickedDate = info.date.toISOString();
    } else if (typeof info.dateStr === "string") {
      clickedDate = info.dateStr.includes("T")
        ? info.dateStr
        : info.dateStr + "T09:00:00";
    }

    if (clickedDate) {
      openGoalModalWithDate(clickedDate);
    } else {
      console.error("⚠️ Не удалось определить дату:", info);
    }
  }

  setTimeout(() => isCreatingGoal = false, 800);
},

select: function(info) {
  if (isCreatingGoal) return;
  isCreatingGoal = true;

  if (typeof openGoalModalWithDate === "function") {
    let selectedDate;

    if (info.start instanceof Date) {
      selectedDate = info.start.toISOString();
    } else if (typeof info.startStr === "string") {
      selectedDate = info.startStr.includes("T")
        ? info.startStr
        : info.startStr + "T09:00:00";
    }

    if (selectedDate) {
      openGoalModalWithDate(selectedDate);
    } else {
      console.error("⚠️ Не удалось определить диапазон:", info);
    }
  }

  setTimeout(() => isCreatingGoal = false, 800);
},

    // === клик по событию ===
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

  // === рендер календаря ===
  calendar.render();
  window.calendar = calendar;
});
