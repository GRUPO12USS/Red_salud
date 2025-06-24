from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import render
from .models import Box, Especialista, Paciente, Horario
from .serializers import BoxSerializer, EspecialistaSerializer, PacienteSerializer, HorarioSerializer
from rest_framework import status


class BoxViewSet(viewsets.ModelViewSet):
    queryset = Box.objects.all()
    serializer_class = BoxSerializer

class EspecialistaViewSet(viewsets.ModelViewSet):
    queryset = Especialista.objects.all()
    serializer_class = EspecialistaSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer

    def get_queryset(self):
        queryset = Horario.objects.all()

        # Filtros GET: /api/horarios/?disponible=true&fecha=2025-06-20&box=1
        disponible = self.request.query_params.get('disponible')
        fecha = self.request.query_params.get('fecha')
        box_id = self.request.query_params.get('box')

        if disponible is not None:
            queryset = queryset.filter(disponible=(disponible.lower() == 'true'))
        if fecha:
            queryset = queryset.filter(fecha=fecha)
        if box_id:
            queryset = queryset.filter(box__id=box_id)

        return queryset
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        horario = self.get_object()
        horario.paciente = None
        horario.disponible = True
        horario.save()
        return Response({'mensaje': 'Reserva cancelada correctamente'})

class ReporteView(APIView):
    def get(self, request):
        total_boxes = Box.objects.count()
        disponibles = Box.objects.filter(estado='disponible').count()
        ocupados = Box.objects.filter(estado='ocupado').count()
        total_horarios = Horario.objects.count()
        disponibles_horarios = Horario.objects.filter(disponible=True).count()

        return Response({
            'boxes_totales': total_boxes,
            'boxes_disponibles': disponibles,
            'boxes_ocupados': ocupados,
            'horarios_totales': total_horarios,
            'horarios_disponibles': disponibles_horarios,
        })
def home_view(request):
    return render(request, 'reservas/index.html')

class BoxViewSet(viewsets.ModelViewSet):
    queryset = Box.objects.all()
    serializer_class = BoxSerializer

    def create(self, request, *args, **kwargs):
        print("=== Entrada a create ===")
        print("Payload recibido:", request.data)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Errores de validación:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        print("Box creado con éxito:", serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)