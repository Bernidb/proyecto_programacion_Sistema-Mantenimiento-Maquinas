/**
 * Utilidades para cálculos relacionados con mantenimiento
 */

import { Machine, MaintenanceStatus } from '../types';

/**
 * Calcula el estado de mantenimiento de una máquina
 * @param machine - La máquina a evaluar
 * @returns El estado de mantenimiento actual
 */
export const getMaintenanceStatus = (machine: Machine): MaintenanceStatus => {
  const today = new Date();
  const nextMaintenance = new Date(machine.nextMaintenanceDate);
  const daysDiff = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) {
    return 'overdue';
  } else if (daysDiff <= 7) {
    return 'due-soon';
  } else {
    return 'up-to-date';
  }
};

/**
 * Obtiene el color del badge según el estado de mantenimiento
 * @param status - El estado de mantenimiento
 * @returns Las clases CSS para el badge
 */
export const getStatusBadgeColor = (status: MaintenanceStatus): string => {
  switch (status) {
    case 'up-to-date':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'due-soon':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Obtiene el texto descriptivo del estado de mantenimiento
 * @param status - El estado de mantenimiento
 * @returns El texto descriptivo
 */
export const getStatusText = (status: MaintenanceStatus): string => {
  switch (status) {
    case 'up-to-date':
      return 'Al día';
    case 'due-soon':
      return 'Próximo';
    case 'overdue':
      return 'Atrasado';
    default:
      return 'Desconocido';
  }
};

/**
 * Calcula la próxima fecha de mantenimiento basada en la última fecha y el intervalo
 * @param lastDate - Última fecha de mantenimiento
 * @param intervalDays - Intervalo en días
 * @returns La próxima fecha de mantenimiento en formato ISO
 */
export const calculateNextMaintenanceDate = (lastDate: string, intervalDays: number): string => {
  const last = new Date(lastDate);
  const next = new Date(last);
  next.setDate(next.getDate() + intervalDays);
  return next.toISOString().split('T')[0];
};
