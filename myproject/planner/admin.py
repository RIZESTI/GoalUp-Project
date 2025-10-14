from django.contrib import admin
from django.utils.html import format_html
from .models import Goal

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ('id', 'title_short', 'user_link', 'datetime', 'status')
    list_filter = ('status', 'datetime')
    search_fields = ('title', 'description', 'user__username')
    ordering = ('-datetime',)
    date_hierarchy = 'datetime'
    list_select_related = ('user',)
    actions = ('mark_completed', 'mark_uncompleted')

    def title_short(self, obj):
        txt = obj.title or ''
        return txt if len(txt) <= 50 else txt[:47] + '...'
    title_short.short_description = 'Заголовок'

    def user_link(self, obj):
        if obj.user:
            return format_html('<a href="/admin/auth/user/{}/change/">{}</a>', obj.user.id, obj.user.username)
        return '-'
    user_link.short_description = 'Пользователь'
    user_link.admin_order_field = 'user'

    def mark_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} целей помечено как выполненные.')
    mark_completed.short_description = 'Отметить как выполненные'

    def mark_uncompleted(self, request, queryset):
        updated = queryset.update(status='default')
        self.message_user(request, f'{updated} целей возвращено в обычные.')
    mark_uncompleted.short_description = 'Снять отметку выполнено'
