from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import RegisterForm, UserForm, UserProfileForm


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Аккаунт успешно создан 🎉")
            return redirect("users:profile")
        else:
            messages.error(request, "Ошибка при регистрации. Проверь данные.")
    else:
        form = RegisterForm()
    return render(request, "users/register.html", {"form": form})


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        if username and password:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Добро пожаловать, {user.username} ")
                return redirect("users:profile")
            else:
                messages.error(request, "Неверное имя пользователя или пароль")
        else:
            messages.error(request, "Заполните все поля")

    return render(request, "users/login.html")


def logout_view(request):
    logout(request)
    messages.info(request, "Вы вышли из аккаунта.")
    # ✅ перенаправляем на главную из planner (home.html)
    return redirect("planner:home")


@login_required
def profile(request):
    return render(request, "users/profile.html")


@login_required
def edit_profile(request):
    user_form = UserForm(instance=request.user)
    profile_form = UserProfileForm(instance=request.user.userprofile)

    if request.method == "POST":
        user_form = UserForm(request.POST, instance=request.user)
        profile_form = UserProfileForm(
            request.POST, request.FILES,
            instance=request.user.userprofile
        )

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile = profile_form.save(commit=False)

            # Если нажата кнопка "Удалить фото"
            if request.POST.get("remove_avatar") == "1":
                if profile.avatar:
                    profile.avatar.delete(save=False)  # удаляем файл с диска
                profile.avatar = None  # очищаем поле в БД

            profile.save()
            messages.success(request, "Профиль обновлён ✅")
            return redirect("users:profile")
        else:
            messages.error(request, "Ошибка при обновлении профиля")

    return render(request, "users/edit_profile.html", {
        "user_form": user_form,
        "profile_form": profile_form,
    })
