from django_filters import rest_framework as filters
from .models import Rehab

class RehabFilter(filters.FilterSet):
    class Meta:
        model = Rehab
        fields = {
            'name': ['exact', 'icontains'],  # Filter by exact match or case-insensitive containment
            'is_active': ['exact'],           # Filter by active status
            'created_at': ['exact', 'gte', 'lte'],  # Filter by creation date
            'cost': ['gte', 'lte'],           # Filter by cost range
            'duration': ['gte', 'lte'],       # Filter by duration range
        }