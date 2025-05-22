# myproject/celery.py
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Настройка периодических задач
app.conf.beat_schedule = {
    'send-medication-reminders': {
        'task': 'rehab.tasks.send_medication_reminders',
        'schedule': crontab(minute='*/1'),  # Каждую минуту (для тестирования)
    },
}
