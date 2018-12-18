from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.core.exceptions import ValidationError
import json

from knox.models import AuthToken

from .models import AllowedKeyword, Feed, Coin
from rest_framework.exceptions import MethodNotAllowed

from .serializers import (KeywordSerializer, CreateUserSerializer,
                          UserSerializer, LoginUserSerializer, AllowedKeywordSerializer, FeedSerializer, CoinSerializer)

from django.contrib.auth.models import User

import requests
import re

class FeedViewSet(generics.ListAPIView):
    serializer_class = FeedSerializer
    queryset = Feed.objects.all()

class KeywordViewSet(viewsets.ModelViewSet):
	permission_classes = [permissions.IsAuthenticated, ]
	serializer_class = KeywordSerializer

	def get_queryset(self):
		return self.request.user.keywords.all()

	def perform_create(self, serializer):
		serializer.save(owner=self.request.user)

class AllowedKeywordViewSet(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = AllowedKeywordSerializer
    queryset = AllowedKeyword.objects.all()

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer


    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class ListPrices(APIView):
    def get(self, request, format="json"):
        cmc = "https://api.coinmarketcap.com/v2/ticker/"
        r2 = requests.get(cmc).json()
        return Response(r2)

class CoinViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = CoinSerializer

    def get_queryset(self):
        return self.request.user.coins.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
