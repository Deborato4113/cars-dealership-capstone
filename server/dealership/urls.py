from django.contrib import admin
from django.urls import path, include
from dealers.views import djangoapp_login

urlpatterns = [
    path("admin/", admin.site.urls),

    # Existing API routes
    path("api/", include("dealers.urls")),

    # IBM Full-Stack Developer Capstone endpoint
    path("djangoapp/login", djangoapp_login, name="djangoapp_login"),
]