from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'rehabs', RehabViewSet)
router.register(r'medications', RehabMedicationViewSet)
router.register(r'medication-records', RehabMedicationRecordViewSet)
router.register(r'patient-measures', PatientMeasureViewSet)
router.register(r'patient-medication-template', RehabMedicationTemplateViewSet)
router.register(r'patient-measures-records', PatientMeasureRecordViewSet)
router.register(r'patient-devices', PatientDeviceViewSet)
router.register(r'measure-devices', MeasureDeviceViewSet)
router.register(r'dangerous-measures', DangerousMeasureViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('ask/', QuestionAnswerView.as_view(), name='ask_question'),
]
