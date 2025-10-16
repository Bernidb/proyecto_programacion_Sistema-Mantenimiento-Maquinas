/**
 * Modal para agregar o editar máquinas
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { Machine } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface AddMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void; // 🔹 Ya no pasamos la máquina, solo avisamos
  editingMachine?: Machine | null;
}

export const AddMachineModal: React.FC<AddMachineModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingMachine,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    location: '',
    status: 'operational' as Machine['status'],
    lastMaintenanceDate: '',
    maintenanceIntervalDays: 30,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingMachine) {
        setFormData({
          name: editingMachine.name,
          model: editingMachine.model,
          location: editingMachine.location,
          status: editingMachine.status,
          lastMaintenanceDate: editingMachine.lastMaintenanceDate,
          maintenanceIntervalDays: editingMachine.maintenanceIntervalDays,
        });
      } else {
        setFormData({
          name: '',
          model: '',
          location: '',
          status: 'operational',
          lastMaintenanceDate: '',
          maintenanceIntervalDays: 30,
        });
      }
      setErrors({});
    }
  }, [isOpen, editingMachine]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.model.trim()) newErrors.model = 'El modelo es requerido';
    if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida';
    if (!formData.lastMaintenanceDate) newErrors.lastMaintenanceDate = 'La fecha del último mantenimiento es requerida';
    if (formData.maintenanceIntervalDays < 1) newErrors.maintenanceIntervalDays = 'El intervalo debe ser mayor a 0 días';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      // ✅ Calcular la próxima fecha de mantenimiento
      const lastDate = new Date(formData.lastMaintenanceDate);
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + formData.maintenanceIntervalDays);
  
      const payload = {
        ...formData,
        nextMaintenanceDate: nextDate.toISOString().split('T')[0], // yyyy-mm-dd
      };
  
      let url = 'http://localhost:5000/api/machines';
      let method = 'POST';
  
      if (editingMachine) {
        url = `http://localhost:5000/api/machines/${editingMachine.id}`;
        method = 'PUT';
      }
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error('Error al guardar la máquina');
  
      await response.json();
  
      onSubmit();
      onClose();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar la máquina. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingMachine ? (
              <>
                <Save className="h-5 w-5" />
                Editar Máquina
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Agregar Nueva Máquina
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {editingMachine
              ? 'Modifique los datos de la máquina'
              : 'Complete los datos de la nueva máquina'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Máquina *</Label>
            <Input
              id="name"
              placeholder="Ej: Fresadora CNC-001"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Modelo */}
          <div className="space-y-2">
            <Label htmlFor="model">Modelo *</Label>
            <Input
              id="model"
              placeholder="Ej: Haas VF-2"
              value={formData.model}
              onChange={(e) => updateField('model', e.target.value)}
              className={errors.model ? 'border-red-500' : ''}
            />
            {errors.model && <p className="text-sm text-red-600">{errors.model}</p>}
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación *</Label>
            <Input
              id="location"
              placeholder="Ej: Planta Principal - Sector A"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label>Estado Actual</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Machine['status']) => updateField('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operational">Operacional</SelectItem>
                <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                <SelectItem value="stopped">Detenida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Último mantenimiento */}
          <div className="space-y-2">
            <Label htmlFor="lastMaintenance">Último Mantenimiento *</Label>
            <Input
              id="lastMaintenance"
              type="date"
              value={formData.lastMaintenanceDate}
              onChange={(e) => updateField('lastMaintenanceDate', e.target.value)}
              className={errors.lastMaintenanceDate ? 'border-red-500' : ''}
            />
            {errors.lastMaintenanceDate && (
              <p className="text-sm text-red-600">{errors.lastMaintenanceDate}</p>
            )}
          </div>

          {/* Intervalo */}
          <div className="space-y-2">
            <Label htmlFor="interval">Intervalo de Mantenimiento (días) *</Label>
            <Input
              id="interval"
              type="number"
              min="1"
              placeholder="30"
              value={formData.maintenanceIntervalDays}
              onChange={(e) =>
                updateField('maintenanceIntervalDays', parseInt(e.target.value) || 0)
              }
              className={errors.maintenanceIntervalDays ? 'border-red-500' : ''}
            />
            {errors.maintenanceIntervalDays && (
              <p className="text-sm text-red-600">{errors.maintenanceIntervalDays}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {editingMachine ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {loading ? 'Agregando...' : 'Agregar Máquina'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
