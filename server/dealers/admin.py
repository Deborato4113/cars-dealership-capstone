from django.contrib import admin
from .models import Dealer, Review, CarMake

@admin.register(Dealer)
class DealerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "city", "state", "phone")

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "dealer", "user", "rating", "created_at")

@admin.register(CarMake)
class CarMakeAdmin(admin.ModelAdmin):
    list_display = ("id", "make")
