import json
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from .models import Department, Category, Report, StatusHistory, AIClassification
from .serializers import (
    DepartmentSerializer, CategorySerializer, ReportSerializer,
    StatusHistorySerializer, AIClassificationSerializer
)
from .utils import (
    real_classify_image,
    normalize_classification_result,
    extract_exif_gps_and_metadata,
    send_email,
    send_citizen_status_email,
    get_or_create_category_from_classification,
    get_priority_from_classification,
)


@api_view(['GET'])
@permission_classes([AllowAny])
def category_list_api(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def department_list_api(request):
    departments = Department.objects.filter(is_active=True)
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def submit_report_api(request):
    photo = request.FILES.get('photo')
    address = request.data.get('address', '').strip()
    description = request.data.get('description', '').strip()
    citizen_email = request.data.get('citizen_email', '').strip()
    latitude = request.data.get('latitude')
    longitude = request.data.get('longitude')
    photo_source = request.data.get('photo_source', 'gallery')

    if not photo:
        return Response({'error': 'Photo file is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not address:
        return Response({'error': 'Address is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not description:
        return Response({'error': 'Description is required.'}, status=status.HTTP_400_BAD_REQUEST)

    title = description[:50] + ('...' if len(description) > 50 else '')

    report = Report(
        photo=photo,
        address=address,
        description=description,
        citizen_email=citizen_email,
        title=title,
        photo_source=photo_source,
    )

    if latitude and longitude:
        try:
            report.latitude = float(latitude)
            report.longitude = float(longitude)
        except ValueError:
            pass

    report.save()

    # Extract EXIF metadata if present
    try:
        exif_info = extract_exif_gps_and_metadata(report.photo.path)
        if exif_info.get('has_gps'):
            report.has_exif_location = True
            if not report.latitude or not report.longitude:
                report.latitude = exif_info.get('latitude')
                report.longitude = exif_info.get('longitude')
        if exif_info.get('camera_model'):
            report.camera_model = exif_info.get('camera_model')
        report.metadata_info = exif_info
    except Exception as e:
        pass

    # AI Classification
    try:
        classification_result = real_classify_image(report.photo.path if report.photo else None)
        classification_result = normalize_classification_result(classification_result)

        category = get_or_create_category_from_classification(classification_result)
        report.category = category
        report.priority = get_priority_from_classification(classification_result)

        if category and category.department:
            report.department = category.department
        else:
            report.department = Department.objects.filter(is_active=True).first()

        report.save()

        AIClassification.objects.create(
            report=report,
            category_predicted=classification_result.get("category", "General"),
            confidence=classification_result.get("confidence", 0.8),
            raw_response=classification_result
        )
    except Exception as e:
        report.department = Department.objects.filter(is_active=True).first()
        report.save()

    # Create initial audit log
    StatusHistory.objects.create(
        report=report,
        old_status='',
        new_status='pending',
        changed_by='system',
        comment='Report created and classified by AI'
    )

    # Trigger async email notification
    try:
        send_email(report)
    except Exception as e:
        pass

    serializer = ReportSerializer(report, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def track_report_api(request, token):
    report = Report.objects.filter(citizen_token=token).first() or Report.objects.filter(dept_token=token).first()
    if not report:
        return Response({'error': 'Report not found with the provided token.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ReportSerializer(report, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def update_status_api(request, dept_token):
    report = get_object_or_404(Report, dept_token=dept_token)
    new_status = request.data.get('status')
    comment = request.data.get('comment', '').strip()

    valid_statuses = [choice[0] for choice in Report.STATUS_CHOICES]
    if new_status not in valid_statuses:
        return Response({'error': f'Invalid status. Allowed choices: {valid_statuses}'}, status=status.HTTP_400_BAD_REQUEST)

    old_status = report.status
    if old_status != new_status:
        report.status = new_status
        report.save()

        StatusHistory.objects.create(
            report=report,
            old_status=old_status,
            new_status=new_status,
            changed_by='department',
            comment=comment
        )

        try:
            send_citizen_status_email(report, comment=comment)
        except Exception:
            pass

    serializer = ReportSerializer(report, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def classify_photo_api(request):
    photo = request.FILES.get('photo')
    if not photo:
        return Response({'error': 'No photo uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

    temp_name = default_storage.save(f'tmp/{photo.name}', ContentFile(photo.read()))
    try:
        temp_path = default_storage.path(temp_name)
        classification_result = real_classify_image(temp_path)
        classification_result = normalize_classification_result(classification_result)
        return Response(classification_result)
    finally:
        default_storage.delete(temp_name)
