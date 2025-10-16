/**
 * Componente que muestra la información de una máquina en formato de tarjeta
 */

import React from 'react';
import { Settings, MapPin, Calendar, MoreVertical, Wrench } from 'lucide-react';
import { Machine } from '../types';
import { getMaintenanceStatus, getStatusBadgeColor, getStatusText } from '../utils/maintenanceUtils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface MachineCardProps {
  machine: Machine;
  onEdit: (machine: Machine) => void;
  onDelete: (id: string) => void;
  onScheduleMaintenance: (machine: Machine) => void;
}

/**
 * Tarjeta que muestra información detallada de una máquina
 */
export const MachineCard: React.FC<MachineCardProps> = ({
  machine,
  onEdit,
  onDelete,
  onScheduleMaintenance,
}) => {
  const maintenanceStatus = getMaintenanceStatus(machine);
  const statusColor = getStatusBadgeColor(maintenanceStatus);
  const statusText = getStatusText(maintenanceStatus);

  /**
   * Obtiene el ícono y color según el estado operacional de la máquina
   */
  const getOperationalStatus = () => {
    switch (machine.status) {
      case 'operational':
        return { color: 'text-green-600', bgColor: 'bg-green-100', text: 'Operacional' };
      case 'maintenance':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', text: 'En Mantenimiento' };
      case 'stopped':
        return { color: 'text-red-600', bgColor: 'bg-red-100', text: 'Detenida' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-100', text: 'Desconocido' };
    }
  };

  const operationalStatus = getOperationalStatus();

  /**
   * Formatea una fecha para mostrarla en formato legible
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {machine.name}
            </h3>
            <p className="text-sm text-gray-600">{machine.model}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(machine)}>
                <Settings className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onScheduleMaintenance(machine)}>
                <Calendar className="mr-2 h-4 w-4" />
                Programar Mantenimiento
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(machine.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Wrench className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ubicación */}
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="mr-2 h-4 w-4" />
          <span>{machine.location}</span>
        </div>

        {/* Estados */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="secondary" 
            className={`${operationalStatus.bgColor} ${operationalStatus.color} border-0`}
          >
            {operationalStatus.text}
          </Badge>
          <Badge 
            variant="outline" 
            className={`${statusColor} border`}
          >
            Mantenimiento: {statusText}
          </Badge>
        </div>

        {/* Fechas de mantenimiento */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Último mantenimiento:</span>
            <span className="font-medium">{formatDate(machine.lastMaintenanceDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Próximo mantenimiento:</span>
            <span className={`font-medium ${
              maintenanceStatus === 'overdue' ? 'text-red-600' : 
              maintenanceStatus === 'due-soon' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {formatDate(machine.nextMaintenanceDate)}
            </span>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="pt-2 border-t">
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full"
            onClick={() => onScheduleMaintenance(machine)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Programar Mantenimiento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
