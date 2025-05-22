from rest_framework import viewsets
from .models import Rehab
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from .filters import *
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import action
from django_filters import rest_framework as filters
from rest_framework import filters as drf_filters
from drf_yasg import openapi
from rest_framework.response import Response
from rest_framework import status
import torch
from transformers import pipeline
from rest_framework.views import APIView


# Убедитесь, что модель загружается на CPU
device = -1  # -1 означает использование CPU
qa_pipeline = pipeline("question-answering", model="DeepPavlov/rubert-base-cased", device=device)

class QuestionAnswerView(APIView):
    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            rahabs = Rehab.objects.all()
            user_data = str(RehabFullSerializer(rahabs, many=True).data)

            user_question = serializer.validated_data['question']

            # Использование модели для получения ответа
            result = qa_pipeline(question=user_question, context=user_data)
            answer = result['answer']

            return Response({'answer': answer}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RehabMedicationViewSet(viewsets.ModelViewSet):
    queryset = RehabMedication.objects.all()
    serializer_class = RehabMedicationSerializer
    filter_backends = (filters.DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter)

class RehabMedicationRecordViewSet(viewsets.ModelViewSet):
    queryset = RehabMedicationRecord.objects.all()
    serializer_class = RehabMedicationRecordSerializer
    filter_backends = (filters.DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter)

class PatientMeasureViewSet(viewsets.ModelViewSet):
    queryset = PatientMeasure.objects.all()
    serializer_class = PatientMeasureSerializer
    filter_backends = (filters.DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter)

class RehabMedicationTemplateViewSet(viewsets.ModelViewSet):
    queryset = RehabMedicationTemplate.objects.all()
    serializer_class = RehabMedicationTemplateSerializer
    filter_backends = (filters.DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter)

class MeasureDeviceViewSet(viewsets.ModelViewSet):
    queryset = MeasureDevice.objects.all()
    serializer_class = MeasureDeviceSerializer
    filter_backends = (filters.DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter)

class PatientDeviceViewSet(viewsets.ModelViewSet):
    queryset = PatientDevice.objects.all()
    serializer_class = PatientDeviceSerializer
    filter_backends = (filters.DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter)

class PatientMeasureRecordViewSet(viewsets.ModelViewSet):
    queryset = PatientMeasureRecord.objects.all()
    serializer_class = PatientMeasureRecordSerializer
    filter_backends = (filters.DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter)

class DangerousMeasureViewSet(viewsets.ModelViewSet):
    queryset = DangerousMeasure.objects.all()
    serializer_class = DangerousMeasureSerializer
    filter_backends = (filters.DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter)

class RehabViewSet(viewsets.ModelViewSet):
    queryset = Rehab.objects.all()
    serializer_class = RehabSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter)
    ordering_fields = ['created_at']
    search_fields = ['name', 'description'] 

    def get_queryset(self):
        user = self.request.user  # Получаем аутентифицированного пользователя
        if user.is_staff:
            return Rehab.objects.all()
        if user.role == 'doctor':
            # Если пользователь - врач, возвращаем только реабилитационные программы, с которыми он связан
            return Rehab.objects.filter(doctors = user.doctor_profile)
        elif user.role == 'patient':
            # Если пользователь - пациент, возвращаем только реабилитационные программы, с которыми он связан
            return Rehab.objects.filter(patient=user.patient_profile)
        else:
            # Если роль пользователя не распознана, возвращаем пустой queryset или обрабатываем это другим образом
            return Rehab.objects.all()

    fields = {
        'uid': ['exact'],
        'name': ['exact', 'icontains'],
        'is_active': ['exact'],
        'created_at': ['exact', 'gte', 'lte'],
        'cost': ['gte', 'lte'],
        'duration': ['gte', 'lte'],
        'doctors': ['exact'],
        'patients': ['exact'],
    }

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()  # Получаем объект Rehab
        user = request.user  # Получаем аутентифицированного пользователя

        # Для других ролей возвращаем стандартный ответ
        serializer = RehabFullSerializer(instance)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Получить активную программу реабилитации для пользователя",
        responses={
            200: RehabSerializer,
            404: openapi.Response("У вас нет активной программы реабилитации."),
            403: openapi.Response("Роль пользователя не распознана.")
        }
    )
    @action(detail=False, methods=['get'], url_path='my-rehab')
    def my_rehab(self, request):
        user = request.user
        if user.role == 'patient':
            rehab = Rehab.objects.filter(patient=user.patient_profile, is_active=True).first()
            if rehab:
                serializer = RehabFullSerializer(rehab)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "У вас нет активной программы реабилитации."}, status=status.HTTP_404_NOT_FOUND)
        elif user.role == 'doctor':
            rehab = Rehab.objects.filter(doctors=user.doctor_profile, is_active=True).first()
            if rehab:
                serializer = RehabFullSerializer(rehab)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "У вас нет активных программ реабилитации."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"message": "Роль пользователя не распознана."}, status=status.HTTP_403_FORBIDDEN)