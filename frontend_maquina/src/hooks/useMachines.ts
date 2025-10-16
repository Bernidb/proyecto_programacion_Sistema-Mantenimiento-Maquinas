import { useState, useEffect } from 'react';
import { Machine, MaintenanceSchedule } from '../types';
import { calculateNextMaintenanceDate } from '../utils/maintenanceUtils';

const API_URL = 'http://localhost:5000/api';

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>([]);

  // Función para cargar máquinas desde backend
  const fetchMachines = async () => {
    try {
      const res = await fetch(`${API_URL}/machines`);
      if (!res.ok) throw new Error('Error al obtener máquinas');
      const data: Machine[] = await res.json();

      // 🔹 Filtrar duplicados por ID
      const uniqueMachines = data.filter(
        (machine, index, self) =>
          index === self.findIndex(m => m.id === machine.id)
      );

      console.log("Máquinas recibidas del backend (únicas):", uniqueMachines);
      setMachines(uniqueMachines);
    } catch (error) {
      console.error(error);
    }
  };

  // Cargar mantenimientos desde backend
  const fetchMaintenanceSchedules = async () => {
    try {
      const res = await fetch(`${API_URL}/maintenanceSchedules`);
      if (!res.ok) throw new Error('Error al obtener mantenimientos');
      const data = await res.json();
      setMaintenanceSchedules(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Carga inicial: máquinas + mantenimientos
  useEffect(() => {
    fetchMachines();
    fetchMaintenanceSchedules();
  }, []);

  // Agregar máquina (POST)
  const addMachine = async (machineData: Omit<Machine, 'id' | 'nextMaintenanceDate'>) => {
    const newMachine = {
      ...machineData,
      nextMaintenanceDate: calculateNextMaintenanceDate(
        machineData.lastMaintenanceDate,
        machineData.maintenanceIntervalDays
      )
    };

    try {
      const res = await fetch(`${API_URL}/machines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMachine),
      });
      if (!res.ok) throw new Error('Error al crear máquina');

      await fetchMachines(); // sincronizamos estado local
    } catch (error) {
      console.error(error);
    }
  };

  // Actualizar máquina (PUT)
  const updateMachine = async (id: string, updates: Partial<Omit<Machine, 'id'>>) => {
    let updatedMachine = { ...updates };
    if (updates.lastMaintenanceDate || updates.maintenanceIntervalDays) {
      updatedMachine.nextMaintenanceDate = calculateNextMaintenanceDate(
        updates.lastMaintenanceDate ?? '',
        updates.maintenanceIntervalDays ?? 0
      );
    }

    try {
      const res = await fetch(`${API_URL}/machines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMachine),
      });
      if (!res.ok) throw new Error('Error al actualizar máquina');

      await fetchMachines(); // sincronizamos estado local
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar máquina (DELETE)
  const deleteMachine = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/machines/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar máquina');

      await fetchMachines(); // sincronizamos estado local
      setMaintenanceSchedules(prev => prev.filter(s => s.machineId !== id)); // mantenimientos en frontend
    } catch (error) {
      console.error(error);
    }
  };

  // Programar mantenimiento (POST)
  const scheduleMaintenance = async (scheduleData: Omit<MaintenanceSchedule, 'id' | 'status'>) => {
    try {
      const res = await fetch(`${API_URL}/maintenanceSchedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scheduleData,
          status: 'pending',
          id: Date.now().toString() // si backend genera ID sacá esta línea
        }),
      });
      if (!res.ok) throw new Error('Error al crear mantenimiento');

      await fetchMaintenanceSchedules(); // sincronizamos estado local
    } catch (error) {
      console.error(error);
    }
  };

  // Actualizar estado de mantenimiento (PUT)
  const updateMaintenanceStatus = async (id: string, status: MaintenanceSchedule['status']) => {
    try {
      const res = await fetch(`${API_URL}/maintenanceSchedules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Error al actualizar estado de mantenimiento');

      await fetchMaintenanceSchedules();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    machines,
    maintenanceSchedules,
    addMachine,
    updateMachine,
    deleteMachine,
    scheduleMaintenance,
    updateMaintenanceStatus,
    fetchMachines,
    fetchMaintenanceSchedules,
  };
};
