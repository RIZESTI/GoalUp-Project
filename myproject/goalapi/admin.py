from django.contrib import admin
from .models import ApiKey
import secrets


@admin.register(ApiKey)
class ApiKeyAdmin(admin.ModelAdmin):
    list_display = ('user', 'short_key', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('user__username', 'key')
    readonly_fields = ('key', 'created_at')
    actions = ['regenerate_keys']

    def short_key(self, obj):
        """Показываем укороченный ключ"""
        return obj.key[:12] + "..."
    short_key.short_description = "Ключ"

    def save_model(self, request, obj, form, change):
        """Автоматически создаёт ключ при первом сохранении"""
        if not obj.key:
            obj.key = secrets.token_hex(32)
        super().save_model(request, obj, form, change)

    def regenerate_keys(self, request, queryset):
        """Действие в админке: пересоздать ключи"""
        for api_key in queryset:
            api_key.key = secrets.token_hex(32)
            api_key.save()
        self.message_user(request, f"Ключи успешно пересозданы ({queryset.count()})")
    regenerate_keys.short_description = "🔁 Пересоздать ключи"
