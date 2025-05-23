# Dr. AI - это интеллектуальная система взаимодействия доктора с пациентом

##Структура проекта
```
.
├── backend Бэкенд + МЛ Часть
│   ├── .env
│   ├── Dockerfile
│   └── ...
├── certs Сертификаты
├── frontend Фронтовая часть
│   ├── build
│   └── assets
├── nginx Веб сервер
│   └── default.conf
├── postgres_data БД
└── tgbot Сервис для тг бота
    ├── Dockerfile
    └── bot.py
```
## Запуск проекта
Клонируйте репозиторий:
```bash
git clone <URL_репозитория>
cd <имя_папки_репозитория>
```

Настройте переменные окружения: Убедитесь, что файл backend/.env содержит все необходимые переменные.
```
DJANGO_ALLOWED_HOSTS=localhost
DJANGO_SECRET_KEY=123123321231321231
DJANGO_DEBUG=False
DJANGO_CORS_ALLOWED_ORIGINS=http://localhost
DJANGO_CORS_ORIGIN_WHITELIST=http://localhost
DJANGO_CSRF_TRUSTED_ORIGINS=http://localhost
POSTGRES_DB=root
POSTGRES_USER=root
POSTGRES_PASSWORD=root
TGBOT_TOKEN=qwerty
TGBOT_DOMAIN=localhost
TGBOT_PROTOCOL=http
GIGACHAT_API_TOKEN=qwerty
```

## Запустите Docker Compose: В корневой директории проекта выполните команду:
```bash
docker-compose up --build
```
## Выполняем первичные миграции:
```bash
docker exec --it <айди контейнераdaphne> /bin/bash
cd backend
python manage.py migrate
python manage.py createsuperuser
Опционально:
python gen_users.py
python gen_rehabs.py
```

Эта команда соберет образы и запустит все сервисы.

## Доступ к приложению: После успешного запуска,  приложение будет доступно по адресу:
```
HTTP: http://domain
HTTPS: https://domain
```

## Описание сервисов
- nginx: Обрабатывает HTTP(S) запросы и проксирует их к Daphne.
- redis: Используется для кэширования и управления очередями задач.
- daphne: ASGI-сервер для обработки запросов к Django-приложению.
- db: PostgreSQL база данных для хранения данных приложения.
- tgbot: Telegram-бот, который взаимодействует с пользователями.
- celery: Рабочий процесс для выполнения фоновых задач.
- celery-beat: Планировщик задач для Celery.

## Остановка проекта

Чтобы остановить все сервисы, выполните:

```bash
docker-compose down
```

## Примечания
Убедитесь, что порты 80 и 443 не заняты другими приложениями на вашем хосте.    
Для работы с HTTPS необходимо правильно настроить сертификаты в папке certs.    