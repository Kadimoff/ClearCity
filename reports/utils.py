import os
import json
import base64
import secrets
import random
import urllib.request
from pathlib import Path
from PIL import Image, ExifTags
from dotenv import load_dotenv
from django.conf import settings

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

from .models import Category, Department

def get_openai_client():
    """Dynamically get an OpenAI client from the latest .env value."""
    dotenv_path = Path(__file__).resolve().parent.parent / '.env'
    load_dotenv(dotenv_path, override=True)
    key = os.getenv('OPENAI_API_KEY') or getattr(settings, 'OPENAI_API_KEY', None)
    if key:
        key = key.strip().strip('"').strip("'")
    if OpenAI and key and not key.startswith('your-'):
        try:
            return OpenAI(api_key=key)
        except Exception:
            return None
    return None


ALLOWED_CATEGORIES = [
    'road_damage',
    'trash_overflow',
    'street_light',
    'graffiti',
    'sidewalk_issue',
    'traffic_sign',
    'other',
]

ALLOWED_PRIORITIES = ['low', 'medium', 'high']

CATEGORY_SYNONYMS = {
    'road_damage': ['road_damage', 'road damage', 'yolun zədələnməsi', 'yol zədələnməsi', 'pothole', 'road damage', 'yol qəzalı'],
    'trash_overflow': ['trash_overflow', 'trash overflow', 'zibil', 'zibillik', 'garbage', 'bin overflow', 'trash', 'zibil axını'],
    'street_light': ['street_light', 'street light', 'street light issue', 'işıqlandırma', 'işıq problemi', 'lamp', 'streetlight'],
    'graffiti': ['graffiti', 'vandalism', 'vandal', 'qraffiti', 'graffiti vandalism', 'grafiti'],
    'sidewalk_issue': ['sidewalk_issue', 'sidewalk issue', 'səki', 'səki problemi', 'footpath', 'pavement'],
    'traffic_sign': ['traffic_sign', 'traffic sign', 'traffic sign issue', 'nişan', 'təhlükəsizlik nişanı', 'traffic sign damaged', 'sign'],
    'other': ['other', 'digər', 'other issue', 'misc', 'unknown', 'unclear']
}


def normalize_category(category_value):
    if not isinstance(category_value, str):
        return 'other'
    value = category_value.strip().lower().replace('-', ' ').replace('_', ' ')
    for slug, synonyms in CATEGORY_SYNONYMS.items():
        for synonym in synonyms:
            if synonym in value:
                return slug
    # Try exact slug match if user returned slug directly
    if value in ALLOWED_CATEGORIES:
        return value
    return 'other'


def generate_dept_token():
    """Generate a secure department token"""
    return secrets.token_urlsafe(32)


def generate_citizen_token():
    """Generate a secure citizen token"""
    return secrets.token_urlsafe(32)


def mock_classify_image(image_path=None):
    """
    Mock AI classification function.
    Returns a fixed JSON response simulating AI image classification.
    """
    categories = [
        {"category": "road_damage", "priority": "high", "description": "Pothole or road surface damage detected"},
        {"category": "trash_overflow", "priority": "medium", "description": "Garbage bin overflowing with waste"},
        {"category": "street_light", "priority": "medium", "description": "Street light malfunction or damage"},
        {"category": "graffiti", "priority": "low", "description": "Unauthorized graffiti on public property"},
        {"category": "sidewalk_issue", "priority": "medium", "description": "Damaged or uneven sidewalk"},
        {"category": "traffic_sign", "priority": "high", "description": "Damaged or missing traffic sign"},
    ]
    
    selected = random.choice(categories)
    confidence = round(random.uniform(0.75, 0.95), 2)
    
    return {
        "category": selected["category"],
        "confidence": confidence,
        "priority": selected["priority"],
        "description": selected["description"],
        "source": "mock"
    }


def _extract_json_object(text):
    text = text.strip()
    json_start = text.find('{')
    json_end = text.rfind('}')
    if json_start == -1 or json_end == -1 or json_end <= json_start:
        raise ValueError('Could not find JSON object in OpenAI response')
    return text[json_start:json_end + 1]


def _parse_openai_response_text(payload):
    try:
        return json.loads(payload)
    except json.JSONDecodeError:
        payload = _extract_json_object(payload)
        return json.loads(payload)


def classify_image_with_openai(image_path=None):
    client = get_openai_client()
    if client is None:
        raise RuntimeError('OpenAI client is not configured. Set OPENAI_API_KEY in environment.')

    with open(image_path, 'rb') as f:
        image_base64 = base64.b64encode(f.read()).decode('utf-8')

    prompt = (
        'Sən şəhər xidmətləri üçün vətəndaş şəkilini təsnif edən köməkçisən. '
        'Şəkli təhlil et və yalnız JSON formatında cavab ver. Nəticə yalnız bir JSON obyekt olmalıdır. '\
        'Format belə olmalıdır:\n'
        '{"category":"...","priority":"...","confidence":0.0,"description":"..."}\n'
        'category yalnız bunlardan biri olmalıdır: road_damage, trash_overflow, street_light, graffiti, sidewalk_issue, traffic_sign, other. '\
        'category sahəsindən başqa heç nə yazma. '\
        'priority yalnız bunlardan biri olmalıdır: low, medium, high. '
        'confidence 0.0 ilə 1.0 arasında olmalıdır. '
        'description qısa və azərbaycanca olmalıdır. '
        'Yalnız JSON obyekt ver, əlavə izah yazma.'
    )

    print('OpenAI image classification: sending request...')
    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[
            {
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': prompt},
                    {
                        'type': 'image_url',
                        'image_url': {
                            'url': f'data:image/jpeg;base64,{image_base64}'
                        }
                    }
                ]
            }
        ],
        max_tokens=300
    )

    raw_output = response.choices[0].message.content
    classification_result = _parse_openai_response_text(raw_output)
    category_raw = classification_result.get('category', 'other')
    classification_result['category'] = normalize_category(category_raw)
    classification_result['priority'] = classification_result.get('priority', 'medium')
    classification_result['confidence'] = float(classification_result.get('confidence', 0))
    classification_result['description'] = classification_result.get('description', '').strip()
    classification_result['source'] = 'openai'

    if classification_result['priority'] not in ALLOWED_PRIORITIES:
        classification_result['priority'] = 'medium'
    if not 0 <= classification_result['confidence'] <= 1:
        classification_result['confidence'] = 0.0

    print(f"OpenAI classification result: {classification_result}")
    return classification_result


def real_classify_image(image_path=None):
    """
    Use real OpenAI AI classification if available and valid;
    gracefully fall back to local classification if API error occurs.
    """
    client = get_openai_client()
    if client is None:
        print('WARNING: OpenAI client is not configured. Falling back to local classification.')
        return mock_classify_image(image_path)

    try:
        print('Using real OpenAI AI classification...')
        return classify_image_with_openai(image_path)
    except Exception as exc:
        print(f'ERROR: OpenAI classification failed ({exc}). Falling back to local classification.')
        return mock_classify_image(image_path)


def classify_image(image_path=None):
    client = get_openai_client()
    if client is None:
        print('WARNING: OpenAI client is not configured. Please set OPENAI_API_KEY in environment.')
        print('Falling back to mock classification.')
        return mock_classify_image(image_path)

    try:
        print('Using real OpenAI AI classification...')
        return classify_image_with_openai(image_path)
    except Exception as exc:
        print(f'ERROR: OpenAI image classification failed: {exc}')
        print('Falling back to mock classification.')
        return mock_classify_image(image_path)


def _check_smtp_credentials(settings):
    """Return error string if SMTP credentials are missing/placeholder, else None."""
    if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
        return "EMAIL_HOST_USER or EMAIL_HOST_PASSWORD not set."
    placeholders = ('your-', 'ваш', 'app-password', 'change-me')
    if any(p in settings.EMAIL_HOST_PASSWORD.lower() for p in placeholders):
        return "EMAIL_HOST_PASSWORD still contains a placeholder value."
    return None


def _safe_print(text):
    """Print safely on Windows consoles that may not support non-ASCII output."""
    try:
        print(text)
    except (UnicodeEncodeError, UnicodeDecodeError):
        print(text.encode('ascii', 'replace').decode('ascii'))


def send_email(report):
    """Send HTML email notification to department about new report."""
    from django.core.mail import EmailMultiAlternatives
    from django.template.loader import render_to_string
    from django.utils.html import strip_tags
    from django.conf import settings

    if not report.department or not report.department.email:
        _safe_print(f"WARNING: No department email for report {report.id}")
        return

    err = _check_smtp_credentials(settings)
    if err:
        _safe_print(f"ERROR: {err} Email not sent.")
        return

    site_url = getattr(settings, 'SITE_URL', 'http://localhost:8000').rstrip('/')
    ai = getattr(report, 'ai_classification', None)
    confidence_display = f"{ai.confidence * 100:.0f}%" if ai else 'N/A'
    subject = "Yeni Sehər Müraciəti - Hərəkət Tələb Olunur"

    ctx = {
        'report': report,
        'ai': ai,
        'site_url': site_url,
        'confidence_display': confidence_display,
    }
    html_body = render_to_string('emails/department_notification.html', ctx)
    # Plain text fallback: safe ASCII summary (email clients that can't render HTML)
    text_body = (
        f"Yeni muraciet: {report.id}\n"
        f"Unvan: {report.address}\n"
        f"Prioritet: {report.priority}\n"
        f"Link: {site_url}/r/{report.dept_token}/"
    ).encode('ascii', 'replace').decode('ascii')

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[report.department.email],
        )
        msg.encoding = 'utf-8'
        msg.attach_alternative(html_body, 'text/html')
        msg.send(fail_silently=False)
        _safe_print(f"[OK] Department email sent to {report.department.email}")
    except Exception as e:
        _safe_print(f"[ERROR] Failed to send department email: {e}")


def send_citizen_status_email(report, comment=''):
    """Send HTML status-update email to the citizen if they provided an email."""
    from django.core.mail import EmailMultiAlternatives
    from django.template.loader import render_to_string
    from django.conf import settings

    if not report.citizen_email:
        return

    err = _check_smtp_credentials(settings)
    if err:
        _safe_print(f"ERROR: {err} Citizen email not sent.")
        return

    site_url = getattr(settings, 'SITE_URL', 'http://localhost:8000').rstrip('/')
    # Subject: ASCII-safe to avoid codec errors on some SMTP relays
    subject = f"Muraciətinizin statusu dəyişdi: {report.status}"

    ctx = {
        'report': report,
        'site_url': site_url,
        'comment': comment,
    }
    html_body = render_to_string('emails/citizen_status_update.html', ctx)
    text_body = (
        f"Status: {report.status}\n"
        f"Link: {site_url}/track/{report.citizen_token}/"
    )

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[report.citizen_email],
        )
        msg.encoding = 'utf-8'
        msg.attach_alternative(html_body, 'text/html')
        msg.send(fail_silently=False)
        _safe_print(f"[OK] Citizen status email sent to {report.citizen_email}")
    except Exception as e:
        _safe_print(f"[ERROR] Failed to send citizen email: {e}")


def get_or_create_category_from_classification(classification_result, override_category_slug=None):
    """
    Get or create a Category based on AI classification.
    Also assigns a default department if available.
    """
    category_slug = override_category_slug or classification_result["category"]
    category_name = category_slug.replace("_", " ").title()
    
    # Try to get or create the category
    category, created = Category.objects.get_or_create(
        slug=category_slug,
        defaults={
            'name': category_name,
        }
    )
    
    # If category was just created, try to assign a default department
    if created:
        default_dept = Department.objects.filter(is_active=True).first()
        if default_dept:
            category.department = default_dept
            category.save()
    
    return category


def normalize_classification_result(classification_result):
    """
    Normalize the AI classification result.
    If confidence is below 0.6, force the report into an "other" category.
    """
    confidence = float(classification_result.get("confidence", 0))
    if confidence < 0.6:
        classification_result = classification_result.copy()
        classification_result["category"] = "other"
        classification_result["priority"] = "medium"
        classification_result["description"] = classification_result.get(
            "description",
            "AI hesabatı qeyri-müəyyəndir, digər kateqoriya seçilmişdir."
        )
    return classification_result


def get_priority_from_classification(classification_result):
    """
    Get priority from mock AI classification.
    """
    priority = classification_result.get("priority", "medium")
    valid_priorities = ["low", "medium", "high"]
    return priority if priority in valid_priorities else "medium"


def _convert_dms_to_deg(dms):
    if isinstance(dms, (tuple, list)):
        d, m, s = float(dms[0]), float(dms[1]), float(dms[2])
        return d + (m / 60.0) + (s / 3600.0)
    return float(dms)


def extract_exif_gps_and_metadata(image_source):
    """
    Extract EXIF GPS coordinates, camera model, and capture date from an image.
    Supports file paths, Django UploadedFile, or file-like objects.
    """
    result = {
        "has_gps": False,
        "latitude": None,
        "longitude": None,
        "date_taken": None,
        "camera_model": None,
        "raw_metadata": {},
    }
    try:
        if hasattr(image_source, 'seek'):
            image_source.seek(0)

        image = Image.open(image_source)
        exif = image.getexif()
        if not exif:
            return result

        # Basic camera info
        make = str(exif.get(ExifTags.Base.Make) or '').strip()
        model = str(exif.get(ExifTags.Base.Model) or '').strip()
        camera = f"{make} {model}".strip()
        if camera:
            result["camera_model"] = camera

        date_taken = exif.get(ExifTags.Base.DateTimeOriginal) or exif.get(ExifTags.Base.DateTime)
        if date_taken:
            result["date_taken"] = str(date_taken)

        # GPS Info IFD
        gps_ifd = None
        if exif:
            try:
                gps_ifd = exif.get_ifd(ExifTags.IFD.GPSInfo)
            except Exception:
                pass
            if not gps_ifd:
                gps_ifd = exif.get(34853)

        # Fallback to _getexif() on JPEG images
        if not gps_ifd and hasattr(image, '_getexif'):
            try:
                raw_exif = image._getexif() or {}
                gps_ifd = raw_exif.get(34853)
                if not result["camera_model"]:
                    make = str(raw_exif.get(271) or '').strip()
                    model = str(raw_exif.get(272) or '').strip()
                    camera = f"{make} {model}".strip()
                    if camera:
                        result["camera_model"] = camera
                if not result["date_taken"]:
                    dt = raw_exif.get(36867) or raw_exif.get(306)
                    if dt:
                        result["date_taken"] = str(dt)
            except Exception:
                pass

        if gps_ifd and isinstance(gps_ifd, dict):
            gps_data = {ExifTags.GPSTAGS.get(k, k): v for k, v in gps_ifd.items()}
            lat = gps_data.get('GPSLatitude') or gps_ifd.get(2)
            lat_ref = str(gps_data.get('GPSLatitudeRef') or gps_ifd.get(1) or 'N').upper()
            lon = gps_data.get('GPSLongitude') or gps_ifd.get(4)
            lon_ref = str(gps_data.get('GPSLongitudeRef') or gps_ifd.get(3) or 'E').upper()

            if lat and lon:
                lat_val = _convert_dms_to_deg(lat)
                lon_val = _convert_dms_to_deg(lon)
                if lat_val is not None and lon_val is not None:
                    if 'S' in lat_ref:
                        lat_val = -lat_val
                    if 'W' in lon_ref:
                        lon_val = -lon_val

                    if -90 <= lat_val <= 90 and -180 <= lon_val <= 180:
                        result["has_gps"] = True
                        result["latitude"] = round(lat_val, 7)
                        result["longitude"] = round(lon_val, 7)

        result["raw_metadata"] = {
            "camera": result["camera_model"],
            "date": result["date_taken"],
            "has_gps": result["has_gps"],
            "lat": result["latitude"],
            "lng": result["longitude"],
        }
    except Exception as e:
        _safe_print(f"[EXIF ERROR] {e}")
    finally:
        if hasattr(image_source, 'seek'):
            image_source.seek(0)

    return result


def reverse_geocode_nominatim(lat, lon):
    """
    Get human-readable address from coordinates using OpenStreetMap Nominatim.
    """
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&accept-language=az"
        req = urllib.request.Request(url, headers={'User-Agent': 'ClearCity/1.0'})
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data.get('display_name', '')
    except Exception as e:
        _safe_print(f"[GEOCODE ERROR] {e}")
        return ''

