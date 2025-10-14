from django.db import models
from django.contrib.auth.models import User
import secrets


class ApiKey(models.Model):
    """
    🔐 Модель хранения мастер-ключей для API.
    Каждый пользователь может иметь только один ключ.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='api_key',
        verbose_name="Пользователь"
    )
    key = models.CharField(
        max_length=64,
        unique=True,
        default=secrets.token_hex,
        verbose_name="API ключ"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Активен"
    )

    def __str__(self):
        return f"{self.user.username} — {self.key[:10]}..."

    @staticmethod
    def generate_key():
        """Создать новый мастер-ключ (64 символа hex)."""
        return secrets.token_hex(32)

    class Meta:
        verbose_name = "API ключ"
        verbose_name_plural = "API ключи"
        ordering = ['-created_at']
