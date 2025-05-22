from django.test import TestCase
from users.models import User  # Замените на имя вашего приложения
from faker import Faker

class UserCreationTests(TestCase):
    def setUp(self):
        self.fake = Faker()

    def create_user(self, role):
        return User.objects.create_user(
            email=self.fake.unique.email(),
            password='password123',
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            patronymic=self.fake.first_name_male(),
            role=role,
            username=self.fake.unique.user_name()
        )

    def test_create_doctors(self):
        for _ in range(5):
            user = self.create_user(role='doctor')
            self.assertEqual(user.role, 'doctor')
            self.assertTrue(User.objects.filter(email=user.email).exists())

    def test_create_patients(self):
        for _ in range(15):
            user = self.create_user(role='patient')
            self.assertEqual(user.role, 'patient')
            self.assertTrue(User.objects.filter(email=user.email).exists())

