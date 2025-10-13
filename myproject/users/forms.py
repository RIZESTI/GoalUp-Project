from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import UserProfile
import datetime


class RegisterForm(UserCreationForm):
    avatar = forms.ImageField(required=False)
    bio = forms.CharField(
        widget=forms.Textarea(attrs={
            "rows": 4,
            "style": "resize:none; overflow-y:auto;"
        }),
        required=False
    )

    class Meta:
        model = User
        fields = ["username", "password1", "password2", "avatar", "bio"]

    def save(self, commit=True):
        user = super().save(commit=False)

        if commit:
            user.save()
            profile, created = UserProfile.objects.get_or_create(user=user)
            if self.cleaned_data.get("avatar"):
                profile.avatar = self.cleaned_data["avatar"]
            if self.cleaned_data.get("bio"):
                profile.bio = self.cleaned_data["bio"]
            profile.save()

        return user


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username']  # ✅ оставляем только имя


class UserProfileForm(forms.ModelForm):
    birth_date = forms.DateField(
        required=False,
        widget=forms.SelectDateWidget(
            years=range(datetime.date.today().year, 1900, -1),
            empty_label=("Год", "Месяц", "День")
        )
    )

    class Meta:
        model = UserProfile
        fields = ['avatar', 'bio', 'birth_date']
        widgets = {
            'bio': forms.Textarea(attrs={
                "rows": 4,
                "style": "resize:none; overflow-y:auto;"
            })
        }
