document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('goalsFilter');
  const list = document.getElementById('goalsList');
  if (!form || !list) return;

  async function loadFilteredGoals() {
    const params = new URLSearchParams(new FormData(form));
    const url = '/goals/?' + params.toString();

    const res = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    const data = await res.json();

    list.innerHTML = '';
    if (!data.length) {
      list.innerHTML = '<li>Ничего не найдено</li>';
      return;
    }
    data.forEach(g => {
      const li = document.createElement('li');
      li.className = 'goal-row ' + g.status;
      li.textContent = g.title;
      list.appendChild(li);
    });
  }

  form.querySelector('#applyFilters').addEventListener('click', loadFilteredGoals);
  form.querySelector('#resetFilters').addEventListener('click', () => {
    form.reset();
    loadFilteredGoals();
  });

  // начальная загрузка
  loadFilteredGoals();
});
