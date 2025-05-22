import uuid
from django.db import models
from users.models import *
import datetime

class Rehab(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="Уникальный идентификатор программы реабилитации")
    name = models.CharField(max_length=128, null=True, blank=True, help_text="Название программы реабилитации")
    description = models.TextField(null=True, blank=True, help_text="Подробное описание программы реабилитации")
    created_at = models.DateTimeField(auto_now_add=True, help_text="Дата и время создания записи")
    updated_at = models.DateTimeField(auto_now=True, help_text="Дата и время последнего обновления записи")
    end_date = models.DateTimeField(null=True, blank=True, help_text="Дата завершения программы реабилитации")
    duration = models.PositiveIntegerField(null=True, default=0, blank=True, help_text="Продолжительность программы реабилитации в днях")
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True, help_text="Стоимость программы реабилитации в рублях")
    is_active = models.BooleanField(default=True, help_text="Активна ли программа реабилитации")

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        help_text="Пациент, которому принадлежит программа реабилитации",
        related_name="user_programs",
        related_query_name="user_program",
        verbose_name="Пациент",
        null=True,
        blank=True,
        default=None,
        #limit_choices_to={'role': 'patient'},
    )
    doctors =  models.ManyToManyField(
        Doctor,
        help_text="Врачи, которые ведут программу реабилитации",
        related_name="doctor_programs",
        related_query_name="doctor_program",
        verbose_name="Врачи",
        blank=True, 
        #limit_choices_to={'role': 'doctor'},
    )

    class Meta:
        ordering = ['created_at']
        verbose_name = "Программа реабилитации"
        verbose_name_plural = "Программы реабилитации"

    def __str__(self):
        return self.name


class RehabMedicationTemplate(models.Model):
    PERIODICITY_CHOICES = [
        ('daily', 'Каждый день'),
        ('weekly', 'Каждую неделю'),
        ('monthly', 'Каждый месяц'),
    ]
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="Уникальный идентификатор шаблона лекарства")
    name = models.CharField(max_length=128, help_text="Название лекарства")
    dosage = models.CharField(max_length=128, help_text="Дозировка лекарства", blank= True, null=True)
    duration = models.PositiveIntegerField(help_text="Продолжительность применения лекарства в днях", blank= True, null=True)
    instructions = models.TextField(help_text="Инструкции по применению лекарства", blank= True, null=True)
    times = models.JSONField(help_text="Время приема лекарства", blank= True, null=True, default = list)
    comment = models.TextField(help_text="Комментарии к лекарству", blank= True, null=True)
    periodicity = models.CharField(max_length=10, choices=PERIODICITY_CHOICES, help_text="Периодичность приема лекарства", default='daily')
    class Meta:
        verbose_name = "Шаблон лекарства"
        verbose_name_plural = "Шаблоны лекарств"

    def __str__(self):
        return self.name

class RehabMedication(models.Model):
    PERIODICITY_CHOICES = [
        ('daily', 'Каждый день'),
        ('weekly', 'Каждую неделю'),
        ('monthly', 'Каждый месяц'),
    ]
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="Уникальный идентификатор лекарства")
    name = models.CharField(max_length=128, help_text="Название лекарства")
    dosage = models.CharField(max_length=128, help_text="Дозировка лекарства", blank= True, null=True)
    duration = models.PositiveIntegerField(help_text="Продолжительность применения лекарства в днях", blank= True, null=True)
    instructions = models.TextField(help_text="Инструкции по применению лекарства", blank= True, null=True)
    times = models.JSONField(help_text="Время приема лекарства", blank= True, null=True, default = list)
    comment = models.TextField(help_text="Комментарии к лекарству", blank= True, null=True)
    start_date = models.DateField(help_text="Дата начала применения лекарства", default = datetime.date.today , blank= True, null=True)
    rehab = models.ForeignKey(Rehab, on_delete=models.CASCADE, related_name="medications", help_text="Программа реабилитации, к которой относится лекарство")
    periodicity = models.CharField(max_length=10, choices=PERIODICITY_CHOICES, help_text="Периодичность приема лекарства", default='daily')
    class Meta:
        verbose_name = "Лекарство"
        verbose_name_plural = "Лекарства"

    def __str__(self):
        return self.name

class RehabMedicationRecord(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="Уникальный идентификатор записи о приеме лекарства")
    medication = models.ForeignKey(RehabMedication, on_delete=models.CASCADE, related_name="logs", help_text="Назначенное лекарство")
    date= models.DateTimeField(help_text="Дата приема лекарства")
    taken = models.BooleanField(default=False, help_text="Принято ли лекарство")
    is_notify_tg = models.BooleanField(default=False, help_text="Отправлено ли уведомление о приеме лекарства")

    class Meta:
        verbose_name = "Запись о приеме лекарства"
        verbose_name_plural = "Записи о приеме лекарств"

    def __str__(self):
        return f"{self.medication.name} - {self.date} - {'Принято' if self.taken else 'Не принято'}"


class MeasureDevice(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="Уникальный идентификатор устроиства")
    name = models.CharField(max_length=128, help_text="Название устроиства")
    description = models.TextField(help_text="Описание устроиства")
    settings = models.JSONField(help_text="Настройки устроиства", default = dict, blank=True, null=True)
    ai_settings = models.JSONField(help_text="Настройки для распознавания", default = dict, blank=True, null=True)
    photo = models.ImageField(upload_to='devices/', null=True, blank=True, help_text="Фотография устроиства")
    inventory_number = models.CharField(max_length=128, help_text="Инвентарный номер устроиства", blank=True, null=True)
    class Meta:
        verbose_name = "Устроиство"
        verbose_name_plural = "Устроиства"

    def __str__(self):
        return self.name

class PatientDevice(models.Model):
    device = models.ForeignKey(MeasureDevice, on_delete=models.CASCADE, related_name="patient_devices", help_text="Устройство")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="patient_devices", help_text="Пациент")

    class Meta:
        verbose_name = "Устройство пациента"
        verbose_name_plural = "Устройства пациентов"

class PatientMeasure(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="Уникальный идентификатор показателя")
    device = models.ForeignKey(PatientDevice, on_delete=models.CASCADE, related_name="measurements", help_text="Устройство", blank=True, null=True)
    measurement_type = models.CharField(max_length=128, help_text="Тип измеряемого показателя (например, температура, давление)")
    rehab = models.ForeignKey(Rehab, on_delete=models.CASCADE, related_name="measurements", help_text="Программа реабилитации, к которой относится показатель")
    class Meta:
        verbose_name = "Показатель пациента"
        verbose_name_plural = "Показатели пациентов"


class PatientMeasureRecord(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="Уникальный идентификатор записи о показателе")
    patient_measure = models.ForeignKey(PatientMeasure, on_delete=models.CASCADE, related_name="records", help_text="Показатель")
    recorded_at = models.DateTimeField(auto_now_add=True, help_text="Дата и время записи показателя")
    value = models.CharField(max_length=128, help_text="Значение показателя", blank=True, null=True)
    photo = models.ImageField(upload_to='measurements/', null=True, blank=True, help_text="Фотография показателя")
    file = models.FileField(upload_to='measurements/', null=True, blank=True, help_text="Файл показателя")
    ai_data = models.JSONField(null=True, blank=True, help_text="Данные для распознавания показателя", default = dict)
    is_crytical = models.BooleanField(default=False, help_text="Критический ли показатель")
    patient_comment = models.TextField(help_text="Комментарии к показателю", blank= True, null=True)
    ai_comment = models.TextField(help_text="Комментарии к распознаванию показателя", blank= True, null=True)

    class Meta:
        verbose_name = "Запись о показателе пациента"
        verbose_name_plural = "Записи о показателях пациентов"

class DangerousMeasure(models.Model):
    message = models.TextField(help_text="Сообщение")
    patien = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="dangerous_measures", help_text="Пациент")
    measure = models.ForeignKey(PatientMeasureRecord, on_delete=models.CASCADE, related_name="dangerous_measures", help_text="Показатель", blank=True, null=True)
    dateTime = models.DateTimeField(auto_now_add=True, help_text="Дата и время")
    readed = models.BooleanField(default=False, help_text="Прочитано ли")

    class Meta:
        verbose_name = "Опасный показатель"
        verbose_name_plural = "Опасные показатели"