import json
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, Http404
from django.conf import settings
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from .models import Report, Department, Category, StatusHistory, AIClassification
from .utils import (
    real_classify_image,
    normalize_classification_result,
    send_email,
    send_citizen_status_email,
    get_or_create_category_from_classification,
    get_priority_from_classification,
    extract_exif_gps_and_metadata,
    reverse_geocode_nominatim,
)


def home(request):
    """
    Landing page with modern hero and features.
    """
    return render(request, 'reports/index.html')


def report(request):
    """
    Report submission form page with drag-drop upload.
    """
    return render(request, 'reports/report_form.html')


@require_http_methods(["POST"])
def submit_report(request):
    """
    Handle report submission from the report form with metadata and GPS validation.
    """
    photo = request.FILES.get('photo')
    address = request.POST.get('address', '').strip()
    description = request.POST.get('description', '').strip()
    citizen_email = request.POST.get('citizen_email', '').strip()
    photo_source = request.POST.get('photo_source', 'gallery').strip()
    latitude_str = request.POST.get('latitude', '').strip()
    longitude_str = request.POST.get('longitude', '').strip()

    # Validation
    if not photo:
        messages.error(request, 'Zəhmət olmasa, problemin fotosunu çəkin və ya yükləyin.')
        return redirect('report')

    # Extract EXIF metadata from photo
    meta = extract_exif_gps_and_metadata(photo)
    has_exif = meta.get('has_gps', False)

    latitude = None
    longitude = None

    if has_exif:
        latitude = meta.get('latitude')
        longitude = meta.get('longitude')
    elif latitude_str and longitude_str:
        try:
            latitude = float(latitude_str)
            longitude = float(longitude_str)
        except (ValueError, TypeError):
            latitude = None
            longitude = None

    # Strict location check
    if latitude is None or longitude is None:
        messages.error(
            request,
            'Problemin dəqiq lokasiyası müəyyən edilmədi! '
            'Zəhmət olmasa, fotonun GPS meta-məlumatının olduğundan əmin olun '
            'və ya "Məkanımı müəyyən et" düyməsi / xəritə vasitəsilə dəqiq məkanı seçin.'
        )
        return redirect('report')

    # Reverse geocode address if missing
    if not address and latitude and longitude:
        address = reverse_geocode_nominatim(latitude, longitude)

    if not address:
        messages.error(request, 'Zəhmət olmasa, ünvanı qeyd edin.')
        return redirect('report')

    if not description:
        messages.error(request, 'Zəhmət olmasa, problemin təsvirini qeyd edin.')
        return redirect('report')

    # Create the report
    report = Report(
        photo=photo,
        address=address,
        description=description,
        citizen_email=citizen_email,
        latitude=latitude,
        longitude=longitude,
        photo_source=photo_source,
        has_exif_location=has_exif,
        camera_model=meta.get('camera_model') or '',
        metadata_info=meta.get('raw_metadata') or {},
    )

    # Generate title from description (first 50 chars)
    report.title = description[:50] + ('...' if len(description) > 50 else '')
    report.save()

    # AI image classification
    classification_result = real_classify_image(report.photo.path if report.photo else None)
    classification_result = normalize_classification_result(classification_result)

    # Get or create category based on classification
    category = get_or_create_category_from_classification(classification_result)
    report.category = category

    # Set priority from classification
    report.priority = get_priority_from_classification(classification_result)

    # Assign department from category
    if category and category.department:
        report.department = category.department
    else:
        # Fallback to first active department
        report.department = Department.objects.filter(is_active=True).first()

    report.save()

    # Save AI classification result
    ai_classification = AIClassification.objects.create(
        report=report,
        category_predicted=classification_result["category"],
        confidence=classification_result["confidence"],
        raw_response=classification_result
    )

    # Create initial status history
    StatusHistory.objects.create(
        report=report,
        old_status='',
        new_status='pending',
        changed_by='system',
        comment='Report created and classified by AI'
    )

    # Send email notification
    send_email(report)

    # Redirect to tracking page
    return redirect('track_report', citizen_token=report.citizen_token)


@csrf_exempt
@require_http_methods(["POST"])
def classify_photo(request):
    """
    Receive photo from the form, run AI classification, extract metadata, and return JSON.
    """
    try:
        photo = request.FILES.get('photo')
        if not photo:
            return JsonResponse({'error': 'No photo uploaded.'}, status=400)

        temp_name = default_storage.save(f'tmp/{photo.name}', ContentFile(photo.read()))
        try:
            temp_path = default_storage.path(temp_name)
            classification_result = real_classify_image(temp_path)
            classification_result = normalize_classification_result(classification_result)

            # Extract EXIF metadata
            meta = extract_exif_gps_and_metadata(temp_path)
            if meta.get('has_gps'):
                meta['address'] = reverse_geocode_nominatim(meta['latitude'], meta['longitude'])

            classification_result['metadata'] = meta
            return JsonResponse(classification_result)
        finally:
            default_storage.delete(temp_name)
    except Exception as e:
        print(f"ERROR in classify_photo: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': f'Classification failed: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def extract_metadata_api(request):
    """
    Fast endpoint to extract EXIF GPS metadata from an uploaded image.
    """
    try:
        photo = request.FILES.get('photo')
        if not photo:
            return JsonResponse({'error': 'Şəkil tapılmadı.'}, status=400)

        meta = extract_exif_gps_and_metadata(photo)
        if meta.get('has_gps'):
            meta['address'] = reverse_geocode_nominatim(meta['latitude'], meta['longitude'])

        return JsonResponse(meta)
    except Exception as e:
        return JsonResponse({'error': f'Metadata xətası: {str(e)}'}, status=500)


def track_report(request, citizen_token):
    """
    Public tracking page for citizens to view their report status.
    """
    report = get_object_or_404(Report, citizen_token=citizen_token)
    status_history = report.status_history.all()
    ai_classification = getattr(report, 'ai_classification', None)
    
    context = {
        'report': report,
        'status_history': status_history,
        'ai_classification': ai_classification,
    }
    return render(request, 'reports/tracking.html', context)


def department_report(request, dept_token):
    """
    Department page to view and update report status.
    """
    report = get_object_or_404(Report, dept_token=dept_token)
    status_history = report.status_history.all()
    ai_classification = getattr(report, 'ai_classification', None)
    
    context = {
        'report': report,
        'status_history': status_history,
        'ai_classification': ai_classification,
        'status_choices': Report.STATUS_CHOICES,
    }
    return render(request, 'reports/department.html', context)


@require_http_methods(["POST"])
def update_status(request, dept_token):
    """
    Update report status from department page.
    """
    report = get_object_or_404(Report, dept_token=dept_token)
    
    new_status = request.POST.get('status')
    comment = request.POST.get('comment', '').strip()
    
    if new_status not in [s[0] for s in Report.STATUS_CHOICES]:
        messages.error(request, 'Invalid status selected.')
        return redirect('department_report', dept_token=dept_token)
    
    old_status = report.status
    
    if old_status != new_status:
        # Update report status
        report.status = new_status
        report.save()
        
        # Record status change
        StatusHistory.objects.create(
            report=report,
            old_status=old_status,
            new_status=new_status,
            changed_by='department',
            comment=comment
        )

        # Notify citizen if they provided an email
        send_citizen_status_email(report, comment=comment)

        messages.success(request, f'Status updated to {report.get_status_display()}.')
    else:
        messages.info(request, 'No status change.')

    return redirect('department_report', dept_token=dept_token)


def test_email_view(request):
    """Simple page to verify SMTP credentials work end-to-end."""
    if not settings.DEBUG:
        raise Http404()

    from django.core.mail import EmailMultiAlternatives

    result = None
    if request.method == 'POST':
        to_email = request.POST.get('email', '').strip()
        if to_email:
            subject = 'ClearCity — E-poçt Testi'
            text_body = 'Bu ClearCity sisteminin test e-poçtudur. Əgər bunu görürsünüzsə, e-poçt xidməti düzgün işləyir!'
            html_body = """
            <div style="font-family:Arial,sans-serif;max-width:480px;margin:30px auto;
                        background:#fff;border-radius:12px;overflow:hidden;
                        box-shadow:0 4px 20px rgba(0,0,0,0.1);">
              <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;text-align:center;color:#fff;">
                <div style="font-size:32px;">✅</div>
                <h2 style="margin:10px 0 0;">E-poçt Testi Uğurlu</h2>
              </div>
              <div style="padding:30px;text-align:center;color:#555;">
                <p style="font-size:16px;line-height:1.6;">
                  ClearCity sisteminin e-poçt xidməti düzgün işləyir.<br>
                  Bu test mesajını aldınızsa hər şey qaydasındadır!
                </p>
                <p style="color:#aaa;font-size:12px;margin-top:20px;">ClearCity Sistemi</p>
              </div>
            </div>"""
            try:
                err = None
                if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
                    err = 'EMAIL_HOST_USER və ya EMAIL_HOST_PASSWORD konfiqurasiya edilməyib.'
                if not err:
                    msg = EmailMultiAlternatives(subject, text_body,
                                                 settings.DEFAULT_FROM_EMAIL, [to_email])
                    msg.attach_alternative(html_body, 'text/html')
                    msg.send(fail_silently=False)
                    result = {'success': True, 'email': to_email}
                else:
                    result = {'success': False, 'error': err}
            except Exception as e:
                result = {'success': False, 'error': str(e)}

    return render(request, 'reports/test_email.html', {
        'result': result,
        'EMAIL_HOST_USER': settings.EMAIL_HOST_USER,
    })


