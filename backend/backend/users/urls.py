from django.urls import path
from .views import *

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', ObtainAuthToken.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('authtg/', TgAuthView.as_view(), name='authtg'),
    path('checkauthtg/', checkAuthTg.as_view(), name='checkauthtg'),
    path('takepill/', TakePill.as_view(), name='takepill'),
    path('profile/', UserProfileView.as_view(), name='profile'),
]