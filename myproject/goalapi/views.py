from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from planner.models import Goal
from .serializers import GoalSerializer
from .authentication import MasterKeyAuth


# ===============================
# 🔹 Просмотр целей
# ===============================

@api_view(['GET'])
@authentication_classes([MasterKeyAuth, SessionAuthentication])
@permission_classes([IsAuthenticated])
def goals_list(request):
    """
    📋 Список всех целей.
    🔒 Авторизация:
        • Через API-ключ (заголовок X-API-KEY или ?api_key=)
        • Через сессию (если пользователь вошёл на сайт)
    🔸 Администратор видит все цели, обычный пользователь — только свои.
    """
    user = request.user

    if user.is_superuser:
        goals = Goal.objects.all().order_by('-datetime')
    else:
        goals = Goal.objects.filter(user=user).order_by('-datetime')

    serializer = GoalSerializer(goals, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ===============================
# ➕ Создание новой цели
# ===============================

@api_view(['POST'])
@authentication_classes([MasterKeyAuth, SessionAuthentication])
@permission_classes([IsAuthenticated])
def create_goal(request):
    serializer = GoalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===============================
# 🔍 Просмотр конкретной цели
# ===============================

@api_view(['GET'])
@authentication_classes([MasterKeyAuth, SessionAuthentication])
@permission_classes([IsAuthenticated])
def goal_detail(request, goal_id):
    user = request.user

    if user.is_superuser:
        goal = get_object_or_404(Goal, id=goal_id)
    else:
        goal = get_object_or_404(Goal, id=goal_id, user=user)

    serializer = GoalSerializer(goal)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ===============================
# ✏️ Обновление цели
# ===============================

@api_view(['PUT', 'PATCH'])
@authentication_classes([MasterKeyAuth, SessionAuthentication])
@permission_classes([IsAuthenticated])
def update_goal(request, goal_id):
    user = request.user

    if user.is_superuser:
        goal = get_object_or_404(Goal, id=goal_id)
    else:
        goal = get_object_or_404(Goal, id=goal_id, user=user)

    serializer = GoalSerializer(goal, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===============================
# 🗑 Удаление цели
# ===============================

@api_view(['DELETE'])
@authentication_classes([MasterKeyAuth, SessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_goal(request, goal_id):
    user = request.user

    if user.is_superuser:
        goal = get_object_or_404(Goal, id=goal_id)
    else:
        goal = get_object_or_404(Goal, id=goal_id, user=user)

    goal.delete()
    return Response({'detail': 'Цель удалена'}, status=status.HTTP_204_NO_CONTENT)


# ===============================
# 🔸 Админские функции
# ===============================

@api_view(['GET'])
@authentication_classes([MasterKeyAuth, SessionAuthentication])
@permission_classes([IsAuthenticated])
def all_goals(request):
    """📋 Список всех целей — только для администраторов"""
    if not request.user.is_superuser:
        return Response(
            {'error': 'Доступ запрещён: только администраторы'},
            status=status.HTTP_403_FORBIDDEN
        )
    goals = Goal.objects.all().order_by('-datetime')
    serializer = GoalSerializer(goals, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([MasterKeyAuth, SessionAuthentication])
@permission_classes([IsAuthenticated])
def all_users(request):
    """👥 Список всех пользователей — только для администраторов"""
    if not request.user.is_superuser:
        return Response(
            {'error': 'Доступ запрещён: только администраторы'},
            status=status.HTTP_403_FORBIDDEN
        )
    users = User.objects.all().values(
        'id', 'username', 'is_staff', 'is_superuser', 'date_joined'
    )
    return Response(list(users), status=status.HTTP_200_OK)


# ===============================
# 👤 Просмотр конкретного пользователя
# ===============================

@api_view(['GET'])
@authentication_classes([MasterKeyAuth, SessionAuthentication])
@permission_classes([IsAuthenticated])
def user_detail(request, user_id):
    """👤 Просмотр пользователя по ID (админ видит всех)"""
    user = request.user

    if user.is_superuser:
        target_user = get_object_or_404(User, id=user_id)
    else:
        target_user = get_object_or_404(User, id=user.id)

    data = {
        "id": target_user.id,
        "username": target_user.username,
        "is_staff": target_user.is_staff,
        "is_superuser": target_user.is_superuser,
        "date_joined": target_user.date_joined,
    }
    return Response(data, status=status.HTTP_200_OK)
