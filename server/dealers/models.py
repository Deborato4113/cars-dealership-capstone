from django.db import models
from django.contrib.auth.models import User


class Dealer(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=300)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    phone = models.CharField(max_length=30)
    website = models.URLField(blank=True)
    image_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.name} - {self.city}, {self.state}"


class Review(models.Model):
    dealer = models.ForeignKey(
        Dealer,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    text = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    # IBM Capstone review fields
    purchase = models.BooleanField(default=True)
    purchase_date = models.DateField(null=True, blank=True)
    car_make = models.CharField(max_length=100, blank=True)
    car_model = models.CharField(max_length=100, blank=True)
    car_year = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.dealer.name}: {self.text[:40]}"


class CarMake(models.Model):
    make = models.CharField(max_length=100)
    models = models.JSONField(default=list)

    def __str__(self):
        return self.make