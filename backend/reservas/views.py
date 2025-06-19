from rest_framework import viewsets
from django.shortcuts import render
from .models import Box, Especialista, Paciente, Horario
from .serializers import BoxSerializer, EspecialistaSerializer, PacienteSerializer, HorarioSerializer

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

def home_view(request):
    return render(request, 'reservas/index.html')