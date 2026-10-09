/**
 * i18n.js - CityAssist Internationalization
 * Handles translations for Azerbaijani, English, and Russian languages
 */

const TRANSLATIONS = {
    az: {
        // base.html
        nav_home: "Əsas səhifə",
        nav_report: "Problem haqqında bildirin",
        nav_email_test: "E-poçt Testi",
        footer_tagline: "Ağıllı şəhər bir foto ilə başlayır",
        footer_nav: "Naviqasiya",
        footer_contact: "Əlaqə",
        footer_rights: "Bütün hüquqlar qorunur",
        
        // index.html
        hero_badge: "AI-powered şəhər platforması",
        hero_title_1: "CityAssist —",
        hero_title_2: "ağıllı şəhər",
        hero_title_3: "bir foto ilə başlayır",
        hero_subtitle: "Şəhər problemləri haqqında məlumat verin. Süni intellekt avtomatik olaraq problemi müəyyən edəcək və uyğun idarəyə göndərəcək.",
        hero_cta: "Problem haqqında bildirin",
        how_it_works_label: "Bu necə işləyir",
        how_it_works_title: "Cəmi 4 sadə addım",
        how_it_works_subtitle: "Fotoşəkildən problemin həllinə qədər — sadə və şəffaf proses",
        step1_title: "Foto çəkin",
        step1_desc: "Şəhər problemini fotoşəkil edin — çuxur, sıradan çıxmış işıq, zibil yığımı və ya digərləri",
        step2_title: "AI təhlil edir",
        step2_desc: "Sistemimiz avtomatik olaraq problem növünü və prioriteti müəyyən edir",
        step3_title: "İdarəyə göndərilmə",
        step3_desc: "Müraciət avtomatik olaraq uyğun şəhər idarəsinə yönləndirilir",
        step4_title: "Statusu izləyin",
        step4_desc: "Şəxsi link vasitəsilə problemin həlli prosesini izləyin",
        categories_label: "Kateqoriyalar",
        categories_title: "Hansı problemləri həll edirik",
        categories_subtitle: "Yollardan işıqlandırmaya qədər — bütün əsas şəhər problemlərini əhatə edirik",
        cat_potholes: "Yollardakı çuxurlar",
        cat_potholes_desc: "Yol örtüyünün zədələnməsi, çuxurlar, çatlar",
        cat_lighting: "İşıqlandırma",
        cat_lighting_desc: "Sıradan çıxmış işıqlar, işıqlandırmanın olmaması, yanıb-sönmə",
        cat_trash: "Zibil yığınları",
        cat_trash_desc: "Qanunsuz zibil yığınları, dolmuş zibil qutuları",
        cat_water: "Su sızıntıları",
        cat_water_desc: "Boruların partlaması, daşqınlar, sızıntılar",
        cat_infra: "Sıradan çıxmış infrastruktur",
        cat_infra_desc: "Skamyalar, hasarlar, yol nişanları, plitələr",
        cat_graffiti: "Qrafiti",
        cat_graffiti_desc: "Qanunsuz yazılar və şəkillər",
        cat_trees: "Təhlükəli ağaclar",
        cat_trees_desc: "Devrilmiş ağaclar, təhlükəli budaqlar, köklər",
        cat_other: "Və digərləri",
        cat_other_desc: "Bütün digər şəhər problemləri",
        benefits_label: "Üstünlüklər",
        benefits_title: "Niyə bu işləyir",
        benefits_subtitle: "Sistemimizin üç əsas üstünlüyü",
        benefit1_title: "Avtomatik yönləndirmə",
        benefit1_desc: "Süni intellekt avtomatik olaraq problem növünü müəyyən edir və müraciəti gecikmə və səhv olmadan uyğun idarəyə göndərir.",
        benefit2_title: "Şəffaf nəzarət",
        benefit2_desc: "Müraciətinizin statusunu real vaxtda izləyin. Dəyişikliklərin tam tarixi unikal link vasitəsilə əlçatandır.",
        benefit3_title: "Sürətli reaksiya",
        benefit3_desc: "Məsul xidmətlərin ani bildirişi. Kritik problemlər üçün yüksək prioritet.",
        cta_title: "Şəhəri daha yaxşı etməyə hazırsınız?",
        cta_subtitle: "Bir foto problemi həll etmə prosesini işə sala bilər",
        
        // report_form.html
        report_title: "Problem haqqında bildirin",
        report_subtitle: "Fotonu çəkin və ya qalereyadan yükləyin — dəqiq lokasiya və ünvan avtomatik müəyyən olunacaq",
        photo_source_label: "Foto mənbəyi və çəkiliş",
        take_photo: "Şəkil çək",
        take_photo_hint: "Kamera ilə dərhal çəkin (dəqiq GPS)",
        upload_photo: "Şəkil yüklə",
        upload_photo_hint: "Qalereyadan seçin (GPS metadatası)",
        upload_text_camera: "Kameranı açmaq və foto çəkmək üçün klikləyin",
        upload_hint_camera: "Çəkiliş anında dəqiq GPS koordinatları qeyd ediləcək",
        upload_text_gallery: "Qalereyadan və ya fayllardan seçmək üçün klikləyin",
        upload_hint_gallery: "Şəkildəki GPS meta-məlumatı avtomatik oxunacaq",
        change_photo: "Fotonu dəyişdir",
        address_label: "Problemin ünvanı və dəqiq məkanı",
        address_placeholder: "Məsələn: Nizami küçəsi, 45, Yasamal rayonu",
        current_location: "Cari Məkan",
        map_title: "Dəqiq Məkan Xəritəsi",
        map_hint: "Xəritəyə toxunaraq nöqtəni dəqiqləşdirə bilərsiniz",
        description_label: "Problemin təsviri",
        description_placeholder: "Problemi daha ətraflı təsvir edin: nə vaxt yarandı, nə qədər kritikdir və s.",
        email_label: "E-poçt ünvanı",
        email_optional: "(isteğe bağlı)",
        email_placeholder: "Müraciət statusu dəyişdikdə bildiriş almaq üçün",
        email_hint: "Doldurulsa, statusunuz dəyişdikdə sizə e-poçt göndəriləcək.",
        submit_btn: "Müraciət göndərin",
        
        // tracking.html
        tracking_title: "Müraciətin izlənməsi",
        email_notification_text: "Status dəyişdikdə {email} ünvanına bildiriş göndəriləcək.",
        request_id: "Müraciət",
        label_category: "Kateqoriya",
        label_priority: "Prioritet",
        label_department: "İdarə",
        label_address: "Ünvan",
        label_photo_source: "Foto Mənbəyi",
        label_gps_verified: "GPS Doğrulaması",
        gps_exif_verified: "EXIF Metadatası ilə",
        label_device: "Cihaz",
        label_created: "Yaradılıb",
        not_determined: "Müəyyən edilməyib",
        not_assigned: "Təyin edilməyib",
        location_title: "Məkan",
        ai_classification: "AI Təsnifatı",
        ai_category: "Kateqoriya",
        ai_confidence: "Əminlik",
        status_history: "Status tarixçəsi",
        history_empty: "Tarixçə hələlik boşdur",
        bookmark_hint: "Statusu istənilən vaxt izləmək üçün bu səhifəni yadda saxlayın",
        report_location: "Müraciətin yeri",
        
        // department.html
        dept_portal: "İdarə portalı",
        dept_portal_desc: "Müraciət statusunun baxılması və yenilənməsi",
        dept_request_id: "Müraciət ID",
        label_coordinates: "Koordinatlar",
        update_status: "Statusu yenilə",
        new_status: "Yeni status",
        comment_label: "Şərh",
        comment_placeholder: "Status dəyişikliyi haqqında şərh əlavə edin...",
        changes_history: "Dəyişikliklər tarixi",
        
        // test_email.html
        email_test_title: "E-poçt Sistemi Testi",
        email_test_subtitle: "Gmail SMTP bağlantısını yoxlayın",
        email_success: "E-poçt uğurla göndərildi!",
        email_check_inbox: "ünvanını yoxlayın.",
        email_failed: "Göndərmə uğursuz oldu",
        email_test_desc: "Test e-poçtu göndərmək üçün e-poçt ünvanınızı daxil edin. Bu, Gmail SMTP bağlantısının düzgün işlədiyini təsdiqləyəcək.",
        email_address_label: "E-poçt ünvanı",
        send_test_email: "Test E-poçtu Göndər",
        smtp_config: "SMTP Konfiqurasiyası",
        back_home: "Ana səhifəyə qayıt",
        
        // Page titles
        page_title_home: "CityAssist — Ağıllı şəhər sizinlə başlayır",
        page_title_report: "Problem haqqında bildirin — CityAssist",
        page_title_tracking: "Müraciətin izlənməsi — CityAssist",
        page_title_dept: "İdarə portalı — CityAssist",
        page_title_email_test: "E-poçt Testi — CityAssist",
        
        // Language switcher labels
        lang_az: "AZ",
        lang_en: "EN",
        lang_ru: "RU"
    },
    en: {
        // base.html
        nav_home: "Home",
        nav_report: "Report a Problem",
        nav_email_test: "Email Test",
        footer_tagline: "Smart city starts with a photo",
        footer_nav: "Navigation",
        footer_contact: "Contact",
        footer_rights: "All rights reserved",
        
        // index.html
        hero_badge: "AI-powered city platform",
        hero_title_1: "CityAssist —",
        hero_title_2: "smart city",
        hero_title_3: "starts with one photo",
        hero_subtitle: "Report city problems. AI will automatically identify the issue and route it to the appropriate department.",
        hero_cta: "Report a Problem",
        how_it_works_label: "How it works",
        how_it_works_title: "Just 4 simple steps",
        how_it_works_subtitle: "From photo to problem resolution — simple and transparent process",
        step1_title: "Take a photo",
        step1_desc: "Take a photo of the city problem — pothole, broken light, trash pile or others",
        step2_title: "AI analyzes",
        step2_desc: "Our system automatically determines the problem type and priority",
        step3_title: "Sent to department",
        step3_desc: "The request is automatically routed to the appropriate city department",
        step4_title: "Track status",
        step4_desc: "Track the problem resolution process via personal link",
        categories_label: "Categories",
        categories_title: "What problems we solve",
        categories_subtitle: "From roads to lighting — we cover all major city problems",
        cat_potholes: "Road potholes",
        cat_potholes_desc: "Road surface damage, potholes, cracks",
        cat_lighting: "Lighting",
        cat_lighting_desc: "Broken lights, missing lighting, flickering",
        cat_trash: "Trash piles",
        cat_trash_desc: "Illegal trash piles, overflowing trash bins",
        cat_water: "Water leaks",
        cat_water_desc: "Burst pipes, flooding, leaks",
        cat_infra: "Broken infrastructure",
        cat_infra_desc: "Benches, fences, road signs, tiles",
        cat_graffiti: "Graffiti",
        cat_graffiti_desc: "Illegal writings and drawings",
        cat_trees: "Dangerous trees",
        cat_trees_desc: "Fallen trees, dangerous branches, roots",
        cat_other: "And others",
        cat_other_desc: "All other city problems",
        benefits_label: "Advantages",
        benefits_title: "Why it works",
        benefits_subtitle: "Three key advantages of our system",
        benefit1_title: "Automatic routing",
        benefit1_desc: "AI automatically determines the problem type and routes the request to the appropriate department without delay or error.",
        benefit2_title: "Transparent oversight",
        benefit2_desc: "Track your request status in real time. Complete history of changes is accessible via unique link.",
        benefit3_title: "Fast response",
        benefit3_desc: "Instant notification of responsible services. High priority for critical problems.",
        cta_title: "Ready to make the city better?",
        cta_subtitle: "One photo can start the problem-solving process",
        
        // report_form.html
        report_title: "Report a Problem",
        report_subtitle: "Take a photo or upload from gallery — exact location and address will be detected automatically",
        photo_source_label: "Photo source and capture",
        take_photo: "Take photo",
        take_photo_hint: "Take immediately with camera (exact GPS)",
        upload_photo: "Upload photo",
        upload_photo_hint: "Choose from gallery (GPS metadata)",
        upload_text_camera: "Click to open camera and take photo",
        upload_hint_camera: "Exact GPS coordinates will be recorded at the time of capture",
        upload_text_gallery: "Click to choose from gallery or files",
        upload_hint_gallery: "GPS metadata from the image will be read automatically",
        change_photo: "Change photo",
        address_label: "Problem address and exact location",
        address_placeholder: "Example: Nizami street, 45, Yasamal district",
        current_location: "Current Location",
        map_title: "Exact Location Map",
        map_hint: "You can refine the point by tapping the map",
        description_label: "Problem description",
        description_placeholder: "Describe the problem in detail: when it appeared, how critical it is, etc.",
        email_label: "Email address",
        email_optional: "(optional)",
        email_placeholder: "To receive notifications when request status changes",
        email_hint: "If filled, you will receive an email when your status changes.",
        submit_btn: "Submit request",
        
        // tracking.html
        tracking_title: "Request Tracking",
        email_notification_text: "Notifications will be sent to {email} when status changes.",
        request_id: "Request",
        label_category: "Category",
        label_priority: "Priority",
        label_department: "Department",
        label_address: "Address",
        label_photo_source: "Photo Source",
        label_gps_verified: "GPS Verification",
        gps_exif_verified: "Verified via EXIF Metadata",
        label_device: "Device",
        label_created: "Created",
        not_determined: "Not determined",
        not_assigned: "Not assigned",
        location_title: "Location",
        ai_classification: "AI Classification",
        ai_category: "Category",
        ai_confidence: "Confidence",
        status_history: "Status History",
        history_empty: "History is empty",
        bookmark_hint: "Save this page to track status anytime",
        report_location: "Report location",
        
        // department.html
        dept_portal: "Department Portal",
        dept_portal_desc: "View and update request status",
        dept_request_id: "Request ID",
        label_coordinates: "Coordinates",
        update_status: "Update status",
        new_status: "New status",
        comment_label: "Comment",
        comment_placeholder: "Add a comment about the status change...",
        changes_history: "Changes History",
        
        // test_email.html
        email_test_title: "Email System Test",
        email_test_subtitle: "Check Gmail SMTP connection",
        email_success: "Email sent successfully!",
        email_check_inbox: "Check your inbox.",
        email_failed: "Sending failed",
        email_test_desc: "Enter your email to send a test. This will verify the Gmail SMTP connection is working.",
        email_address_label: "Email address",
        send_test_email: "Send Test Email",
        smtp_config: "SMTP Configuration",
        back_home: "Back to home",
        
        // Page titles
        page_title_home: "CityAssist — Smart city starts with you",
        page_title_report: "Report a Problem — CityAssist",
        page_title_tracking: "Request Tracking — CityAssist",
        page_title_dept: "Department Portal — CityAssist",
        page_title_email_test: "Email Test — CityAssist",
        
        // Language switcher labels
        lang_az: "AZ",
        lang_en: "EN",
        lang_ru: "RU"
    },
    ru: {
        // base.html
        nav_home: "Главная",
        nav_report: "Сообщить о проблеме",
        nav_email_test: "Тест эл. почты",
        footer_tagline: "Умный город начинается с фото",
        footer_nav: "Навигация",
        footer_contact: "Контакты",
        footer_rights: "Все права защищены",
        
        // index.html
        hero_badge: "AI-платформа для города",
        hero_title_1: "CityAssist —",
        hero_title_2: "умный город",
        hero_title_3: "начинается с одного фото",
        hero_subtitle: "Сообщайте о городских проблемах. ИИ автоматически определит проблему и направит в соответствующий отдел.",
        hero_cta: "Сообщить о проблеме",
        how_it_works_label: "Как это работает",
        how_it_works_title: "Всего 4 простых шага",
        how_it_works_subtitle: "От фото до решения проблемы — простой и прозрачный процесс",
        step1_title: "Сделайте фото",
        step1_desc: "Сфотографируйте городскую проблему — яму, сломанный фонарь, мусор или другое",
        step2_title: "ИИ анализирует",
        step2_desc: "Наша система автоматически определяет тип проблемы и приоритет",
        step3_title: "Отправка в ведомство",
        step3_desc: "Обращение автоматически направляется в соответствующее ведомство",
        step4_title: "Отслеживайте статус",
        step4_desc: "Отслеживайте процесс решения проблемы по персональной ссылке",
        categories_label: "Категории",
        categories_title: "Какие проблемы мы решаем",
        categories_subtitle: "От дорог до освещения — мы охватываем все основные городские проблемы",
        cat_potholes: "Дорожные ямы",
        cat_potholes_desc: "Повреждение дорожного покрытия, ямы, трещины",
        cat_lighting: "Освещение",
        cat_lighting_desc: "Неработающие фонари, отсутствие освещения, мерцание",
        cat_trash: "Мусорные свалки",
        cat_trash_desc: "Незаконные свалки, переполненные мусорные баки",
        cat_water: "Утечки воды",
        cat_water_desc: "Прорыв труб, затопления, утечки",
        cat_infra: "Поврежденная инфраструктура",
        cat_infra_desc: "Скамейки, ограждения, дорожные знаки, плитка",
        cat_graffiti: "Граффити",
        cat_graffiti_desc: "Незаконные надписи и рисунки",
        cat_trees: "Опасные деревья",
        cat_trees_desc: "Упавшие деревья, опасные ветви, корни",
        cat_other: "И другие",
        cat_other_desc: "Все другие городские проблемы",
        benefits_label: "Преимущества",
        benefits_title: "Почему это работает",
        benefits_subtitle: "Три ключевых преимущества нашей системы",
        benefit1_title: "Автоматическая маршрутизация",
        benefit1_desc: "ИИ автоматически определяет тип проблемы и направляет обращение в нужное ведомство без задержек и ошибок.",
        benefit2_title: "Прозрачный контроль",
        benefit2_desc: "Отслеживайте статус обращения в реальном времени. Полная история изменений доступна по уникальной ссылке.",
        benefit3_title: "Быстрая реакция",
        benefit3_desc: "Мгновенное уведомление ответственных служб. Высокий приоритет для критических проблем.",
        cta_title: "Готовы сделать город лучше?",
        cta_subtitle: "Одно фото может запустить процесс решения проблемы",
        
        // report_form.html
        report_title: "Сообщить о проблеме",
        report_subtitle: "Сделайте фото или загрузите из галереи — точное местоположение и адрес определятся автоматически",
        photo_source_label: "Источник и съёмка фото",
        take_photo: "Сделать фото",
        take_photo_hint: "Сделайте сразу камерой (точный GPS)",
        upload_photo: "Загрузить фото",
        upload_photo_hint: "Выберите из галереи (GPS метаданные)",
        upload_text_camera: "Нажмите, чтобы открыть камеру и сделать фото",
        upload_hint_camera: "Точные GPS координаты будут записаны в момент съёмки",
        upload_text_gallery: "Нажмите для выбора из галереи или файлов",
        upload_hint_gallery: "GPS метаданные из изображения будут прочитаны автоматически",
        change_photo: "Сменить фото",
        address_label: "Адрес проблемы и точное местоположение",
        address_placeholder: "Например: ул. Низами, 45, район Ясамал",
        current_location: "Текущее местоположение",
        map_title: "Карта точного местоположения",
        map_hint: "Вы можете уточнить точку, нажав на карту",
        description_label: "Описание проблемы",
        description_placeholder: "Опишите проблему подробнее: когда возникла, насколько критична и т.д.",
        email_label: "Адрес эл. почты",
        email_optional: "(необязательно)",
        email_placeholder: "Для получения уведомлений при изменении статуса обращения",
        email_hint: "При заполнении вы получите письмо при изменении статуса.",
        submit_btn: "Отправить обращение",
        
        // tracking.html
        tracking_title: "Отслеживание обращения",
        email_notification_text: "Уведомления будут отправлены на {email} при изменении статуса.",
        request_id: "Обращение",
        label_category: "Категория",
        label_priority: "Приоритет",
        label_department: "Ведомство",
        label_address: "Адрес",
        label_photo_source: "Источник фото",
        label_gps_verified: "GPS верификация",
        gps_exif_verified: "Подтверждено EXIF метаданными",
        label_device: "Устройство",
        label_created: "Создано",
        not_determined: "Не определено",
        not_assigned: "Не назначено",
        location_title: "Местоположение",
        ai_classification: "AI Классификация",
        ai_category: "Категория",
        ai_confidence: "Уверенность",
        status_history: "История статусов",
        history_empty: "История пока пуста",
        bookmark_hint: "Сохраните эту страницу для отслеживания статуса в любое время",
        report_location: "Местоположение обращения",
        
        // department.html
        dept_portal: "Портал ведомства",
        dept_portal_desc: "Просмотр и обновление статуса обращения",
        dept_request_id: "ID обращения",
        label_coordinates: "Координаты",
        update_status: "Обновить статус",
        new_status: "Новый статус",
        comment_label: "Комментарий",
        comment_placeholder: "Добавьте комментарий об изменении статуса...",
        changes_history: "История изменений",
        
        // test_email.html
        email_test_title: "Тест системы эл. почты",
        email_test_subtitle: "Проверка подключения Gmail SMTP",
        email_success: "Письмо успешно отправлено!",
        email_check_inbox: "Проверьте входящие.",
        email_failed: "Отправка не удалась",
        email_test_desc: "Введите email для отправки теста. Это подтвердит работу SMTP подключения Gmail.",
        email_address_label: "Адрес эл. почты",
        send_test_email: "Отправить тестовое письмо",
        smtp_config: "Конфигурация SMTP",
        back_home: "На главную",
        
        // Page titles
        page_title_home: "CityAssist — Умный город начинается с вас",
        page_title_report: "Сообщить о проблеме — CityAssist",
        page_title_tracking: "Отслеживание обращения — CityAssist",
        page_title_dept: "Портал ведомства — CityAssist",
        page_title_email_test: "Тест эл. почты — CityAssist",
        
        // Language switcher labels
        lang_az: "AZ",
        lang_en: "EN",
        lang_ru: "RU"
    }
};

const STORAGE_KEY = 'cityassist_lang';
const DEFAULT_LANG = 'az';

/**
 * Get current language
 * @returns {string} Language code
 */
function getLanguage() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
}

/**
 * Set application language
 * @param {string} lang Language code ('az', 'en', 'ru')
 */
function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) {
        console.warn(`Language ${lang} not supported, falling back to ${DEFAULT_LANG}`);
        lang = DEFAULT_LANG;
    }
    
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    applyTranslations();
}

/**
 * Translate a key
 * @param {string} key Translation key
 * @returns {string} Translated string or key if not found
 */
function t(key) {
    const lang = getLanguage();
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        return TRANSLATIONS[lang][key];
    }
    // Fallback to default language
    if (TRANSLATIONS[DEFAULT_LANG] && TRANSLATIONS[DEFAULT_LANG][key]) {
        return TRANSLATIONS[DEFAULT_LANG][key];
    }
    return key;
}

/**
 * Apply translations to the DOM
 */
function applyTranslations() {
    // Basic text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            el.textContent = t(key);
        }
    });
    
    // HTML content
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (key) {
            el.innerHTML = t(key);
        }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
            el.placeholder = t(key);
        }
    });

    // Titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
            el.title = t(key);
        }
    });
    
    // Page title translation if requested
    if (document.title && document.body.hasAttribute('data-i18n-page-title')) {
        const titleKey = document.body.getAttribute('data-i18n-page-title');
        if (titleKey) {
            document.title = t(titleKey);
        }
    }
}

// Export to window
window.t = t;
window.I18N = {
    TRANSLATIONS,
    getLanguage,
    setLanguage,
    t,
    applyTranslations
};

// Auto-apply on load
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = getLanguage();
    applyTranslations();
});
