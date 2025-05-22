from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

admin.site.site_header = 'Dr AI'                    # default: "Django Administration"
admin.site.index_title = 'Dr AI Admin'                 # default: "Site administration"
admin.site.site_title = 'Dr AI Admin' # default: "Django site admin"

schema_view = get_schema_view(
    openapi.Info(
        title="API Сервиса Dr. AI",
        default_version='v1',
        description="API Doctor AI",
        terms_of_service="...",
        url='https://dr-ai.aizavod.com/',  # Убедитесь, что здесь используется HTTPS
        contact=openapi.Contact(email="i@anfranchuk.ru"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/', include('rehab.urls')),
    path('auth-api/', include('users.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
