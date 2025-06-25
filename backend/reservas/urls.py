from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgendaEspecialistasAPIView, BoxViewSet, EspecialistaViewSet, HorarioPacienteAPIView, OfertaEspecialistaViewSet, PacienteViewSet, HorarioViewSet, ReporteView

router = DefaultRouter()
router.register(r'boxes', BoxViewSet)
router.register(r'especialistas', EspecialistaViewSet)
router.register(r'pacientes', PacienteViewSet)
router.register(r'horarios', HorarioViewSet)
router.register(r'ofertas', OfertaEspecialistaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/', include(router.urls)),
    path('reporte/', ReporteView.as_view(), name='reporte'),
    path('api/agenda-especialistas/', AgendaEspecialistasAPIView.as_view(), name='agenda-especialistas'),
    path('api/especialistas-disponibles/', views.especialistas_disponibles),
    path('api/especialistas/', EspecialistaViewSet.as_view({'get': 'list'})),
    path('api/agenda-pacientes/', HorarioPacienteAPIView.as_view(), name='agenda-pacientes'),
]