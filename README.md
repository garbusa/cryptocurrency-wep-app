# automated crypto web app news and portfolio manager

Install Requirements
-----------------------
pip install -r requirements in \blockcontainer_django

Migrate Database
-----------------------
manage.py makemigrations
manage.py migrate

Starting Django
-----------------------
manage.py runserver in \blockcontainer_django

Starting React.JS
-----------------------
npm run start in \frontend\blockcontainer

Starting Redis
-----------------------
For celery tasks start .exe in backend/Redis

Celery Commands
-----------------------
Starting the worker:\n
celery -A blockcontainer worker --pool=solo -l info\n
Periodic tasks:\n
celery -A blockcontainer beat

Informations
-----------------------
Database used PostgreSQL. There you have to edit the database settings in settings.py
