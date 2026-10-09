# Деплой CityAssist в Coolify

## 1. Подготовка
1. Запушьте проект в GitHub/GitLab (`.env`, `db.sqlite3`, `media/` в git не попадают).
2. Сгенерируйте SECRET_KEY:
   `python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"`

## 2. База данных (рекомендуется PostgreSQL)
Coolify → Project → **+ New** → **Database** → PostgreSQL. Скопируйте Internal URL/хост, пользователя, пароль.

## 3. Приложение
Coolify → **+ New** → **Application** → репозиторий → Build Pack: **Dockerfile**, порт **8000**, домен `https://your-domain.com`.

## 4. Переменные окружения
```
DEBUG=false
SECRET_KEY=<сгенерированный>
ALLOWED_HOSTS=your-domain.com
CSRF_TRUSTED_ORIGINS=https://your-domain.com
SITE_URL=https://your-domain.com
USE_POSTGRES=true
DB_NAME=...  DB_USER=...  DB_PASSWORD=...  DB_HOST=<хост БД в Coolify>  DB_PORT=5432
OPENAI_API_KEY=...
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com  EMAIL_PORT=587  EMAIL_USE_TLS=true
EMAIL_HOST_USER=...  EMAIL_HOST_PASSWORD=...  DEFAULT_FROM_EMAIL=...
```
Без PostgreSQL: `SQLITE_PATH=/app/data/db.sqlite3` и volume на `/app/data`.

## 5. Постоянное хранилище
В Persistent Storage добавьте volume на `/app/media` (фото обращений). Без него фото пропадут при редеплое.

## 6. Деплой и админ
Нажмите **Deploy**. Миграции применяются автоматически при старте.
Создайте админа: приложение → **Terminal** → `python manage.py createsuperuser`.
Демо-данные (необязательно): `python manage.py seed_data`.

## Примечания
- HTTPS обеспечивает Coolify (Traefik), Django доверяет заголовку `X-Forwarded-Proto`.
- Медиа отдаёт Django (`django.views.static.serve`): для хакатона достаточно, для нагрузки лучше S3/nginx.
- Nominatim (геокодер) блокирует запросы из браузера; для адреса по GPS нужен серверный прокси.
