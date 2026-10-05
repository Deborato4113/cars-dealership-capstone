from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from dealers.models import Dealer, Review, CarMake

class Command(BaseCommand):
    help = "Seed demo dealership data"

    def handle(self, *args, **options):
        demo, created = User.objects.get_or_create(username="demo")
        if created:
            demo.set_password("Demo@123")
            demo.first_name = "Demo"
            demo.last_name = "User"
            demo.email = "demo@example.com"
            demo.save()

        dealers = [
            {
                "name":"Kansas City Motors","address":"1200 Main Street","city":"Kansas City",
                "state":"Kansas","zip_code":"66101","phone":"913-555-0101",
                "website":"https://example.com","image_url":"https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80"
            },
            {
                "name":"Wichita Auto Center","address":"2400 East Central","city":"Wichita",
                "state":"Kansas","zip_code":"67214","phone":"316-555-0102",
                "website":"https://example.com","image_url":"https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80"
            },
            {
                "name":"Denver Auto Group","address":"800 Lincoln Avenue","city":"Denver",
                "state":"Colorado","zip_code":"80203","phone":"303-555-0103",
                "website":"https://example.com","image_url":"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80"
            },
        ]
        for data in dealers:
            Dealer.objects.get_or_create(name=data["name"], defaults=data)

        for make, models in [
            ("Toyota", ["Camry","Corolla","RAV4"]),
            ("Honda", ["Civic","Accord","CR-V"]),
            ("Ford", ["Mustang","F-150","Explorer"]),
            ("Chevrolet", ["Malibu","Equinox","Tahoe"]),
        ]:
            CarMake.objects.get_or_create(make=make, defaults={"models": models})

        dealer = Dealer.objects.first()
        if dealer and not Review.objects.filter(dealer=dealer).exists():
            Review.objects.create(dealer=dealer, user=demo, text="Fantastic services", rating=5)

        self.stdout.write(self.style.SUCCESS("Seed data created successfully."))
        self.stdout.write("Demo login: username=demo password=Demo@123")
