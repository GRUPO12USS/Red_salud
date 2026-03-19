#!/usr/bin/env python
"""Script para limpiar ofertas con datos corruptos"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'redsalud_backend.settings')
django.setup()

from reservas.models import OfertaEspecialista

print("Inspeccionando ofertas...")
print(f"Total ofertas: {OfertaEspecialista.objects.count()}")

# Intentar obtener todas las ofertas y ver cuáles tienen problemas
ofertas = list(OfertaEspecialista.objects.all())
print(f"Ofertas encontradas: {len(ofertas)}")

for oferta in ofertas:
    try:
        print(f"ID: {oferta.id}, Especialista ID: {oferta.especialista_id}, Estado: {oferta.estado}")
    except Exception as e:
        print(f"Error en oferta {oferta.id}: {e}")

# Eliminar ofertas con datos corruptos
print("\nEliminando ofertas con datos corruptos...")
OfertaEspecialista.objects.all().delete()
print("Ofertas eliminadas.")
print(f"Total ofertas después de limpiar: {OfertaEspecialista.objects.count()}")
