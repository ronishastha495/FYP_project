
from pathlib import Path
from django.contrib.messages import constants as messages
from datetime import timedelta
from django.conf import settings


MESSAGE_TAGS = {
    messages.DEBUG: 'alert-info',  # Custom class for debug messages
    messages.INFO: 'alert-info',    # Bootstrap info color
    messages.SUCCESS: 'alert-success',  # Bootstrap success color
    messages.WARNING: 'alert-warning',  # Bootstrap warning color
    messages.ERROR: 'alert-danger',  # Bootstrap danger color
}

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-ac&6&%501p*wy=-5dnzxc11mk&(0tf%=3z*c#+_xdmcv!or6x*'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'daphne',
    'channels' ,
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    # 'users', 
    'autocare',
    'chat.apps.ChatConfig',
    'account'
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "https://localhost:3000"
]

CORS_ALLOW_CREDENTIALS= True

REST_FRAMEWORk = {
    'DEFAULT_AUTHENTICATION_CLASSES': (   'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

 
CORS_ALLOWED_ORIGINS =[
    "http://localhost:5173"
]

# Allow Authorization header for frontend
CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
    "accept",
]

# AUTH_USER_MODEL = 'users.User'
AUTH_USER_MODEL = 'account.User'

ROOT_URLCONF = 'auth.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'auth.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'autocare_service',  # Replace with your database name
        'USER': 'root',  # Replace with your database username
        'PASSWORD': 'H$ky#9F2w1!j',  # Replace with your database password
        'HOST': 'localhost',  # Typically 'localhost' or an IP address
        'PORT': '3306',  # Typically 3306 for MySQL
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

ASGI_APPLICATION = 'auth.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}
