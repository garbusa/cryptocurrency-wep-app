# automated crypto web app news and portfolio manager

Blockcontainer.io

At first you need to activate the virtual env or just create on your own
\backend\blockcontainer_django\Scripts activate

Install Requirements
pip install -r requirements in \blockcontainer_django

Starting Django
manage.py runserver in \blockcontainer_django

Starting React.JS
npm run start in \frontend\blockcontainer

Starting Redis for celery tasks start .exe in backend/Redis

Celery Commands
Starting the worker:
celery -A blockcontainer worker --pool=solo -l info
Periodic tasks:
celery -A blockcontainer beat