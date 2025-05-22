from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from users.models import Patient, Doctor
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    specialization = serializers.CharField(required=False)  # Для доктора
    tg_id = serializers.CharField(required=False)  # Для пациента
    is_auth_in_tg = serializers.BooleanField(required=False)  # Для пациента


    class Meta:
        model = User
        fields = ['uid', 'email', 'first_name', 'last_name', 'patronymic', 'role', 'username', 'specialization', 'tg_id', 'is_auth_in_tg']
    def create(self, validated_data):
        tg_id = validated_data.pop('tg_id', None)
        is_auth_in_tg = validated_data.pop('is_auth_in_tg', False)
        specialization = validated_data.pop('specialization', None)
        user = super().create(validated_data)

        if user.role == 'doctor':
            Doctor.objects.create(user=user, specialization=specialization)
        elif user.role == 'patient':
            Patient.objects.create(user=user, tg_id=tg_id, is_auth_in_tg=is_auth_in_tg)

        return user

class AuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(request=self.context.get('request'), email=email, password=password)
        if user is None:
            raise serializers.ValidationError('Неверные учетные данные.')
        attrs['user'] = user
        return attrs



class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Doctor
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True},
        }

class PatientSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(source='user.fullname', read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'fullname', 'tg_id', 'is_auth_in_tg']


class DoctorSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(source='user.fullname', read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'fullname', 'specialization']