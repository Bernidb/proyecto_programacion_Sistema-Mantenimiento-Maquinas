/**
 * Definiciones de tipos TypeScript para la aplicación de mantenimiento preventivo
 */

/** Interfaz que define la estructura de una máquina */
export interface Machine {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'operational' | 'maintenance' | 'stopped';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceIntervalDays: number;
}

/** Interfaz que define la estructura de un mantenimiento programado */
export interface MaintenanceSchedule {
  id: string;
  machineId: string;
  machineName: string;
  scheduledDate: string;
  maintenanceType: 'preventive' | 'corrective' | 'inspection';
  description: string;
  status: 'pending' | 'completed' | 'overdue';
}

/** Interfaz que define el contexto de autenticación */
export interface AuthContext {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

/** Interfaz que define la estructura de un usuario */
export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

/** Tipo que define los posibles estados de mantenimiento */
export type MaintenanceStatus = 'up-to-date' | 'due-soon' | 'overdue';
