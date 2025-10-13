from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from .models import ApiKey


class MasterKeyAuth(BaseAuthentication):
    """
    🔐 Аутентификация по API ключу.
    Поддерживает:
      1. Заголовок  X-API-KEY: <ключ>
      2. Параметр  ?api_key=<ключ> (для теста через браузер)
    """

    def authenticate(self, request):
        # ✅ Берём ключ из заголовка или query (?api_key=)
        key = request.headers.get('X-API-KEY') or request.GET.get('api_key')

        # Если ключ не указан — выходим (позволяет работать с другими типами аутентификации)
        if not key:
            return None

        # Проверяем ключ в базе
        try:
            api_key = ApiKey.objects.select_related('user').get(key=key)
        except ApiKey.DoesNotExist:
            raise AuthenticationFailed(_('Неверный или отсутствующий API ключ'))

        # Проверяем активность (если есть поле is_active)
        if hasattr(api_key, 'is_active') and not api_key.is_active:
            raise AuthenticationFailed(_('API ключ деактивирован'))

        # Возвращаем пользователя, связанного с этим ключом
        return (api_key.user, None)
