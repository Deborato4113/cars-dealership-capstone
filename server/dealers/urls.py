from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register),
    path("login/", views.login_user),
    path("logout/", views.logout_user),
    path("dealers/", views.dealers),
    path("dealers/<int:dealer_id>/", views.dealer_by_id),
    path("dealers/state/<str:state>/", views.dealers_by_state),
    path("dealers/<int:dealer_id>/reviews/", views.dealer_reviews),
    path("dealers/<int:dealer_id>/reviews/add/", views.add_review),
    path("carmakes/", views.car_makes),
    path("analyze-review/", views.analyze_review),
]
