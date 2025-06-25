from rest_framework import serializers
from rest_framework import viewsets, status
from .models import Box, Especialista, OfertaEspecialista, Paciente, Horario
from rest_framework.response import Response

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

class HorarioEspecialistaSerializer(serializers.ModelSerializer):
    especialista_nombre = serializers.CharField(source='especialista.nombre', read_only=True)
    especialidad = serializers.CharField(source='especialista.especialidad', read_only=True)
    box_numero = serializers.IntegerField(source='box.numero', read_only=True)
    piso = serializers.IntegerField(source='box.piso', read_only=True)
    fecha = serializers.DateField(format='%Y-%m-%d')
    hora_inicio = serializers.TimeField(format='%H:%M')
    hora_fin = serializers.TimeField(format='%H:%M')

    class Meta:
        model = Horario
        fields = [
            'id',
            'especialista',
            'especialista_nombre',
            'especialidad',
            'box',
            'box_numero',
            'piso',
            'fecha',
            'hora_inicio',
            'hora_fin',
            'disponible'
        ]

class HorarioPacienteSerializer(serializers.ModelSerializer):
    especialista_nombre = serializers.CharField(source='especialista.nombre', read_only=True)
    especialidad = serializers.CharField(source='especialista.especialidad', read_only=True)
    box_numero = serializers.IntegerField(source='box.numero', read_only=True)
    piso = serializers.IntegerField(source='box.piso', read_only=True)
    paciente_nombre = serializers.SerializerMethodField()
    paciente_rut = serializers.SerializerMethodField()
    fecha = serializers.DateField(format='%Y-%m-%d')
    hora_inicio = serializers.TimeField(format='%H:%M')
    hora_fin = serializers.TimeField(format='%H:%M')

    class Meta:
        model = Horario
        fields = [
            'id',
            'especialista',
            'especialista_nombre',
            'especialidad',
            'box',
            'box_numero',
            'piso',
            'paciente',
            'paciente_nombre',
            'paciente_rut',
            'fecha',
            'hora_inicio',
            'hora_fin',
            'disponible'
        ]

    def get_paciente_nombre(self, obj):
        if obj.paciente:
            return f"{obj.paciente.nombre} {obj.paciente.apellido}"
        return None

    def get_paciente_rut(self, obj):
        return obj.paciente.rut if obj.paciente else None

class BoxViewSet(viewsets.ModelViewSet):
    queryset = Box.objects.all()
    serializer_class = BoxSerializer

    def create(self, request, *args, **kwargs):
        print("Entró a create")  
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Errores de validación:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class OfertaEspecialistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfertaEspecialista
        fields = '__all__'