from django.db import models
# from django.contrib.auth.models import AbstractBaseUser
# from django.contrib.auth.models import BaseUserManager
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

class AllowedKeyword(models.Model):
	allowed_keyword = models.CharField(max_length=255, null=True, default=None, blank=True)
	def __str__(self):
		return str(self.allowed_keyword)


class Keyword(models.Model):
	#keyword = models.ForeignKey(AllowedKeyword, on_delete=models.CASCADE, null=True, blank=True)	
	keyword = models.CharField(max_length=255, null=True, blank=True)
	owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='keywords') # owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='keywords')

	def __str__(self):
		return str(self.keyword)

	class Meta:
	 	unique_together = ('keyword', 'owner')

class Coin(models.Model):
	#keyword = models.ForeignKey(AllowedKeyword, on_delete=models.CASCADE, null=True, blank=True)	
	coin = models.CharField(max_length=255, null=True, blank=True)
	owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='coins') # owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='keywords')
	quantity = models.DecimalField(max_digits=255, decimal_places=8)
	buy_price = models.DecimalField(max_digits=255, decimal_places=8)
	notice = models.CharField(max_length=500, null=True, blank=True)

	def __str__(self):
		return str(self.coin)
		
	# class Meta:
	#  	unique_together = ('coin', 'owner')

class Feed(models.Model):
    title = models.TextField()
    url = models.TextField()
    publisher = models.TextField()
    pubDate = models.TextField()
    timestamp = models.TextField()
    description = models.TextField(default="en")
    language = models.CharField(max_length=10)
    keywords = ArrayField(models.CharField(max_length=200), blank=True)

# class UserManager(BaseUserManager):
#     def create_user(self, email, password=None, is_active=True, is_staff=False, is_admin=False): # , keyword=None 
#         if not email:
#             raise ValueError("Users must have an email address")
#         if not password:
#             raise ValueError("Users must have a password")
#         user_obj = self.model(
#             email = self.normalize_email(email),
#         )
#         user_obj.set_password(password) # change user password
#         user_obj.staff = is_staff
#         user_obj.admin = is_admin
#         user_obj.is_active = is_active
#         user_obj.save(using=self._db)
#         #user_obj.keyword.set([])
#         return user_obj

#     def create_staffuser(self, email, password=None):
#         user = self.create_user(
#                 email,
#                 password=password,
#                 is_staff=True
#         )
#         return user

#     def create_superuser(self, email, password=None):
#         user = self.create_user(
#                 email,
#                 password=password,
#                 is_staff=True,
#                 is_admin=True
#         )
#         return user

# class User(AbstractBaseUser):
#     email       = models.EmailField(max_length=255, unique=True)
#     #keyword 	= models.ManyToManyField(Keyword)
#     is_active   = models.BooleanField(default=True) # can login 
#     staff       = models.BooleanField(default=False) # staff user non superuser
#     admin       = models.BooleanField(default=False) # superuser 

#     USERNAME_FIELD = 'email' #username
#     REQUIRED_FIELDS = [] #['full_name'] #python manage.py createsuperuser

#     objects = UserManager()

#     def __str__(self):
#         return self.email

#     def has_perm(self, perm, obj=None):
#     	return True

#     def has_module_perms(self, app_label):
#         return True

#     @property
#     def is_staff(self):
#         if self.is_admin:
#             return True
#         return self.staff

#     @property
#     def is_admin(self):
#         return self.admin

