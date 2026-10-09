from django.urls import path
from . import views, api_views

urlpatterns = [
    # Server-rendered templates
    path('', views.home, name='home'),
    path('report/', views.report, name='report'),
    path('submit/', views.submit_report, name='submit_report'),
    path('track/<str:citizen_token>/', views.track_report, name='track_report'),
    path('r/<str:dept_token>/', views.department_report, name='department_report'),
    path('r/<str:dept_token>/update/', views.update_status, name='update_status'),
    path('api/classify-photo/', views.classify_photo, name='api_classify_photo'),
    path('api/extract-metadata/', views.extract_metadata_api, name='api_extract_metadata'),
    path('test-email/', views.test_email_view, name='test_email'),

    # REST API Endpoints for Decoupled Frontend (Next.js / Mobile)
    path('api/v1/categories/', api_views.category_list_api, name='api_categories'),
    path('api/v1/departments/', api_views.department_list_api, name='api_departments'),
    path('api/v1/reports/', api_views.submit_report_api, name='api_submit_report'),
    path('api/v1/reports/track/<str:token>/', api_views.track_report_api, name='api_track_report'),
    path('api/v1/reports/update-status/<str:dept_token>/', api_views.update_status_api, name='api_update_status'),
    path('api/v1/classify-photo/', api_views.classify_photo_api, name='api_v1_classify_photo'),
]
