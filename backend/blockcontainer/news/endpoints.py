from django.conf.urls import include, url
from rest_framework import routers

from .api import KeywordViewSet, RegistrationAPI, LoginAPI, UserAPI, AllowedKeywordViewSet, FeedViewSet, ListPrices, CoinViewSet

router = routers.DefaultRouter()
router.register('keywords', KeywordViewSet, 'keywords')
router.register('coins', CoinViewSet, 'coins')


urlpatterns = [
    url("^", include(router.urls)),
    url("^news/", FeedViewSet.as_view()),
    url("^prices/", ListPrices.as_view()),
    url("^allowedkeywords/", AllowedKeywordViewSet.as_view()),
    url("^auth/register/$", RegistrationAPI.as_view()),
    url("^auth/login/$", LoginAPI.as_view()),
    url("^auth/user/$", UserAPI.as_view()),
]
