from django.urls import path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    # Цели пользователя
    path('goals/', views.goals_list, name='api_goals_list'),
    path('goals/create/', views.create_goal, name='api_goal_create'),
    path('goals/<int:goal_id>/', views.goal_detail, name='api_goal_detail'),
    path('goals/<int:goal_id>/update/', views.update_goal, name='api_goal_update'),
    path('goals/<int:goal_id>/delete/', views.delete_goal, name='api_goal_delete'),

    # Админские маршруты
    path('all_goals/', views.all_goals, name='api_all_goals'),
    path('all_users/', views.all_users, name='api_all_users'),

    # Просмотр конкретного пользователя
    path('users/<int:user_id>/', views.user_detail, name='api_user_detail'),

    # HTML-тестер API
    path('test/', TemplateView.as_view(template_name='api_test.html'), name='api_test'),
]
