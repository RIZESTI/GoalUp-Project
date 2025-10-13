# 🎯 GoalUp – система целей и продуктивности

**GoalUp** — это веб-приложение для постановки, отслеживания и достижения личных целей.  
Проект создан на **Django** и адаптирован под мобильные устройства.  
Работает по адресу: 🌐 [https://goalup.ru](https://goalup.ru)

---

## 🚀 Основной функционал

- 👤 Регистрация и авторизация пользователей  
- 🏁 Создание, редактирование и удаление целей  
- 📅 Интерактивный календарь и визуализация прогресса  
- 📂 Категории целей (работа, учёба, спорт и т.д.)  
- 🧩 Загрузка пользовательских изображений (аватарки, иконки)  
- 🕹️ Адаптивный интерфейс с динамическими элементами (JS)  
- ⚙️ REST API для работы с целями  

---

## 🧱 Технологии

| Компонент | Описание |
|------------|-----------|
| Backend | Django 5.x, Django REST Framework |
| Frontend | HTML5, CSS3, JavaScript |
| База данных | SQLite (или PostgreSQL) |
| Веб-сервер | Nginx + Gunicorn |
| ОС | Ubuntu 24.04 |
| Домен | [goalup.ru](https://goalup.ru) |

---

## 🧩 Структура проекта


GoalUp-Project/
├── manage.py
├── myproject/ # ядро Django (настройки, маршруты)
├── users/ # регистрация, авторизация, профиль
├── goals/ # управление целями
├── templates/ # HTML-шаблоны
├── static/ # CSS, JS, изображения
├── media/ # загружаемые файлы пользователей
└── README.md

---

## ⚙️ Установка и запуск локально

```bash
# Клонировать репозиторий
git clone https://github.com/RIZESTI/GoalUp-Project.git
cd GoalUp-Project

# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate   # (Windows: venv\Scripts\activate)

# Установить зависимости
pip install -r requirements.txt

# Применить миграции и запустить сервер
python manage.py migrate
python manage.py runserver
