from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from rest_framework.authtoken.models import Token
import uuid

from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # Уникальный идентификатор как PK
    email = models.EmailField(unique=True)
    objects = CustomUserManager()  # Установите кастомный менеджер

    ROLE_CHOICES = (
        ('patient', 'Пациент'),
        ('doctor', 'Врач'),
    )
    
    first_name = models.CharField(max_length=30)  # Имя
    last_name = models.CharField(max_length=30)   # Фамилия
    patronymic = models.CharField(max_length=30, blank=True)  # Отчество (необязательное поле)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='patient')
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    @property
    def fullname(self):
        return f"{self.first_name} {self.last_name}"

    USERNAME_FIELD = 'email'  # email как имя пользователя
    REQUIRED_FIELDS = []

    def __str__(self):
        if self.patronymic:
            return f"{self.first_name} {self.last_name} {self.patronymic}"
        else:
            return f"{self.first_name} {self.last_name}"


class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    tg_id= models.CharField(max_length=50, null=True, blank=True)
    is_auth_in_tg = models.BooleanField(default=False, blank=True)
    def __str__(self):
        return f"Пациент: {self.user.first_name} {self.user.last_name}"

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=100)  # Специализация врача
    # Добавьте другие поля, специфичные для врача

    def __str__(self):
        return f"Доктор: {self.user.first_name} {self.user.last_name}"