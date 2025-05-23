# Generated by Django 5.1.3 on 2024-11-17 03:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rehab', '0005_rehabmedication_times'),
    ]

    operations = [
        migrations.AddField(
            model_name='rehabmedication',
            name='periodicity',
            field=models.CharField(choices=[('daily', 'Каждый день'), ('weekly', 'Каждую неделю'), ('monthly', 'Каждый месяц')], default='daily', help_text='Периодичность приема лекарства', max_length=10),
        ),
    ]
