/**
 * Modal para programar mantenimientos preventivos
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';
import { Machine, MaintenanceSchedule } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface ScheduleMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (schedule: Omit<MaintenanceSchedule, 'id' | 'status'>) => void;
  machine?: Machine | null;
}

/**
 * Modal para programar un nuevo mantenimiento preventivo
 */
export const ScheduleMaintenanceModal: React.FC<ScheduleMaintenanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  machine,
}) => {
  const [formData, setFormData] = useState({
    scheduledDate: '',
    maintenanceType: 'preventive' as MaintenanceSchedule['maintenanceType'],
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Inicializa el formulario cuando se abre el modal
   */
  useEffect(() => {
    if (isOpen && machine) {
      // Sugiere la próxima fecha de mantenimiento como fecha por defecto
      setFormData({
        scheduledDate: machine.nextMaintenanceDate,
        maintenanceType: 'preventive',
        description: `Mantenimiento preventivo programado para ${machine.name}`,
      });
      setErrors({});
    }
  }, [isOpen, machine]);

  /**
   * Valida los datos del formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'La fecha programada es requerida';
    } else {
      const selectedDate = new Date(formData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.scheduledDate = 'La fecha no puede ser anterior a hoy';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!machine || !validateForm()) {
      return;
    }

    const scheduleData: Omit<MaintenanceSchedule, 'id' | 'status'> = {
      machineId: machine.id,
      machineName: machine.name,
      scheduledDate: formData.scheduledDate,
      maintenanceType: formData.maintenanceType,
      description: formData.description,
    };

    onSubmit(scheduleData);
    onClose();
  };

  /**
   * Actualiza un campo del formulario
   */
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpia el error del campo cuando el usuario comienza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!machine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Programar Mantenimiento
          </DialogTitle>
          <DialogDescription>
            Programe un mantenimiento para <strong>{machine.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información de la máquina */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-gray-900">Información de la Máquina</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Nombre:</strong> {machine.name}</div>
              <div><strong>Modelo:</strong> {machine.model}</div>
              <div><strong>Ubicación:</strong> {machine.location}</div>
              <div><strong>Próximo mantenimiento sugerido:</strong> {
                new Date(machine.nextMaintenanceDate).toLocaleDateString('es-ES')
              }</div>
            </div>
          </div>

          {/* Fecha programada */}
          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Fecha Programada *</Label>
            <Input
              id="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => updateField('scheduledDate', e.target.value)}
              className={errors.scheduledDate ? 'border-red-500' : ''}
            />
            {errors.scheduledDate && <p className="text-sm text-red-600">{errors.scheduledDate}</p>}
          </div>

          {/* Tipo de mantenimiento */}
          <div className="space-y-2">
            <Label>Tipo de Mantenimiento</Label>
            <Select 
              value={formData.maintenanceType} 
              onValueChange={(value: MaintenanceSchedule['maintenanceType']) => updateField('maintenanceType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preventive">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Preventivo
                  </div>
                </SelectItem>
                <SelectItem value="corrective">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Correctivo
                  </div>
                </SelectItem>
                <SelectItem value="inspection">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Inspección
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describa las tareas a realizar durante el mantenimiento..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="mr-2 h-4 w-4" />
              Programar Mantenimiento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
