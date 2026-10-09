import os

# Update tracking.html
file1 = '/home/abdulrahim/ClearCity/templates/reports/tracking.html'
with open(file1, 'r') as f:
    content1 = f.read()

content1 = content1.replace(
    '<span style="color: var(--color-text-muted);">Kateqoriya</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_category">Kateqoriya</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Prioritet</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_priority">Prioritet</span>'
).replace(
    '<span style="color: var(--color-text-muted);">İdarə</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_department">İdarə</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Ünvan</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_address">Ünvan</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Foto Mənbəyi</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_photo_source">Foto Mənbəyi</span>'
).replace(
    '<span style="color: var(--color-text-muted);">GPS Doğrulaması</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_gps_verified">GPS Doğrulaması</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Cihaz</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_device">Cihaz</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Yaradılıb</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_created">Yaradılıb</span>'
)

# Məkan heading
content1 = content1.replace(
    'Məkan\n                        </h3>',
    '<span data-i18n="location_title">Məkan</span>\n                        </h3>'
)

# AI Təsnifatı heading
content1 = content1.replace(
    '<h3 style="font-size: var(--font-size-lg); font-weight: 600;">AI Təsnifatı</h3>',
    '<h3 style="font-size: var(--font-size-lg); font-weight: 600;"><span data-i18n="ai_classification">AI Təsnifatı</span></h3>'
)

# Kateqoriya (in AI section)
content1 = content1.replace(
    '<span style="opacity: 0.9;">Kateqoriya</span>',
    '<span style="opacity: 0.9;" data-i18n="ai_category">Kateqoriya</span>'
)

# Əminlik
content1 = content1.replace(
    '<span style="opacity: 0.9;">Əminlik</span>',
    '<span style="opacity: 0.9;" data-i18n="ai_confidence">Əminlik</span>'
)

# Status tarixçəsi heading
content1 = content1.replace(
    'Status tarixçəsi\n                    </h3>',
    '<span data-i18n="status_history">Status tarixçəsi</span>\n                    </h3>'
)

# Tarixçə hələlik boşdur
content1 = content1.replace(
    '<p style="color: var(--color-text-muted); text-align: center; padding: var(--space-lg);">Tarixçə hələlik boşdur</p>',
    '<p style="color: var(--color-text-muted); text-align: center; padding: var(--space-lg);" data-i18n="history_empty">Tarixçə hələlik boşdur</p>'
)

# Bookmark hint
content1 = content1.replace(
    '<p style="font-size: var(--font-size-sm); color: var(--color-text-light); margin: 0;">\n                        Statusu istənilən vaxt izləmək üçün bu səhifəni yadda saxlayın\n                    </p>',
    '<p style="font-size: var(--font-size-sm); color: var(--color-text-light); margin: 0;" data-i18n="bookmark_hint">\n                        Statusu istənilən vaxt izləmək üçün bu səhifəni yadda saxlayın\n                    </p>'
)

# EXIF Metadatası ilə
content1 = content1.replace(
    '<i class="fas fa-check-circle"></i> EXIF Metadatası ilə</span>',
    '<i class="fas fa-check-circle"></i> <span data-i18n="gps_exif_verified">EXIF Metadatası ilə</span></span>'
)

with open(file1, 'w') as f:
    f.write(content1)


# Update department.html
file2 = '/home/abdulrahim/ClearCity/templates/reports/department.html'
with open(file2, 'r') as f:
    content2 = f.read()

# İdarə portalı heading -> data-i18n="dept_portal"
content2 = content2.replace(
    '<h2 style="font-size: var(--font-size-xl); font-weight: 700; margin: 0;">İdarə portalı</h2>',
    '<h2 style="font-size: var(--font-size-xl); font-weight: 700; margin: 0;" data-i18n="dept_portal">İdarə portalı</h2>'
)
# Müraciət statusunun baxılması və yenilənməsi -> data-i18n="dept_portal_desc"
content2 = content2.replace(
    '<p style="margin: 0; opacity: 0.9;">Müraciət statusunun baxılması və yenilənməsi</p>',
    '<p style="margin: 0; opacity: 0.9;" data-i18n="dept_portal_desc">Müraciət statusunun baxılması və yenilənməsi</p>'
)

# Müraciət ID label -> data-i18n="dept_request_id"
content2 = content2.replace(
    '<span style="color: var(--color-text-muted);">Müraciət ID</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="dept_request_id">Müraciət ID</span>'
)

# Kateqoriya, Prioritet, Ünvan, Yaradılıb, Koordinatlar, Foto Mənbəyi, GPS Doğrulaması, Cihaz
content2 = content2.replace(
    '<span style="color: var(--color-text-muted);">Kateqoriya</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_category">Kateqoriya</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Prioritet</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_priority">Prioritet</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Ünvan</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_address">Ünvan</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Yaradılıb</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_created">Yaradılıb</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Koordinatlar</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_coordinates">Koordinatlar</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Foto Mənbəyi</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_photo_source">Foto Mənbəyi</span>'
).replace(
    '<span style="color: var(--color-text-muted);">GPS Doğrulaması</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_gps_verified">GPS Doğrulaması</span>'
).replace(
    '<span style="color: var(--color-text-muted);">Cihaz</span>',
    '<span style="color: var(--color-text-muted);" data-i18n="label_device">Cihaz</span>'
)

# EXIF Metadatası ilə
content2 = content2.replace(
    '<i class="fas fa-check-circle"></i> EXIF Metadatası ilə</span>',
    '<i class="fas fa-check-circle"></i> <span data-i18n="gps_exif_verified">EXIF Metadatası ilə</span></span>'
)

# Məkan heading
content2 = content2.replace(
    'Məkan\n                        </h3>',
    '<span data-i18n="location_title">Məkan</span>\n                        </h3>'
)

# Statusu yenilə heading
content2 = content2.replace(
    'Statusu yenilə\n                    </h3>',
    '<span data-i18n="update_status">Statusu yenilə</span>\n                    </h3>'
)

# Yeni status label
content2 = content2.replace(
    '<label for="status" style="display: block; font-size: var(--font-size-sm); font-weight: 500; margin-bottom: var(--space-sm);">Yeni status</label>',
    '<label for="status" style="display: block; font-size: var(--font-size-sm); font-weight: 500; margin-bottom: var(--space-sm);" data-i18n="new_status">Yeni status</label>'
)

# Şərh label
content2 = content2.replace(
    '<label for="comment" style="display: block; font-size: var(--font-size-sm); font-weight: 500; margin-bottom: var(--space-sm);">Şərh</label>',
    '<label for="comment" style="display: block; font-size: var(--font-size-sm); font-weight: 500; margin-bottom: var(--space-sm);" data-i18n="comment_label">Şərh</label>'
)

# Comment placeholder
content2 = content2.replace(
    'placeholder="Status dəyişikliyi haqqında şərh əlavə edin..."',
    'placeholder="Status dəyişikliyi haqqında şərh əlavə edin..." data-i18n-placeholder="comment_placeholder"'
)

# Statusu yenilə button text
content2 = content2.replace(
    '<i class="fas fa-check"></i>\n                            Statusu yenilə\n                        </button>',
    '<i class="fas fa-check"></i>\n                            <span data-i18n="update_status">Statusu yenilə</span>\n                        </button>'
)

# AI Təsnifatı
content2 = content2.replace(
    '<h3 style="font-size: var(--font-size-lg); font-weight: 600;">AI Təsnifatı</h3>',
    '<h3 style="font-size: var(--font-size-lg); font-weight: 600;"><span data-i18n="ai_classification">AI Təsnifatı</span></h3>'
)

# Kateqoriya (AI)
content2 = content2.replace(
    '<span style="opacity: 0.9;">Kateqoriya</span>',
    '<span style="opacity: 0.9;" data-i18n="ai_category">Kateqoriya</span>'
)

# Əminlik
content2 = content2.replace(
    '<span style="opacity: 0.9;">Əminlik</span>',
    '<span style="opacity: 0.9;" data-i18n="ai_confidence">Əminlik</span>'
)

# Dəyişikliklər tarixi
content2 = content2.replace(
    'Dəyişikliklər tarixi\n                    </h3>',
    '<span data-i18n="changes_history">Dəyişikliklər tarixi</span>\n                    </h3>'
)

# Tarixçə hələlik boşdur
content2 = content2.replace(
    '<p style="color: var(--color-text-muted); text-align: center; padding: var(--space-lg);">Tarixçə hələlik boşdur</p>',
    '<p style="color: var(--color-text-muted); text-align: center; padding: var(--space-lg);" data-i18n="history_empty">Tarixçə hələlik boşdur</p>'
)

with open(file2, 'w') as f:
    f.write(content2)

print("Done")
