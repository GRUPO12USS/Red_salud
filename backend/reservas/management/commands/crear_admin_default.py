from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Crea un superusuario por defecto si no existe'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='',
                password='12345'
            )
            self.stdout.write(self.style.SUCCESS('✅ Superusuario creado: admin/admin123'))
        else:
            self.stdout.write('ℹ️ El superusuario ya existe.')
