from pathlib import Path
from os import getenv
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = getenv('DJANGO_SECRET_KEY')
DEBUG = getenv('DJANGO_DEBUG')
ALLOWED_HOSTS = getenv('DJANGO_ALLOWED_HOSTS')
ALLOWED_HOSTS = ALLOWED_HOSTS.split(',') if ALLOWED_HOSTS else []

CORS_ALLOWED_ORIGINS = getenv('DJANGO_CORS_ALLOWED_ORIGINS')
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS.split(',') if CORS_ALLOWED_ORIGINS else []

CORS_ORIGIN_WHITELIST = getenv('DJANGO_CORS_ORIGIN_WHITELIST')
CORS_ORIGIN_WHITELIST = CORS_ORIGIN_WHITELIST.split(',') if CORS_ORIGIN_WHITELIST else []

CSRF_TRUSTED_ORIGINS = getenv('DJANGO_CSRF_TRUSTED_ORIGINS')
CSRF_TRUSTED_ORIGINS = CSRF_TRUSTED_ORIGINS.split(',') if CSRF_TRUSTED_ORIGINS else []

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


STATIC_URL = '/django-static/'
STATIC_ROOT =  BASE_DIR / 'django-static/'

MEDIA_URL = '/mediacontent/'
MEDIA_ROOT = Path(BASE_DIR, 'api-media-sdn')

REDIS_URL = getenv('REDIS_URL')
CELERY_BROKER_URL = f'redis://{REDIS_URL}:6379/0'  # или другой брокер

WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'

AUTH_USER_MODEL = 'users.User'

INSTALLED_APPS = [
    'corsheaders',
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'users',
    'rehab',
    'chat',
    'rest_framework',
    'django_filters',
    'rest_framework.authtoken',
    'drf_yasg',
    'django_extensions',
]


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny", #AllowAny
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.OrderingFilter',
    ],
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': getenv('POSTGRES_DB'),
        'USER': getenv('POSTGRES_USER'),
        'PASSWORD': getenv('POSTGRES_PASSWORD'),
        'HOST': getenv('POSTGRES_HOST'),
        'PORT': getenv('POSTGRES_PORT'),
    }
}


LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = False

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
