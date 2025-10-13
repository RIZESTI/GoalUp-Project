from django.urls import path
from . import views

app_name = "planner"

urlpatterns = [
    # Главная с календарём
    path("", views.home, name="home"),

    # Управление целями
    path("goals/", views.goals_list, name="goals_list"),                  # список целей (страница)
    path("add_goal/", views.add_goal, name="add_goal"),                   # создание цели
    path("edit_goal/<int:goal_id>/", views.edit_goal, name="edit_goal"),  # редактирование
    path("delete_goal/<int:goal_id>/", views.delete_goal, name="delete_goal"),  # удаление
    path("api/goals/", views.goals_api, name="goals_api"),
    path("goals/complete/<int:goal_id>/", views.complete_goal, name="complete_goal"),


    # API для FullCalendar
    path("api/goals/", views.goals_api, name="goals_api"),
]
