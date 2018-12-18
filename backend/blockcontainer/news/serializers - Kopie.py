from rest_framework import serializers
from .models import Keyword, AllowedKeyword, Feed, Coin #User, 
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueTogetherValidator

import json
import requests
#from .backends import EmailBackend

#validator for keyword <-> allowed_keyword
def allow_keyword(key):

	if AllowedKeyword.objects.filter(allowed_keyword=key).exists():
		return key
	else:
		raise serializers.ValidationError('This keyword is not allowed!')

def allow_coin(coin):
    check_coin_url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms={}&tsyms=USD"
    res = requests.get(check_coin_url.format(coin)).json()
    if "Response" in res:
        if res["Response"] == "Error":
                raise serializers.ValidationError('This coin does not exists!')
        return coin
    else:
        return coin

class KeywordSerializer(serializers.ModelSerializer):
	keyword = serializers.CharField(max_length=255, validators=[allow_keyword])

	class Meta:
		model = Keyword
		fields = ('id', 'keyword', )

	def validate(self, data):
		if Keyword.objects.filter(keyword=data['keyword'], owner=self.context['request'].user).exists():
			raise serializers.ValidationError("You already have added this keyword!")
		return data

class CoinSerializer(serializers.ModelSerializer):
    coin = serializers.CharField(max_length=255, validators=[allow_coin])

    class Meta:
        model = Coin
        fields = ('id', 'coin', 'quantity', 'buy_price', )

    def validate(self, data):
        if Coin.objects.filter(coin=data['coin'], owner=self.context['request'].user).exists():
            raise serializers.ValidationError("This coin is already in your portfolio!")
        return data
	
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        None,
                                        validated_data['password'])
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class AllowedKeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AllowedKeyword
        fields = ('id', 'allowed_keyword')


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")

class FeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feed
        fields = ('id', 'title', 'url', 'publisher', 'pubDate', 'timestamp', 'description', 'language', 'keywords')