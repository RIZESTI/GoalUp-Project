// static/js/password_toggle.js
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.toggle-password');

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.password-wrapper');
      if (!wrapper) return;

      const input = wrapper.querySelector('input');
      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = '<i data-lucide="eye-off"></i>';
      } else {
        input.type = "password";
        btn.innerHTML = '<i data-lucide="eye"></i>';
      }
      lucide.createIcons(); // перерисовать иконку
    });
  });

  // инициализируем иконки при загрузке
  lucide.createIcons();
});
