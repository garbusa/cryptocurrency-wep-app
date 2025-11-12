# Simple news aggregator and portfolio manager for crypto currencies

This project contains a web app which fetches news from different sources, a list of the top cryptocurrencies and its own portfolio manager.

Install Requirements
-----------------------
```
pip install -r requirements in \blockcontainer_django
```

Migrate Database
-----------------------
```
manage.py makemigrations
manage.py migrate
```

Starting Django
-----------------------
```
manage.py runserver 
```

Starting React.JS
-----------------------
in \frontend\blockcontainer
```
npm run start 
```

Starting Redis
-----------------------
For celery tasks start .exe in backend/Redis or use your own instance

Celery Commands
-----------------------
Starting the worker:  
```
celery -A blockcontainer worker --pool=solo -l info  
```
Periodic tasks:  
```
celery -A blockcontainer beat
```

Information
-----------------------
In my case i use PostgreSQL, therefore you have to edit your database settings in the settings.py

