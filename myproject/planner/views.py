from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from datetime import datetime

from .models import Goal


# ================== Основные страницы ==================

def home(request):
    """Главная: для гостя — приветствие, для авторизованного — календарь"""
    if request.user.is_authenticated:
        return render(request, "calendar/home.html")
    return render(request, "welcome.html")


@login_required
def goals_list(request):
    """Страница со списком целей + поддержка фильтров"""
    goals = Goal.objects.filter(user=request.user)

    # === Фильтрация ===
    status = request.GET.get("status")
    if status:
        goals = goals.filter(status=status)

    q = request.GET.get("q")
    if q:
        goals = goals.filter(Q(title__icontains=q) | Q(description__icontains=q))

    date_from = request.GET.get("from")
    date_to = request.GET.get("to")

    if date_from:
        try:
            date_from_obj = datetime.fromisoformat(date_from)
            goals = goals.filter(datetime__date__gte=date_from_obj.date())
        except ValueError:
            pass

    if date_to:
        try:
            date_to_obj = datetime.fromisoformat(date_to)
            goals = goals.filter(datetime__date__lte=date_to_obj.date())
        except ValueError:
            pass

    # === AJAX (фильтрация без перезагрузки) ===
    if request.headers.get("x-requested-with") == "XMLHttpRequest":
        data = [
            {
                "id": g.id,
                "title": g.title,
                "description": g.description or "",
                "status": g.status,
                "datetime": g.datetime.isoformat() if g.datetime else None,
            }
            for g in goals.order_by("-datetime")
        ]
        return JsonResponse(data, safe=False)

    # === Обычный HTML ===
    return render(request, "calendar/goals.html", {"goals": goals.order_by("-datetime")})


# ================== CRUD для целей ==================

@csrf_exempt
@login_required
def add_goal(request):
    """Создание новой цели"""
    if request.method == "POST":
        title = request.POST.get("title")
        description = request.POST.get("description")
        date = request.POST.get("date")
        time = request.POST.get("time")
        status = request.POST.get("status", "default")

        if not title or not date or not time:
            return JsonResponse({"status": "error", "message": "Неверные данные"}, status=400)

        try:
            dt_str = f"{date} {time}"
            dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
        except ValueError:
            return JsonResponse({"status": "error", "message": "Неверный формат даты/времени"}, status=400)

        # ✅ Проверка: если цель с тем же названием и временем уже есть — не дублировать
        duplicate = Goal.objects.filter(
            user=request.user,
            title=title,
            datetime=dt
        ).exists()

        if duplicate:
            return JsonResponse({"status": "duplicate", "message": "Такая цель уже существует"})

        # Создание новой цели
        goal = Goal.objects.create(
            user=request.user,
            title=title,
            description=description,
            datetime=dt,
            status=status
        )
        return JsonResponse({"status": "ok", "id": goal.id})

    return JsonResponse({"status": "error", "message": "Метод не поддерживается"}, status=400)


@csrf_exempt
@login_required
def edit_goal(request, goal_id):
    """Редактирование существующей цели"""
    if request.method == "POST":
        goal = get_object_or_404(Goal, id=goal_id, user=request.user)
        goal.title = request.POST.get("title")
        goal.description = request.POST.get("description")

        date = request.POST.get("date")
        time = request.POST.get("time")
        if date and time:
            try:
                dt_str = f"{date} {time}"
                goal.datetime = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
            except ValueError:
                return JsonResponse({"status": "error", "message": "Неверный формат даты/времени"}, status=400)

        status = request.POST.get("status")
        if status in ["default", "important", "completed"]:
            goal.status = status

        goal.save()
        return JsonResponse({"status": "ok", "id": goal.id})

    return JsonResponse({"status": "error", "message": "Метод не поддерживается"}, status=400)


@csrf_exempt
@login_required
def delete_goal(request, goal_id):
    """Удаление цели"""
    if request.method == "POST":
        goal = get_object_or_404(Goal, id=goal_id, user=request.user)
        goal.delete()
        return JsonResponse({"status": "ok"})
    return JsonResponse({"status": "error", "message": "Метод не поддерживается"}, status=400)


# ================== Доп. действия ==================

@csrf_exempt
@login_required
def complete_goal(request, goal_id):
    """Отметить цель как выполненную"""
    if request.method == "POST":
        goal = get_object_or_404(Goal, id=goal_id, user=request.user)
        goal.status = "completed"
        goal.save()
        return JsonResponse({"status": "ok", "id": goal.id, "new_status": goal.status})
    return JsonResponse({"status": "error", "message": "Метод не поддерживается"}, status=400)


# ================== API ==================

@login_required
def goals_api(request):
    """API для FullCalendar — отдаёт цели в формате JSON"""
    goals = Goal.objects.filter(user=request.user)
    events = [
        {
            "id": g.id,
            "title": g.title,
            "start": g.datetime.isoformat(),
            "description": g.description or "",
            "status": g.status
        }
        for g in goals
    ]
    return JsonResponse(events, safe=False)
