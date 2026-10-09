from rest_framework import serializers
from .models import Department, Category, Report, StatusHistory, AIClassification


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'email', 'phone', 'is_active', 'created_at']


class CategorySerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'department', 'department_name', 'icon']


class StatusHistorySerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_new_status_display', read_only=True)

    class Meta:
        model = StatusHistory
        fields = ['id', 'old_status', 'new_status', 'status_display', 'changed_by', 'comment', 'changed_at']


class AIClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIClassification
        fields = ['id', 'category_predicted', 'confidence', 'raw_response', 'created_at']


class ReportSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)
    department_detail = DepartmentSerializer(source='department', read_only=True)
    status_history = StatusHistorySerializer(many=True, read_only=True)
    ai_classification = AIClassificationSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id', 'category', 'category_detail', 'department', 'department_detail',
            'title', 'description', 'photo', 'photo_url', 'latitude', 'longitude',
            'address', 'status', 'status_display', 'priority', 'priority_display',
            'citizen_email', 'photo_source', 'has_exif_location', 'camera_model',
            'metadata_info', 'citizen_token', 'dept_token', 'status_history',
            'ai_classification', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'status', 'priority', 'citizen_token', 'dept_token',
            'has_exif_location', 'camera_model', 'metadata_info', 'created_at', 'updated_at'
        ]

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo:
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None
