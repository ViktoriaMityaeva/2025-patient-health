from rest_framework import serializers
from .models import *
from users.serializers import *

class RehabSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(source='patient.user.fullname', read_only=True)
    doctor_fullname = serializers.SerializerMethodField()

    class Meta:
        model = Rehab
        fields = '__all__'
        extra_fields = ['fullname', 'doctor_fullname']

    def get_doctor_fullname(self, obj):
        if obj.doctors:
            return obj.doctors.all()[0].user.fullname

class RehabMedicationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = RehabMedicationRecord
        fields = '__all__'  # Или укажите конкретные поля, которые хотите включить

class RehabMedicationSerializer(serializers.ModelSerializer):
    logs = RehabMedicationRecordSerializer(many=True, read_only=True)  # Включаем записи о приеме лекарства

    class Meta:
        model = RehabMedication
        fields = '__all__'  # Или укажите конкретные поля, которые хотите включить

class RehabMedicationSerializer(serializers.ModelSerializer):
    logs = RehabMedicationRecordSerializer(many=True, read_only=True)
    class Meta:
        model = RehabMedication
        fields = '__all__'


class RehabMedicationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RehabMedicationTemplate
        fields = '__all__'

class MeasureDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasureDevice
        fields = '__all__'

class PatientDeviceSerializer(serializers.ModelSerializer):
    device = MeasureDeviceSerializer(read_only=True)  # Используйте 
    class Meta:
        model = PatientDevice
        fields = '__all__'
        extra_fields = ['device']

class PatientMeasureRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientMeasureRecord
        fields = '__all__'

class DangerousMeasureSerializer(serializers.ModelSerializer):
    patien = PatientSerializer(many=False, read_only=True)    
    class Meta:
        model = DangerousMeasure
        fields = '__all__'

class PatientMeasureSerializer(serializers.ModelSerializer):
    records = PatientMeasureRecordSerializer(many=True, read_only=True)
    class Meta:
        model = PatientMeasure
        fields = '__all__'

class RehabFullSerializer(serializers.ModelSerializer):
    doctors = DoctorSerializer(many=True, read_only=True)  # Используем новый сериализатор для врачей
    patient = PatientSerializer(many=False, read_only=True)
    medications = RehabMedicationSerializer(many=True, read_only=True)  # Включаем лекарства
    measurements = PatientMeasureSerializer(many=True, read_only=True)


    class Meta:
        model = Rehab
        fields = '__all__'  # Или укажите конкретные поля, которые хотите включить

class PatientProfileSerializer(serializers.ModelSerializer):
    patient_devices = PatientDeviceSerializer(many=True, read_only=True)  # Включите устройства пациента
    user = UserSerializer(read_only=True)
    class Meta:
        model = Patient
        fields = '__all__'
        extra_fields = ['patient_devices','user']


class QuestionSerializer(serializers.Serializer):
    #data = serializers.CharField()
    question = serializers.CharField()
