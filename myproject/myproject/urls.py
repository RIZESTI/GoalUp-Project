from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views  # 👈 ЭТО СТРОКА — обязательно добавь!

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('goalapi.urls')),
    path('users/', include('users.urls')),      # маршруты пользователей
    path('planner/', include('planner.urls')),  # маршруты календаря
    path('', views.welcome, name='welcome'),    # 👈 главная (welcome)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
