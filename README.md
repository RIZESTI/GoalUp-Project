# ⚽ GoalUp — Django Web Application

## 📖 Описание проекта  
**GoalUp** — это современный онлайн-календарь, созданный на фреймворке **Django (Python 3.13)**.  
Платформа позволяет пользователям планировать дела, отмечать цели, отслеживать прогресс и синхронизировать события.  
База данных — **SQLite**, сервер — **Hoster.kz (VDS Cloud 1-1-25)**,  
домен — **goalup.ru**, ОС — **Ubuntu 24.04 LTS**.

---

## ⚙ Параметры сервера  

| Параметр | Значение |
|-----------|-----------|
| Сервер | cloud-001.h-goalup.ru |
| IP-адрес | **89.207.251.136** |
| Локальный IP | **172.16.0.2** |
| ОС | Ubuntu 24.04 |
| CPU / RAM / Storage | 1 vCPU / 1 GB RAM / 25 GB SSD |
| Локация | Алматы |

---

## 🚀 Локальный запуск (Windows PowerShell)

### 1️⃣ Проверка Python  
```bash
py --version
```
Если не установлен — скачай с [python.org/downloads](https://www.python.org/downloads/).

---

### 2️⃣ Распаковка проекта  
```bash
cd C:\Projects\
Expand-Archive .\myproject.zip -DestinationPath .\goalup\
cd .\goalup\
```

---

### 3️⃣ Создание виртуального окружения  
```bash
py -m venv venv
venv\Scripts\activate
```

---

### 4️⃣ Установка зависимостей  
```bash
pip install -r requirements.txt
```
Если файла `requirements.txt` нет:  
```bash
pip install django pillow
```

---

### 5️⃣ Применение миграций  
```bash
py manage.py makemigrations
py manage.py migrate
```

---

### 6️⃣ Создание суперпользователя  
```bash
py manage.py createsuperuser
```

---

### 7️⃣ Запуск локального сервера  
```bash
py manage.py runserver
```
Теперь открой в браузере:  
👉 http://127.0.0.1:8000/

---

## ☁ Развёртывание на сервере (Ubuntu 24.04)

### 1️⃣ Подключение к серверу  
```bash
ssh root@89.207.251.136
# или
ssh admin@89.207.251.136
```

---

### 2️⃣ Установка зависимостей  
```bash
apt update && apt upgrade -y
apt install python3 python3-pip python3-venv nginx git unzip -y
```

---

### 3️⃣ Загрузка проекта  
```bash
cd /var/www
git clone https://github.com/potudansky-kirill/goalup.git
cd goalup
```

---

### 4️⃣ Создание окружения и установка зависимостей  
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py collectstatic --noinput
```

---

### 5️⃣ Проверка запуска  
```bash
python3 manage.py runserver 0.0.0.0:8000
```
👉 http://89.207.251.136:8000

---

### 6️⃣ Настройка Gunicorn  
```bash
pip install gunicorn
gunicorn goalup.wsgi:application --bind 0.0.0.0:8000
```

---

### 7️⃣ Настройка Nginx для домена goalup.ru  
Создай конфиг:  
```bash
sudo nano /etc/nginx/sites-available/goalup
```
Вставь:
```nginx
server {
    listen 80;
    server_name goalup.ru www.goalup.ru;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        alias /var/www/goalup/staticfiles/;
    }
    location /media/ {
        alias /var/www/goalup/media/;
    }
    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/goalup/gunicorn.sock;
    }
}
```

Активируй конфиг:  
```bash
ln -s /etc/nginx/sites-available/goalup /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

### 8️⃣ Настройка SSL (HTTPS)  
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d goalup.ru -d www.goalup.ru
```

После успешной установки сайт будет доступен по адресу:  
👉 https://goalup.ru

---

## 🧰 Полезные команды (PowerShell и Ubuntu)

| Назначение | Команда |
|-------------|----------|
| Подключение к серверу | `ssh root@89.207.251.136` |
| Перейти в проект | `cd /var/www/goalup` |
| Активировать окружение | `source venv/bin/activate` |
| Проверить статус gunicorn | `sudo systemctl status gunicorn` |
| Проверить статус nginx | `sudo systemctl status nginx` |
| Перезапустить сайт | `sudo systemctl restart gunicorn nginx` |
| Просмотреть ошибки gunicorn | `sudo journalctl -u gunicorn -n 30` |
| Просмотреть логи nginx | `sudo journalctl -u nginx -n 30` |
| Редактировать файл | `sudo nano <имя_файла>` |
| Резервная копия БД | `cp db.sqlite3 db_backup_$(date +%F).sqlite3` |

---

## 🔐 Доступ к админ-панели Django

**Адрес:**  
👉 https://goalup.ru/admin/  

Введи логин и пароль администратора, созданные ранее.  
*(Не храни реальные пароли в GitHub или открытых файлах!)*

---

## 🔑 API-доступ  

GoalUp предоставляет публичный REST API для интеграции календаря и целей с внешними сервисами.  
Авторизация выполняется через API-ключ.  

Пример запроса:
```bash
https://goalup.ru/api/events/?api_key=super-secret-key-123
```

Пример ответа:
```json
[
  {
    "id": 1,
    "title": "Пробежка 5 км",
    "date": "2025-10-16",
    "completed": false,
    "category": "спорт"
  }
]
```

---

## 👤 Автор проекта  
**Потуданский Кирилл Николаевич**  
📱 Telegram / WhatsApp: +7 (XXX) XXX-XX-XX  
🌍 https://goalup.ru  

© 2025 **GoalUp** — Все права защищены.
