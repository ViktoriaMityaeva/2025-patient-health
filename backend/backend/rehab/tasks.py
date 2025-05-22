from celery import shared_task
from rehab.models import *
import requests
from datetime import datetime
from os import getenv
import json

@shared_task
def send_medication_reminders():
    now = datetime.now()
    current_date = now.date()  # Получаем текущую дату
    current_time = now.strftime('%H:%M')  # Получаем текущее время в формате ЧЧ:ММ
    current_hour = now.hour
    current_minute = now.minute


    token = getenv('TGBOT_TOKEN')
    # Фильтруем записи, которые не были приняты, соответствуют текущей дате и времени
    records = RehabMedicationRecord.objects.filter(taken=False, is_notify_tg= False, date__date=current_date, date__hour=current_hour)

    for record in records:

        print('found')

        # Логика для отправки уведомления с кнопкой
        message = f"Напоминание: Примите {record.medication.name} в {record.date.strftime('%H:%M')}."
        chat_id = record.medication.rehab.patient.tg_id

        # Создаем клавиатуру
        keyboard = {
            "inline_keyboard": [[
                {"text": "Принял 👍", "callback_data": f"medication_{record.uid}"}
            ]]
        }

        requests.post(f'https://api.telegram.org/bot{token}/sendMessage', data={
            'chat_id': chat_id,
            'text': message,
            'reply_markup': json.dumps(keyboard),
            'parse_mode': 'HTML'
        })
        print('sended')

        record.is_notify_tg = True
        record.save()
