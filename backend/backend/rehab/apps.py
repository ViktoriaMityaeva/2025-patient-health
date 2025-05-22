from django.apps import AppConfig


class RehabConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'rehab'
    def ready(self):
        import rehab.signals  # Замените на имя вашего приложения