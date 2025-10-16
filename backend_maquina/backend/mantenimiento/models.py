from django.db import models

class Maquina(models.Model):
    nombre = models.CharField(max_length=100)
    estado = models.CharField(max_length=20)
    ultima_fecha_mantenimiento = models.DateField()

    def __str__(self):
        return self.nombre

class Mantenimiento(models.Model):
    maquina = models.ForeignKey(Maquina, on_delete=models.CASCADE, related_name='mantenimientos')
    fecha = models.DateField()
    tipo = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.tipo} - {self.fecha}"
