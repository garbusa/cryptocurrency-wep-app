import os
from celery import Celery
from celery.schedules import crontab


# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blockcontainer.settings')

app = Celery('blockcontainer')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'update-news-every-fifth-minute': {
        'task': 'news.tasks.updateNews',
        'schedule': 300.0,  # change to `crontab(minute=0, hour=0)` if you want it to run daily at midnight
    },
     'update-news-every-tenth-minute': {
        'task': 'news.tasks.updateCoinScribble',
        'schedule': 200.0,  # change to `crontab(minute=0, hour=0)` if you want it to run daily at midnight
    },
}