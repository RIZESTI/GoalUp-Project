from django.db import models 
from django.contrib.auth.models import User


class Goal(models.Model):
    STATUS_CHOICES = [
        ('default', 'Обычная'),
        ('important', 'Важная'),
        ('completed', 'Выполнена'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="goals",
        verbose_name="Пользователь"
    )
    title = models.CharField(
        max_length=200,
        verbose_name="Название цели"
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name="Описание"
    )
    datetime = models.DateTimeField(
        verbose_name="Дата и время выполнения"
    )
    status = models.CharField(        # 🔥 новое поле
        max_length=20,
        choices=STATUS_CHOICES,
        default='default',
        verbose_name="Статус"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Создано"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Обновлено"
    )

    def __str__(self):
        return f"{self.title} ({self.datetime.strftime('%d.%m.%Y %H:%M')})"
