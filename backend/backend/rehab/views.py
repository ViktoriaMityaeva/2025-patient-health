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
import os
from gigachat import GigaChat
from users.models import Patient
from rest_framework.permissions import BasePermission


GIGACHAT_API_TOKEN = os.getenv("GIGACHAT_API_TOKEN")  # заменить на реальный токен

class IsAuthenticatedOrTgId(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return True
        tg_id = request.query_params.get('tg_id')
        if tg_id:
            return Patient.objects.filter(tg_id=str(tg_id)).exists()
        return False

class QuestionAnswerView(APIView):
    permission_classes = [IsAuthenticatedOrTgId]
    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user if request.user.is_authenticated else None
            tg_id = request.query_params.get('tg_id')
            if not user or not hasattr(user, 'patient_profile'):
                if tg_id:
                    try:
                        patient = Patient.objects.get(tg_id=str(tg_id))
                        user = patient.user
                    except Patient.DoesNotExist:
                        return Response({'error': 'Пользователь с таким tg_id не найден.'}, status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response({'error': 'Пользователь не найден. Авторизуйтесь или передайте tg_id.'}, status=status.HTTP_403_FORBIDDEN)

            # Только пациенты могут отправлять вопросы
            if not (hasattr(user, 'role') and user.role == 'patient' and hasattr(user, 'patient_profile')):
                return Response({'error': 'Только пациенты могут задавать вопросы.'}, status=status.HTTP_403_FORBIDDEN)

            rehabs = Rehab.objects.filter(patient=user.patient_profile)
            user_data = RehabFullSerializer(rehabs, many=True).data

            # Оставляем только последние 20 records/logs в measurements и medications
            for rehab in user_data:
                if 'measurements' in rehab:
                    for m in rehab['measurements']:
                        if 'records' in m and isinstance(m['records'], list):
                            m['records'] = sorted(m['records'], key=lambda r: r.get('recorded_at', ''), reverse=True)[:10]
                if 'medications' in rehab:
                    for med in rehab['medications']:
                        if 'logs' in med and isinstance(med['logs'], list):
                            med['logs'] = sorted(med['logs'], key=lambda l: l.get('created_at', ''), reverse=True)[:10]

            # Вопрос пользователя
            user_question = serializer.validated_data['question']

            # Формируем prompt с инструкцией
            system_prompt = "Ты DR.AI. Ты медицинский ассистент. Твоя задача отвечать на вопросы пользователя, используя данные о его реабилитации, которые представлены в формате json. Используй только предоставленный контекст. Не придумывай информацию. Будь добрым и вежливым. Отвечай только текстом без форматирования."
            context = f"Контекст: {user_data}"
            prompt = f"{system_prompt}\n\n{context}\n\nВопрос: {user_question}\nОтветь максимально подробно."

            last_exception = None
            for attempt in range(5):
                try:
                    giga = GigaChat(
                        credentials=GIGACHAT_API_TOKEN,
                        scope="GIGACHAT_API_PERS",
                        model="GigaChat-Max",
                        verify_ssl_certs=False
                    )
                    # Отправка запроса
                    response = giga.chat(prompt)
                    # Ответ от модели
                    answer = response.choices[0].message.content
                    return Response({'answer': answer, 'alldata': user_data}, status=status.HTTP_200_OK)
                except Exception as e:
                    last_exception = e
            return Response({'error': f'Ошибка обращения к GigaChat SDK после 5 попыток: {str(last_exception)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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