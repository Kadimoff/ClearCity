from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.views.static import serve

SAFE_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}


def serve_media(request: HttpRequest, path: str) -> HttpResponse:
    """Serve uploaded images only, with headers that block script execution."""
    if not any(path.lower().endswith(ext) for ext in SAFE_IMAGE_EXTENSIONS):
        return HttpResponse(status=404)
    response = serve(request, path, document_root=settings.MEDIA_ROOT)
    response['X-Content-Type-Options'] = 'nosniff'
    response['Content-Security-Policy'] = "sandbox; default-src 'none'"
    return response
