import os
import django
import random
from faker import Faker

# Убедитесь, что Django настроен
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

popular_specializations = [
    "Терапевт",
    "Хирург",
    "Кардиолог",
    "Педиатр",
    "Офтальмолог",
    "Дерматолог",
    "Невролог",
    "Гинеколог",
    "Эндокринолог",
    "Ортопед",
    "Психиатр",
    "Стоматолог",
    "Ревматолог",
    "Уролог",
    "Анестезиолог",
]

from users.models import *  # Замените на имя вашего приложения
from rehab.models import *
fake = Faker('ru_RU')

def create_users():
    # Генерация 5 врачей
    for i in range(5):
        user = User.objects.create_user(
            email=f"{i}@doctor.ru",
            password=f"{i}@doctor.ru",  # Установите пароль по умолчанию
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            patronymic=fake.first_name_male(),  # Можно использовать случайное имя для отчества
            role='doctor',
            username=fake.unique.user_name(),
        )
        Doctor.objects.create(user=user, specialization=random.choice(popular_specializations))
        print(f'Created doctor: {user.email}')

    # Генерация 15 пациентов
    for i in range(15):
        user = User.objects.create_user(
            email=f"{i}@patient.ru",
            password=f"{i}@patient.ru",  # Установите пароль по умолчанию
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            patronymic=fake.first_name_male(),  # Можно использовать случайное имя для отчества
            role='patient',
            username=fake.unique.user_name(),
        )
        Patient.objects.create(user=user,is_auth_in_tg=False)
        print(f'Created patient: {user.email}')


if __name__ == '__main__':
    create_users()

