import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  LogOut, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Bell
} from 'lucide-react';
import { Machine, User as UserType } from '../types';
import { useMachines } from '../hooks/useMachines';
import { getMaintenanceStatus } from '../utils/maintenanceUtils';
import { MachineCard } from './MachineCard';
import { AddMachineModal } from './AddMachineModal';
import { ScheduleMaintenanceModal } from './ScheduleMaintenanceModal';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const {
    machines,
    maintenanceSchedules,
    addMachine,
    updateMachine,
    deleteMachine,
    scheduleMaintenance,
    fetchMachines,
    fetchMaintenanceSchedules,
  } = useMachines();

  const [isAddMachineModalOpen, setIsAddMachineModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  useEffect(() => {
    fetchMachines();
    fetchMaintenanceSchedules(); // <-- Esto para traer mantenimientos del backend
  }, []);

  const getStats = () => {
    const totalMachines = machines.length;
    const upToDate = machines.filter(m => getMaintenanceStatus(m) === 'up-to-date').length;
    const dueSoon = machines.filter(m => getMaintenanceStatus(m) === 'due-soon').length;
    const overdue = machines.filter(m => getMaintenanceStatus(m) === 'overdue').length;
    const operational = machines.filter(m => m.status === 'operational').length;

    return { totalMachines, upToDate, dueSoon, overdue, operational };
  };

  const stats = getStats();

  const handleEditMachine = (machine: Machine) => {
    setEditingMachine(machine);
    setIsAddMachineModalOpen(true);
  };

  const handleScheduleMaintenance = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsScheduleModalOpen(true);
  };

  const handleMachineSubmit = async () => {
    await fetchMachines();
    setIsAddMachineModalOpen(false);
    setEditingMachine(null);
  };

  const handleCloseAddMachineModal = () => {
    setIsAddMachineModalOpen(false);
    setEditingMachine(null);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedMachine(null);
  };

  const handleDeleteMachine = async (id: string) => {
    await deleteMachine(id);
    await fetchMachines();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Sistema de Mantenimiento
                </h1>
                <p className="text-sm text-gray-500">Panel de administración</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-gray-500">{user.role}</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Máquinas</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMachines}</div>
              <p className="text-xs text-muted-foreground">
                {stats.operational} operacionales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Al Día</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.upToDate}</div>
              <p className="text-xs text-muted-foreground">
                Mantenimiento actualizado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.dueSoon}</div>
              <p className="text-xs text-muted-foreground">
                Mantenimiento en 7 días
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">
                Requieren atención inmediata
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones principales */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gestión de Máquinas</h2>
            <p className="text-sm text-gray-600">
              Administre sus máquinas y programe mantenimientos preventivos
            </p>
          </div>
          <Button 
            onClick={() => setIsAddMachineModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Máquina
          </Button>
        </div>

        {/* Lista de máquinas */}
        {machines.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay máquinas registradas
              </h3>
              <p className="text-gray-600 mb-4">
                Comience agregando su primera máquina al sistema
              </p>
              <Button 
                onClick={() => setIsAddMachineModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Primera Máquina
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                onEdit={handleEditMachine}
                onDelete={handleDeleteMachine}
                onScheduleMaintenance={handleScheduleMaintenance}
              />
            ))}
          </div>
        )}

        {/* Próximos mantenimientos programados */}
        {maintenanceSchedules.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Próximos Mantenimientos Programados
            </h3>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {maintenanceSchedules
                    .filter(schedule => schedule.status === 'pending')
                    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                    .slice(0, 5)
                    .map((schedule) => (
                      <div key={schedule.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{schedule.machineName}</h4>
                            <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(schedule.scheduledDate).toLocaleDateString('es-ES')}
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {schedule.maintenanceType === 'preventive' ? 'Preventivo' :
                               schedule.maintenanceType === 'corrective' ? 'Correctivo' : 'Inspección'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Modales */}
      <AddMachineModal
        isOpen={isAddMachineModalOpen}
        onClose={handleCloseAddMachineModal}
        onSubmit={handleMachineSubmit}
        editingMachine={editingMachine}
      />

      <ScheduleMaintenanceModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
        onSubmit={scheduleMaintenance} 
        machine={selectedMachine}
      />
    </div>
  );
};
