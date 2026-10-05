from django.contrib import admin
from django.urls import path, include

from dealers.views import (
    djangoapp_login,
    djangoapp_logout,
    dealer_reviews,
)


urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # Existing REST API
    path("api/", include("dealers.urls")),

    # IBM Capstone Login
    path(
        "djangoapp/login",
        djangoapp_login,
        name="djangoapp_login",
    ),

    # IBM Capstone Logout
    path(
        "djangoapp/logout",
        djangoapp_logout,
        name="djangoapp_logout",
    ),

    # IBM Capstone Reviews
    path(
        "fetchReviews/dealer/<int:dealer_id>",
        dealer_reviews,
        name="fetch_reviews_dealer",
    ),
]