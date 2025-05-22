from django.contrib import admin
from .models import *
from django.utils.translation import gettext_lazy as _

class DrAiSite(admin.AdminSite):
    site_header = _("Админка Dr. Ai")
    site_title = _("Админка Dr. Ai")
    index_title = _("Добро пожаловать в Админку Dr. Ai")

admin_site = DrAiSite(name='myadmin')

@admin.register(Rehab)
class RehabAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at', 'is_active')
    search_fields = ('name',)
    list_filter = ('is_active', 'created_at', 'end_date')

@admin.register(RehabMedicationTemplate)
class RehabMedicationTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'dosage', 'duration', 'periodicity')
    search_fields = ('name',)
    list_filter = ('periodicity',)

@admin.register(RehabMedication)
class RehabMedicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'dosage', 'duration', 'start_date', 'rehab')
    search_fields = ('name',)
    list_filter = ('rehab', 'periodicity')

@admin.register(RehabMedicationRecord)
class RehabMedicationRecordAdmin(admin.ModelAdmin):
    list_display = ('medication', 'date', 'taken')
    search_fields = ('medication__name',)
    list_filter = ('taken',)

@admin.register(MeasureDevice)
class MeasureDeviceAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(PatientDevice)
class PatientDeviceAdmin(admin.ModelAdmin):
    list_display = ('device', 'patient')
    search_fields = ('device__name', 'patient__name')

@admin.register(PatientMeasure)
class PatientMeasureAdmin(admin.ModelAdmin):
    list_display = ('measurement_type', 'device', 'rehab')
    search_fields = ('measurement_type',)
    list_filter = ('rehab',)

@admin.register(PatientMeasureRecord)
class PatientMeasureRecordAdmin(admin.ModelAdmin):
    list_display = ('patient_measure', 'recorded_at', 'value', 'is_crytical')
    search_fields = ('patient_measure__measurement_type',)
    list_filter = ('is_crytical',)

@admin.register(DangerousMeasure)
class DangerousMeasureAdmin(admin.ModelAdmin):
    list_display = ('message', 'patien', 'measure', 'dateTime', 'readed')
    search_fields = ('message', 'patien__name')  # Предполагается, что у модели Patient есть поле name
    list_filter = ('readed', 'dateTime')
    ordering = ('-dateTime',)  # Сортировка по дате, от новых к старым