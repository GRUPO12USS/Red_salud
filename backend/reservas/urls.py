from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BoxViewSet, EspecialistaViewSet, PacienteViewSet, HorarioViewSet

router = DefaultRouter()
router.register(r'boxes', BoxViewSet)
router.register(r'especialistas', EspecialistaViewSet)
router.register(r'pacientes', PacienteViewSet)
router.register(r'horarios', HorarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
