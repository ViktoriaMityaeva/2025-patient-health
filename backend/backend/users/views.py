from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import get_user_model
from rehab.serializers import PatientProfileSerializer
from users.serializers import *
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Patient
from rehab.models import Rehab, RehabMedicationRecord
import uuid
def is_valid_uuid(uid):
    try:
        uuid_obj = uuid.UUID(uid)
        return True
    except ValueError:
        return False

User = get_user_model()
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @swagger_auto_schema(
        operation_description="Регистрация нового пользователя",
        request_body=UserSerializer,
        responses={201: UserSerializer}
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class ObtainAuthToken(APIView):
    @swagger_auto_schema(
        operation_description="Получение токена аутентификации",
        request_body=AuthTokenSerializer,
        responses={200: openapi.Response('Токен', schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={'token': openapi.Schema(type=openapi.TYPE_STRING)}))}
    )
    def post(self, request, *args, **kwargs):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {'token': token.key,
            'role': user.role
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Выход из системы (удаление токена)",
        responses={204: 'Успешно вышли', 400: 'Ошибка при выходе'}
    )
    def post(self, request):
        try:
            token = request.auth
            token.delete()
            return Response('Bye!', status=status.HTTP_204_NO_CONTENT)
        except (AttributeError, Token.DoesNotExist):
            return Response('Bye!', status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получение профиля пользователя",
        responses={200: openapi.Response('Профиль пользователя')}
    )
    def get(self, request):
        user = request.user
        
        if user.role == 'patient':
            serializer = PatientProfileSerializer(user.patient_profile)
        elif user.role == 'doctor':
            serializer = DoctorProfileSerializer(user.doctor_profile)
        else:
            return Response({'detail': 'Role not recognized'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)
    
class TgAuthView(APIView):
    @swagger_auto_schema(
        operation_description="Подтверждения телеграмма",
        responses={200: openapi.Response('UID найден и подтверждён')}
    )
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid')
        if not uid or not is_valid_uuid(uid):
            return Response({'error': 'UID не передан.'}, status=status.HTTP_400_BAD_REQUEST)
        
        tg_id = request.data.get('tg_id')  # Получите UID из запроса
        try:
            user = User.objects.get(uid=uid)
            patient = user.patient_profile
            if not patient.is_auth_in_tg:
                patient.tg_id = tg_id
                patient.is_auth_in_tg = True
                patient.save()
            return Response({'message': 'Запрос на подтверждение отправлен.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'UID не найден.'}, status=status.HTTP_404_NOT_FOUND)

class checkAuthTg(APIView):
    @swagger_auto_schema(
        operation_description="Подтверждения телеграмма",
        responses={200: openapi.Response('ID найден и подтверждён')}
    )
    def post(self, request, *args, **kwargs):
        tg_id = request.data.get('tg_id')  # Получите UID из запроса
        try:
            try:
                patient = Patient.objects.get(tg_id=tg_id)
            except Patient.DoesNotExist:
                patient = None
            if patient and patient.is_auth_in_tg:
                return Response({'message': 'Пользователь существует'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'error': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)

class TakePill(APIView):
    @swagger_auto_schema(
        operation_description="Подтверждения телеграмма",
        responses={200: openapi.Response('ID findet und best‰tigt')}
    )
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid')
        try:
            patient = RehabMedicationRecord.objects.get(uid=uid)
            if patient:
                patient.is_taken = True
                patient.save()
            return Response({'message': 'Пользователь принял таблетку'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)