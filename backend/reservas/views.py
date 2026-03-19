from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import render
from .models import Box, Especialista, OfertaEspecialista, Paciente, Horario
from .serializers import BoxSerializer, EspecialistaSerializer, HorarioEspecialistaSerializer, HorarioPacienteSerializer, OfertaEspecialistaSerializer, PacienteSerializer, HorarioSerializer
from rest_framework import status


class BoxViewSet(viewsets.ModelViewSet):
    queryset = Box.objects.all()
    serializer_class = BoxSerializer

    @action(detail=False, methods=['get'], url_path='disponibles')
    def disponibles(self, request):
        disponibles = self.queryset.filter(estado='disponible')
        serializer = self.get_serializer(disponibles, many=True)
        return Response(serializer.data)
    
class AgendaEspecialistasAPIView(APIView):
    def get(self, request):
        horarios = Horario.objects.select_related('especialista', 'box').all()

        # Puedes agregar filtros por GET si quieres
        especialista = request.GET.get('especialista')
        especialidad = request.GET.get('especialidad')
        piso = request.GET.get('piso')
        box = request.GET.get('box')

        if especialista:
            horarios = horarios.filter(especialista__nombre__icontains=especialista)
        if especialidad:
            horarios = horarios.filter(especialista__especialidad__icontains=especialidad)
        if piso:
            horarios = horarios.filter(box__piso=piso)
        if box:
            horarios = horarios.filter(box__numero=box)

        serializer = HorarioEspecialistaSerializer(horarios, many=True)
        return Response(serializer.data)

class EspecialistaViewSet(viewsets.ModelViewSet):
    queryset = Especialista.objects.all()
    serializer_class = EspecialistaSerializer

    def get_queryset(self):
        estado = self.request.GET.get('estado')
        if estado:
            return Especialista.objects.filter(estado=estado)
        return super().get_queryset()
    #@action(detail=False, methods=['get'], url_path='disponibles')
    #def disponibles(self, request):
     #   disponibles = self.queryset.filter(estado='Disponible')
      #  serializer = self.get_serializer(disponibles, many=True)
       # return Response(serializer.data)

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

class HorarioPacienteAPIView(APIView):
    def get(self, request):
        qs = Horario.objects.select_related('paciente', 'especialista', 'box').filter(paciente__isnull=False)

        # Filtros opcionales
        nombre = request.GET.get('nombre')
        rut = request.GET.get('rut')
        box = request.GET.get('box')
        especialidad = request.GET.get('especialidad')
        especialista = request.GET.get('especialista')
        piso = request.GET.get('piso')

        if nombre:
            qs = qs.filter(paciente__nombre__icontains=nombre)
        if rut:
            qs = qs.filter(paciente__rut__icontains=rut)
        if box:
            qs = qs.filter(box__numero=box)
        if especialidad:
            qs = qs.filter(especialista__especialidad__icontains=especialidad)
        if especialista:
            qs = qs.filter(especialista__nombre__icontains=especialista)
        if piso:
            qs = qs.filter(box__piso=piso)

        serializer = HorarioPacienteSerializer(qs, many=True)
        return Response(serializer.data)

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

    @action(detail=True, methods=['post'])
    def asignar(self, request, pk=None):
        horario = self.get_object()
        paciente_id = request.data.get('paciente')

        if not paciente_id:
            return Response({'error': 'Se requiere paciente'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            paciente = Paciente.objects.get(id=paciente_id)
        except Paciente.DoesNotExist:
            return Response({'error': 'Paciente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        horario.paciente = paciente
        horario.disponible = False
        horario.save()
        return Response({'mensaje': 'Paciente asignado correctamente'})
    
@api_view(['GET'])
def especialistas_disponibles(request):
    horarios_disponibles = Horario.objects.filter(disponible=True)
    ids_especialistas = horarios_disponibles.values_list('especialista', flat=True).distinct()
    especialistas = Especialista.objects.filter(id__in=ids_especialistas)
    serializer = EspecialistaSerializer(especialistas, many=True)
    return Response(serializer.data)

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

class OfertaEspecialistaViewSet(viewsets.ModelViewSet):
    queryset = OfertaEspecialista.objects.all()
    serializer_class = OfertaEspecialistaSerializer
    
    def get_queryset(self):
        """
        Filtrado con validación de parámetros para evitar errores de conversión
        """
        queryset = OfertaEspecialista.objects.all()
        
        # Filtro por especialista_id con validación
        especialista_id = self.request.query_params.get('especialista_id')
        if especialista_id:
            try:
                especialista_id = int(especialista_id)
                queryset = queryset.filter(especialista_id=especialista_id)
            except (ValueError, TypeError):
                # Si no es un número válido, ignorar el filtro
                pass
        
        # Filtro por estado
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)
        
        # Filtro por especialidad
        especialidad = self.request.query_params.get('especialidad')
        if especialidad:
            queryset = queryset.filter(especialidad__icontains=especialidad)
        
        return queryset
    