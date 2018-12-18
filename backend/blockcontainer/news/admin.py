from django.contrib import admin
from .models import Keyword, AllowedKeyword
# Register your models here.
admin.site.register(Keyword)
admin.site.register(AllowedKeyword)