from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Dealer, Review, CarMake

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "password"]
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email"]

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    class Meta:
        model = Review
        fields = ["id", "dealer", "username", "text", "rating", "created_at"]
        read_only_fields = ["id", "dealer", "username", "created_at"]

class DealerSerializer(serializers.ModelSerializer):
    reviews_count = serializers.SerializerMethodField()
    class Meta:
        model = Dealer
        fields = ["id", "name", "address", "city", "state", "zip_code",
                  "phone", "website", "image_url", "reviews_count"]
    def get_reviews_count(self, obj):
        return obj.reviews.count()

class CarMakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarMake
        fields = ["id", "make", "models"]
