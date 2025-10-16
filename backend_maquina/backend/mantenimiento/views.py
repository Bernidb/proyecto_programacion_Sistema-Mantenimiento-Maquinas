from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Maquina, Mantenimiento
from .serializers import MaquinaSerializer, MantenimientoSerializer

class MaquinaViewSet(viewsets.ModelViewSet):
    queryset = Maquina.objects.all()
    serializer_class = MaquinaSerializer
    permission_classes = [IsAuthenticated]

class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [IsAuthenticated]
