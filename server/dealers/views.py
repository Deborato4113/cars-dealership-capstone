from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Dealer, Review, CarMake
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ReviewSerializer,
    DealerSerializer,
    CarMakeSerializer,
)


# =========================
# REGISTER
# =========================

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# =========================
# EXISTING REACT LOGIN
# =========================

@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)

    return Response({
        "message": "Login successful",
        "user": UserSerializer(user).data
    })


# =========================
# IBM CAPSTONE LOGIN
# POST /djangoapp/login
# =========================

@api_view(["POST"])
@permission_classes([AllowAny])
def djangoapp_login(request):
    username = request.data.get("userName")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {
                "userName": "",
                "status": "Authentication Failed"
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {
                "userName": "",
                "status": "Authentication Failed"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)

    return Response({
        "userName": user.username,
        "status": "Authenticated"
    })


# =========================
# LOGOUT
# =========================

@api_view(["POST"])
def logout_user(request):
    logout(request)

    return Response({
        "message": "Logout successful"
    })


# =========================
# DEALERS
# =========================

@api_view(["GET"])
def dealers(request):
    state = request.query_params.get("state")

    if state:
        dealers = Dealer.objects.filter(
            state__iexact=state
        )
    else:
        dealers = Dealer.objects.all()

    return Response(
        DealerSerializer(
            dealers,
            many=True
        ).data
    )


# =========================
# DEALER BY ID
# =========================

@api_view(["GET"])
def dealer_by_id(request, dealer_id):
    try:
        dealer = Dealer.objects.get(id=dealer_id)

    except Dealer.DoesNotExist:
        return Response(
            {"error": "Dealer not found"},
            status=404
        )

    return Response(
        DealerSerializer(dealer).data
    )


# =========================
# DEALERS BY STATE
# =========================

@api_view(["GET"])
def dealers_by_state(request, state):
    qs = Dealer.objects.filter(
        state__iexact=state
    )

    return Response(
        DealerSerializer(
            qs,
            many=True
        ).data
    )


# =========================
# DEALER REVIEWS
# =========================

@api_view(["GET"])
def dealer_reviews(request, dealer_id):
    reviews = Review.objects.filter(
        dealer_id=dealer_id
    ).order_by("-created_at")

    return Response(
        ReviewSerializer(
            reviews,
            many=True
        ).data
    )


# =========================
# ADD REVIEW
# =========================

@api_view(["POST"])
def add_review(request, dealer_id):

    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=401
        )

    try:
        dealer = Dealer.objects.get(
            id=dealer_id
        )

    except Dealer.DoesNotExist:
        return Response(
            {"error": "Dealer not found"},
            status=404
        )

    text = request.data.get(
        "text",
        ""
    ).strip()

    rating = int(
        request.data.get(
            "rating",
            5
        )
    )

    if not text:
        return Response(
            {"error": "Review text is required"},
            status=400
        )

    review = Review.objects.create(
        dealer=dealer,
        user=request.user,
        text=text,
        rating=rating
    )

    return Response(
        ReviewSerializer(review).data,
        status=201
    )


# =========================
# CAR MAKES
# =========================

@api_view(["GET"])
def car_makes(request):
    return Response(
        CarMakeSerializer(
            CarMake.objects.all(),
            many=True
        ).data
    )


# =========================
# REVIEW SENTIMENT
# =========================

@api_view(["POST"])
def analyze_review(request):

    text = request.data.get(
        "text",
        ""
    )

    positive_words = {
        "fantastic",
        "excellent",
        "great",
        "good",
        "amazing",
        "wonderful",
        "helpful",
        "friendly",
        "best",
        "love"
    }

    negative_words = {
        "bad",
        "terrible",
        "poor",
        "awful",
        "worst",
        "horrible",
        "rude",
        "hate"
    }

    words = {
        w.strip(".,!?").lower()
        for w in text.split()
    }

    score = (
        len(words & positive_words)
        - len(words & negative_words)
    )

    sentiment = (
        "positive"
        if score > 0
        else "negative"
        if score < 0
        else "neutral"
    )

    return Response({
        "text": text,
        "sentiment": sentiment,
        "score": score
    })