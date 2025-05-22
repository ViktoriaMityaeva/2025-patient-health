# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

@receiver(post_save, sender=RehabMedication)
def create_medication_records(sender, instance, created, **kwargs):
    if created and instance.duration and instance.times and instance.start_date:
        start_date = instance.start_date  # Используем дату начала из модели
        for day in range(instance.duration):
            for time in instance.times:
                # Создаем дату и время приема
                record_date = start_date + timedelta(days=day)
                hour, minute = map(int, time.split(':'))
                
                # Создаем объект datetime с нужной датой и временем
                record_datetime = datetime.combine(record_date, datetime.min.time()).replace(hour=hour, minute=minute)

                # Создаем запись о приеме лекарства
                RehabMedicationRecord.objects.create(
                    medication=instance,
                    date=record_datetime,
                    taken=False,  # По умолчанию не принято
                    is_notify_tg=False  # По умолчанию уведомление не отправлено
                )

@receiver(post_save, sender=PatientMeasure)
def build_regression_model(sender, instance, created, **kwargs):
    if created:
        # Получаем все показатели для текущей реабилитации
        measurements = PatientMeasure.objects.filter(rehab=instance.rehab)

        # Преобразуем данные в DataFrame
        data = {
            'value': [m.value for m in measurements],
            'recorded_at': [m.recorded_at.timestamp() for m in measurements]  # Преобразуем время в timestamp
        }
        df = pd.DataFrame(data)

        # Проверяем, достаточно ли данных для обучения модели
        if len(df) < 2:
            return  # Не хватает данных для построения модели

        # Обучаем регрессионную модель
        X = df[['recorded_at']]  # Используем время как признак
        y = df['value']  # Значение показателя

        model = LinearRegression()
        model.fit(X, y)

        # Здесь сохраняем модель для предсказаний Выключена в целях экономии нагрузки
        # import joblib
        # joblib.dump(model, 'regression_model.pkl')
