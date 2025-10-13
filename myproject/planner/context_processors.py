from .models import Goal

def sidebar_goals(request):
    """
    Контекст-процессор: добавляет последние цели пользователя в шаблоны.
    Используется для бокового меню.
    """
    if not request.user.is_authenticated:
        return {"goals": []}

    goals = (
        Goal.objects
        .filter(user=request.user)
        .order_by("-datetime")[:10]  # показываем только последние 10
    )
    return {"goals": goals}
