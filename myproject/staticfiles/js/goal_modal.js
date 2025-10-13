document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('goalModal');
  const openBtn = document.getElementById('openGoalModal');
  const closeBtn = document.getElementById('closeGoalModal');
  const form = document.getElementById('goalForm');
  const dateInput = document.getElementById('goalDate');
  const timeInput = document.getElementById('goalTime');
  const goalIdInput = document.getElementById('goalId');
  const titleInput = form.querySelector('input[name="title"]');
  const descriptionInput = form.querySelector('textarea[name="description"]');
  const statusSelect = document.getElementById('goalStatus');
  const deleteBtn = document.getElementById('deleteGoalBtn');

  const deleteModal = document.getElementById('deleteModal');
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  const cancelDeleteBtn = document.getElementById('cancelDelete');
  let goalToDelete = null;

  function buildUrl(pattern, id) { return pattern.replace(/0\/?$/, String(id) + "/"); }
  function openMainModal() { modal.classList.remove('hidden'); if (titleInput) setTimeout(() => titleInput.focus(), 30); }
  function closeMainModal() { modal.classList.add('hidden'); }
  function openDeleteModal() { deleteModal.classList.remove('hidden'); }
  function closeDeleteModal() { deleteModal.classList.add('hidden'); }

  // управляем "Выполнена"
  function ensureCompletedOption(allow, valueToSet) {
    if (!statusSelect) return;
    let completed = statusSelect.querySelector('option[value="completed"]');
    if (allow) {
      if (!completed) {
        completed = document.createElement('option');
        completed.value = 'completed';
        completed.textContent = 'Выполнена';
        statusSelect.appendChild(completed);
      }
      if (valueToSet) statusSelect.value = valueToSet;
    } else {
      if (completed) completed.remove();
      if (statusSelect.value === 'completed') statusSelect.value = 'default';
    }
  }

  // кнопка "Добавить цель"
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      form.reset();
      goalIdInput.value = "";
      if (deleteBtn) deleteBtn.style.display = "none";
      ensureCompletedOption(false);
      const titleEl = modal.querySelector('h2');
      if (titleEl) titleEl.textContent = "Новая цель";
      if (statusSelect) statusSelect.value = "default";
      openMainModal();
    });
  }

  // закрытие
  if (closeBtn) closeBtn.addEventListener('click', () => { closeMainModal(); cleanupQuery(); });
  window.addEventListener('click', (e) => {
    if (e.target === modal) { closeMainModal(); cleanupQuery(); }
    if (e.target === deleteModal) closeDeleteModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      if (!modal.classList.contains("hidden")) { closeMainModal(); cleanupQuery(); }
      if (!deleteModal.classList.contains("hidden")) closeDeleteModal();
    }
  });

  // сохранение
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    let url = window.goalUrls.add;
    let successMsg = "Цель сохранена!";
    if (goalIdInput.value) {
      url = buildUrl(window.goalUrls.editPattern, goalIdInput.value);
      successMsg = "Цель обновлена!";
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "X-CSRFToken": formData.get("csrfmiddlewaretoken") },
      body: formData
    });

    if (response.ok) {
      closeMainModal(); form.reset();
      showToast(successMsg, "success");
      window.location.reload();
    } else {
      let msg = "Ошибка при сохранении цели";
      try { const data = await response.json(); if (data.message) msg = data.message; } catch {}
      showToast(msg, "error");
    }
  });

  // удаление
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      const id = goalIdInput.value;
      if (!id) return;
      goalToDelete = id;
      openDeleteModal();
    });
  }
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => { goalToDelete = null; closeDeleteModal(); });

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!goalToDelete) return;
      const url = buildUrl(window.goalUrls.deletePattern, goalToDelete);
      const response = await fetch(url, {
        method: "POST",
        headers: { "X-CSRFToken": form.querySelector("[name=csrfmiddlewaretoken]").value }
      });

      if (response.ok) {
        closeMainModal(); form.reset();
        showToast("Цель удалена!", "warning");
        window.location.reload();
      } else {
        let msg = "Ошибка при удалении цели";
        try { const data = await response.json(); if (data.message) msg = data.message; } catch {}
        showToast(msg, "error");
      }
      closeDeleteModal(); goalToDelete = null;
    });
  }

  // открыть модалку с датой
  window.openGoalModalWithDate = function(dateStr) {
    form.reset();
    goalIdInput.value = "";
    if (deleteBtn) deleteBtn.style.display = "none";

    const dateObj = new Date(dateStr);
    dateInput.value = dateObj.toISOString().split('T')[0];
    timeInput.value = dateObj.toTimeString().slice(0,5);

    ensureCompletedOption(false);
    if (statusSelect) statusSelect.value = "default";

    const titleEl = modal.querySelector('h2');
    if (titleEl) titleEl.textContent = "Новая цель";
    openMainModal();
  };

  // открыть для редактирования
  window.openGoalModalForEdit = function(goal) {
    form.reset();
    goalIdInput.value = goal.id;
    titleInput.value = goal.title;
    descriptionInput.value = goal.description || "";

    if (goal.start) {
      const dateObj = new Date(goal.start);
      dateInput.value = dateObj.toISOString().split('T')[0];
      timeInput.value = dateObj.toTimeString().slice(0,5);
    }

    ensureCompletedOption(true, (goal.status || "default"));

    if (deleteBtn) deleteBtn.style.display = "inline-block";
    const titleEl = modal.querySelector('h2');
    if (titleEl) titleEl.textContent = "Редактировать цель";
    openMainModal();
  };

  // открыть по query
  const params = new URLSearchParams(window.location.search);
  if (params.get("new") === "1") {
    form.reset();
    goalIdInput.value = "";
    ensureCompletedOption(false);
    if (statusSelect) statusSelect.value = "default";
    if (deleteBtn) deleteBtn.style.display = "none";
    openMainModal();
  } else if (params.get("edit")) {
    openEditById(params.get("edit"));
  }

  async function openEditById(goalId) {
    try {
      const res = await fetch(window.goalUrls.api);
      const arr = await res.json();
      const g = arr.find(x => String(x.id) === String(goalId));
      if (!g) return;

      const dt = new Date(g.start);
      const pad = (n) => String(n).padStart(2, "0");

      goalIdInput.value = g.id;
      titleInput.value = g.title || "";
      descriptionInput.value = g.description || "";
      dateInput.value = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`;
      timeInput.value = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;

      ensureCompletedOption(true, (g.status || "default"));

      if (deleteBtn) deleteBtn.style.display = "inline-block";
      const titleEl = modal.querySelector('h2');
      if (titleEl) titleEl.textContent = "Редактировать цель";
      openMainModal();
    } catch (e) { console.error(e); }
  }

  // делегирование: боковушка
  const sidebar = document.querySelector(".goals-block");
  if (sidebar) {
    sidebar.addEventListener("click", (e) => {
      if (e.target.closest(".goal-action.edit")) {
        const id = e.target.closest(".goal-action.edit").dataset.id;
        if (id) openEditById(id);
      }
      if (e.target.closest(".goal-action.danger")) {
        const id = e.target.closest(".goal-action.danger").dataset.id;
        if (id) { goalToDelete = id; openDeleteModal(); }
      }
      if (e.target.closest(".goal-action.complete")) {
        const id = e.target.closest(".goal-action.complete").dataset.id;
        if (id) markGoalCompleted(id, e.target.closest("li"));
      }
    });
  }

  // делегирование: таблица
  const goalsPage = document.querySelector(".goals-page");
  if (goalsPage) {
    goalsPage.addEventListener("click", (e) => {
      if (e.target.closest(".goal-action.edit")) {
        const id = e.target.closest(".goal-action.edit").dataset.id;
        if (id) openEditById(id);
      }
      if (e.target.closest(".goal-action.danger")) {
        const id = e.target.closest(".goal-action.danger").dataset.id;
        if (id) { goalToDelete = id; openDeleteModal(); }
      }
      if (e.target.closest(".goal-action.complete")) {
        const id = e.target.closest(".goal-action.complete").dataset.id;
        if (id) markGoalCompleted(id, e.target.closest("tr"));
      }
    });
  }

  // завершение
  async function markGoalCompleted(goalId, rowEl) {
    try {
      const res = await fetch(`/goals/complete/${goalId}/`, {
        method: "POST",
        headers: { "X-CSRFToken": form.querySelector("[name=csrfmiddlewaretoken]").value }
      });
      const data = await res.json();
      if (data.status === "ok") {
        showToast("Цель выполнена!", "success");

        // боковушка/таблица
        if (rowEl) {
          rowEl.classList.remove("default", "important");
          rowEl.classList.add("completed");
          const title = rowEl.querySelector(".goal-title") || rowEl.querySelector("td:first-child");
          if (title) { title.style.color = "#9e9e9e"; title.style.textDecoration = "line-through"; }
          const completeBtn = rowEl.querySelector(".goal-action.complete");
          if (completeBtn) completeBtn.remove();
        }

        // 🔥 обновляем календарь
        if (window.calendar) {
          const ev = window.calendar.getEventById(String(goalId));
          if (ev) {
            ev.setProp("classNames", ["completed"]);
            ev.setProp("color", "#9e9e9e");
            ev.setProp("textColor", "#fff");
          }
        }

      } else {
        showToast("Не удалось завершить цель", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка при завершении цели", "error");
    }
  }

  // чистим query
  function cleanupQuery() {
    if (window.history && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete("new");
      url.searchParams.delete("edit");
      window.history.replaceState({}, "", url.toString());
    }
  }
});
