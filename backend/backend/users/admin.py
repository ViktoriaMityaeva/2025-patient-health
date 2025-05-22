from django.contrib import admin
from .models import User, Patient, Doctor

class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name', 'username')
    ordering = ('email',)
    readonly_fields = ('uid',)  # Сделать uid только для чтения

    fieldsets = (
        (None, {
            'fields': ('email', 'password', 'uid')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'patronymic', 'role')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important Dates', {
            'fields': ('last_login',)
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'patronymic', 'role', 'is_active', 'is_staff', 'is_superuser')}
        ),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.order_by('email')  # Сортировка по email

admin.site.register(User, UserAdmin)

class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'tg_id', 'is_auth_in_tg')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    list_filter = ('is_auth_in_tg',)

admin.site.register(Patient, PatientAdmin)

class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'specialization')

admin.site.register(Doctor, DoctorAdmin)
