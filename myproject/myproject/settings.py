import os
from pathlib import Path

# ===============================
# ⚙️ БАЗОВЫЕ НАСТРОЙКИ ПРОЕКТА
# ===============================

BASE_DIR = Path(__file__).resolve().parent.parent

# ⚠️ Замени ключ на свой при деплое
SECRET_KEY = '5a911e272d245b285e6e99e24ea0eab80b276db84db2464687f46eaf682ede0b'

# 🔧 В продакшене обязательно выключи DEBUG
DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost", "*"]

APPEND_SLASH = True  # автодобавление / в конце URL

# --- HTTPS и безопасность ---
SECURE_SSL_REDIRECT = True          # перенаправление HTTP -> HTTPS
SESSION_COOKIE_SECURE = True        # сессионные cookie только по HTTPS
CSRF_COOKIE_SECURE = True           # защита CSRF-токена по HTTPS


# ===============================
# 📦 ПРИЛОЖЕНИЯ
# ===============================

INSTALLED_APPS = [
    # Django стандарт
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Твои приложения
    'users',
    'planner',      # приложение календаря
    'goalapi',      # 👈 API-приложение

    # Django REST Framework
    'rest_framework',
]

# ===============================
# ⚙️ MIDDLEWARE
# ===============================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

# ===============================
# 🎨 ШАБЛОНЫ
# ===============================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # ✅ контекст-процессор бокового списка целей
                'planner.context_processors.sidebar_goals',
            ],
        },
    },
]

WSGI_APPLICATION = 'myproject.wsgi.application'

# ===============================
# 🗃️ БАЗА ДАННЫХ
# ===============================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / "db.sqlite3",
    }
}

# ===============================
# 🔐 ВАЛИДАЦИЯ ПАРОЛЕЙ
# ===============================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ===============================
# 🌍 ЛОКАЛИЗАЦИЯ
# ===============================

LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Asia/Almaty'
USE_I18N = True
USE_TZ = True

# ===============================
# 🖼️ СТАТИКА И МЕДИА
# ===============================

STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# ===============================
# 🔑 АУТЕНТИФИКАЦИЯ
# ===============================

LOGIN_URL = "users:login"
LOGIN_REDIRECT_URL = "planner:home"
LOGOUT_REDIRECT_URL = "planner:home"

# ===============================
# ⚙️ ПРОЧЕЕ
# ===============================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ===============================
# 🧩 DJANGO REST FRAMEWORK + МАСТЕР-КЛЮЧ
# ===============================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'goalapi.authentication.MasterKeyAuth',  # 👈 кастомная авторизация
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # запрет анонимного доступа
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',  # для удобства в браузере
    ],
}

# ===============================
# 🧩 ДОП НАСТРОЙКИ (опционально)
# ===============================

# Можно включить CORS, если будешь подключать фронтенд отдельно
# INSTALLED_APPS += ['corsheaders']
# MIDDLEWARE.insert(2, 'corsheaders.middleware.CorsMiddleware')
# CORS_ALLOW_ALL_ORIGINS = True
