from django.shortcuts import render, redirect

def welcome(request):
    # Просто рендерим страницу приветствия без редиректа
    return render(request, 'welcome.html')