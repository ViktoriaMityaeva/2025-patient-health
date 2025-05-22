import os
import django
import random
from faker import Faker
import random

diagnoses = [
    "Артрит",
    "Гипертония",
    "Диабет 2 типа",
    "Ишемическая болезнь сердца",
    "Хронический бронхит",
    "Остеоартрит",
    "Депрессия",
    "Астма",
    "Инсульт",
    "Аллергический ринит",
    "Гастрит",
    "Пневмония",
    "Сахарный диабет 1 типа",
    "Эпилепсия",
    "Хроническая усталость",
    "Синдром раздраженного кишечника",
    "Гипотиреоз",
    "Псориаз",
    "Ожирение",
    "Тревожное расстройство",
    "Бронхиальная астма",
    "Ревматоидный артрит",
    "Синдром хронической боли",
    "Инфаркт миокарда",
    "Гепатит",
    "Тромбофлебит",
    "Мигрень",
    "Кожный дерматит",
    "Сахарный диабет",
    "Остеопороз"
]

# Убедитесь, что Django настроен
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import *  # Замените на имя вашего приложения
from rehab.models import *
fake = Faker('ru_RU')


def create_rehabs():
    patients = Patient.objects.all()
    doctors = Doctor.objects.all()
    for patient in patients:
        random_diagnosis = random.choice(diagnoses)
        selected_doctors = random.sample(list(doctors), k=random.randint(1, 2))
        description = f'Подозрение на {random_diagnosis}'
        r = Rehab.objects.create(
            name = random_diagnosis,
            description = f'Подозрение на {random_diagnosis}',
            cost=random.randint(0, 1000),
            duration=random.randint(1, 3),
            is_active = True,
            patient = patient,
        )
        r.doctors.set(selected_doctors)

if __name__ == '__main__':
    create_rehabs()

