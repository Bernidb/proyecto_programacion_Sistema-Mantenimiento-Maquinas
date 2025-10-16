import React, { useEffect, useState } from 'react';
import { AddMachineModal } from './AddMachineModal';
import { Machine } from '../types';
import { Button } from './ui/button';

export const MachinesPage: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Traer máquinas desde backend cuando se monta
  useEffect(() => {
    fetch('http://localhost:8000/api/machines')
      .then(res => {
        if (!res.ok) throw new Error('Error al traer máquinas');
        return res.json();
      })
      .then(data => setMachines(data))
      .catch(err => {
        console.error(err);
        alert('No se pudieron cargar las máquinas');
      });
  }, []);

  // Agregar máquina a la lista local
  const handleAddMachine = (newMachine: Machine) => {
    setMachines(prev => [...prev, newMachine]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestor de Máquinas</h1>
      <Button onClick={() => setModalOpen(true)}>Agregar Máquina</Button>

      <AddMachineModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddMachine}
      />

      <div className="mt-6 space-y-4">
        {machines.length === 0 ? (
          <p>No hay máquinas cargadas.</p>
        ) : (
          machines.map(machine => (
            <div
              key={machine.id}
              className="p-4 border rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{machine.name}</p>
                <p className="text-sm text-gray-600">
                  Modelo: {machine.model} - Ubicación: {machine.location}
                </p>
              </div>
              {/* Podrías agregar botones para editar o eliminar */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
