import re

with open('/home/abdulrahim/ClearCity/templates/reports/report_form.html', 'r') as f:
    content = f.read()

# HTML elements
content = content.replace('<h1>Problem haqqında bildirin</h1>', '<h1 data-i18n="report_title">Problem haqqında bildirin</h1>')
content = content.replace('<p>Fotonu çəkin və ya qalereyadan yükləyin — dəqiq lokasiya və ünvan avtomatik müəyyən olunacaq</p>', '<p data-i18n="report_subtitle">Fotonu çəkin və ya qalereyadan yükləyin — dəqiq lokasiya və ünvan avtomatik müəyyən olunacaq</p>')
content = content.replace('Foto mənbəyi və çəkiliş <span>*</span>', '<span data-i18n="photo_source_label">Foto mənbəyi və çəkiliş</span> <span>*</span>')
content = content.replace('<span class="source-title">Şəkil çək</span>', '<span class="source-title" data-i18n="take_photo">Şəkil çək</span>')
content = content.replace('<span class="source-subtitle">Kamera ilə dərhal çəkin (dəqiq GPS)</span>', '<span class="source-subtitle" data-i18n="take_photo_hint">Kamera ilə dərhal çəkin (dəqiq GPS)</span>')
content = content.replace('<span class="source-title">Şəkil yüklə</span>', '<span class="source-title" data-i18n="upload_photo">Şəkil yüklə</span>')
content = content.replace('<span class="source-subtitle">Qalereyadan seçin (GPS metadatası)</span>', '<span class="source-subtitle" data-i18n="upload_photo_hint">Qalereyadan seçin (GPS metadatası)</span>')
content = content.replace('<p class="upload-text" id="uploadText">Kameranı açmaq və foto çəkmək üçün klikləyin</p>', '<p class="upload-text" id="uploadText" data-i18n="upload_text_camera">Kameranı açmaq və foto çəkmək üçün klikləyin</p>')
content = content.replace('<p class="upload-hint" id="uploadHint">Çəkiliş anında dəqiq GPS koordinatları qeyd ediləcək</p>', '<p class="upload-hint" id="uploadHint" data-i18n="upload_hint_camera">Çəkiliş anında dəqiq GPS koordinatları qeyd ediləcək</p>')
content = content.replace('<i class="fas fa-redo"></i> Fotonu dəyişdir', '<i class="fas fa-redo"></i> <span data-i18n="change_photo">Fotonu dəyişdir</span>')
content = content.replace('Problemin ünvanı və dəqiq məkanı <span>*</span>', '<span data-i18n="address_label">Problemin ünvanı və dəqiq məkanı</span> <span>*</span>')
content = content.replace('placeholder="Məsələn: Nizami küçəsi, 45, Yasamal rayonu" required>', 'placeholder="Məsələn: Nizami küçəsi, 45, Yasamal rayonu" data-i18n-placeholder="address_placeholder" required>')
content = content.replace('<span>Cari Məkan</span>', '<span data-i18n="current_location">Cari Məkan</span>')
content = content.replace('<span><i class="fas fa-map-marked-alt"></i> Dəqiq Məkan Xəritəsi</span>', '<span><i class="fas fa-map-marked-alt"></i> <span data-i18n="map_title">Dəqiq Məkan Xəritəsi</span></span>')
content = content.replace('<small style="color: var(--color-text-muted);">Xəritəyə toxunaraq nöqtəni dəqiqləşdirə bilərsiniz</small>', '<small style="color: var(--color-text-muted);" data-i18n="map_hint">Xəritəyə toxunaraq nöqtəni dəqiqləşdirə bilərsiniz</small>')
content = content.replace('Problemin təsviri <span>*</span>', '<span data-i18n="description_label">Problemin təsviri</span> <span>*</span>')
content = content.replace('placeholder="Problemi daha ətraflı təsvir edin: nə vaxt yarandı, nə qədər kritikdir və s."\n                    required>', 'placeholder="Problemi daha ətraflı təsvir edin: nə vaxt yarandı, nə qədər kritikdir və s." data-i18n-placeholder="description_placeholder"\n                    required>')
content = content.replace('E-poçt ünvanı <span style="font-weight:400;color:#6b7280;font-size:0.85em;">(isteğe bağlı)</span>', '<span data-i18n="email_label">E-poçt ünvanı</span> <span style="font-weight:400;color:#6b7280;font-size:0.85em;" data-i18n="email_optional">(isteğe bağlı)</span>')
content = content.replace('placeholder="Müraciət statusu dəyişdikdə bildiriş almaq üçün">', 'placeholder="Müraciət statusu dəyişdikdə bildiriş almaq üçün" data-i18n-placeholder="email_placeholder">')
content = content.replace('<p style="font-size:0.82rem;color:#9ca3af;margin-top:4px;">\n                    Doldurulsa, statusunuz dəyişdikdə sizə e-poçt göndəriləcək.\n                </p>', '<p style="font-size:0.82rem;color:#9ca3af;margin-top:4px;" data-i18n="email_hint">\n                    Doldurulsa, statusunuz dəyişdikdə sizə e-poçt göndəriləcək.\n                </p>')
content = content.replace('<i class="fas fa-paper-plane"></i>\n                    Müraciət göndərin', '<i class="fas fa-paper-plane"></i>\n                    <span data-i18n="submit_btn">Müraciət göndərin</span>')

# JS strings
content = content.replace("uploadText.textContent = 'Kameranı açmaq və foto çəkmək üçün klikləyin';", "uploadText.textContent = window.I18N.t('upload_text_camera');")
content = content.replace("uploadHint.textContent = 'Çəkiliş anında dəqiq GPS koordinatları qeyd ediləcək';", "uploadHint.textContent = window.I18N.t('upload_hint_camera');")
content = content.replace("uploadText.textContent = 'Qalereyadan və ya fayllardan seçmək üçün klikləyin';", "uploadText.textContent = window.I18N.t('upload_text_gallery');")
content = content.replace("uploadHint.textContent = 'Şəkildəki GPS meta-məlumatı avtomatik oxunacaq';", "uploadHint.textContent = window.I18N.t('upload_hint_gallery');")

with open('/home/abdulrahim/ClearCity/templates/reports/report_form.html', 'w') as f:
    f.write(content)
