from rest_framework import serializers
from .models import Box, Especialista, Paciente, Horario

class BoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Box
        fields = '__all__'

class EspecialistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialista
        fields = '__all__'

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'
