from rest_framework import serializers
from .models import Maquina, Mantenimiento

class MantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mantenimiento
        fields = '__all__'

class MaquinaSerializer(serializers.ModelSerializer):
    mantenimientos = MantenimientoSerializer(many=True, read_only=True)

    class Meta:
        model = Maquina
        fields = '__all__'
