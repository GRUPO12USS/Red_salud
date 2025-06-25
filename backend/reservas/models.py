from django.db import models

class Box(models.Model):
    numero = models.IntegerField()
    piso = models.IntegerField()
    inmueble = models.CharField(max_length=100)
    ESTADOS = [
        ('disponible', 'Disponible'),
        ('ocupado', 'Ocupado'),
        ('en_mantenimiento', 'En Mantenimiento'),
    ]
    #estado = models.CharField(max_length=20, choices=[('disponible', 'Disponible'), ('ocupado', 'Ocupado')])
    estado = models.CharField(max_length=20, choices=ESTADOS, default='disponible')

    def __str__(self):
        return f"Box {self.numero} - Piso {self.piso} - {self.estado}"

class Especialista(models.Model):
    nombre = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100)
    piso = models.IntegerField()
    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('No Disponible', 'No Disponible'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponible')

    def __str__(self):
        return f"{self.nombre} - {self.especialidad}"

class OfertaEspecialista(models.Model):
    especialista = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    horario_disponible = models.CharField(max_length=200)
    observaciones = models.TextField(blank=True, null=True)
    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('No Disponible', 'No Disponible'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponible')

    def __str__(self):
        return f"{self.especialista} - {self.especialidad} ({self.estado})"

class Paciente(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    rut = models.CharField(max_length=12)

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.rut})"

class Horario(models.Model):
    especialista = models.ForeignKey(Especialista, on_delete=models.CASCADE)
    box = models.ForeignKey(Box, on_delete=models.CASCADE)
    paciente = models.ForeignKey(Paciente, on_delete=models.SET_NULL, null=True, blank=True)
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    disponible = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.fecha} - {self.hora_inicio}-{self.hora_fin} | Box {self.box.numero} | {self.especialista.nombre}"
