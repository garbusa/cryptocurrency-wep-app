# from django.conf import settings
# User = settings.AUTH_USER_MODEL

# class EmailBackend:

# 	def authenticate(self, username=None, password=None, **kwargs):
# 		try:
# 			user = User.objects.get(email=username)
# 		except User.MultipleObjectReturned:
# 			user = User.objects.filter(email=username).order_by('id')[0]
# 		except User.DoesNotExist:
# 			return None

# 		if getattr(user, 'is_active') and user.check_password(password):
# 			return user

# 		return None

# 	def get_user(self, user_id):
# 		try:
# 			return User.objects.get(pk=user_id)
# 		except User.DoesNotExist:
# 			return None