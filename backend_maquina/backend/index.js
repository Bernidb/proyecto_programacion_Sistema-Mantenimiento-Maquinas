const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Almacenamiento en memoria
let machines = [];
let maintenanceSchedules = [];

// Rutas CRUD para máquinas
app.get('/api/machines', (req, res) => {
  res.json(machines);
});

app.post('/api/machines', (req, res) => {
  const newMachine = { id: uuidv4(), ...req.body };
  machines.push(newMachine);
  res.status(201).json(newMachine);
});

app.put('/api/machines/:id', (req, res) => {
  const { id } = req.params;
  const index = machines.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ message: 'Máquina no encontrada' });

  machines[index] = { ...machines[index], ...req.body };
  res.json(machines[index]);
});

app.delete('/api/machines/:id', (req, res) => {
  const { id } = req.params;
  machines = machines.filter(m => m.id !== id);

  // También borramos los mantenimientos relacionados
  maintenanceSchedules = maintenanceSchedules.filter(s => s.machineId !== id);

  res.status(204).send();
});

// Rutas para mantenimientos
app.get('/api/maintenanceSchedules', (req, res) => {
  res.json(maintenanceSchedules);
});

app.post('/api/maintenanceSchedules', (req, res) => {
  const newSchedule = { id: uuidv4(), status: 'pending', ...req.body };
  maintenanceSchedules.push(newSchedule);
  res.status(201).json(newSchedule);
});

app.put('/api/maintenanceSchedules/:id', (req, res) => {
  const { id } = req.params;
  const index = maintenanceSchedules.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ message: 'Mantenimiento no encontrado' });

  maintenanceSchedules[index] = { ...maintenanceSchedules[index], ...req.body };
  res.json(maintenanceSchedules[index]);
});

app.delete('/api/maintenanceSchedules/:id', (req, res) => {
  const { id } = req.params;
  maintenanceSchedules = maintenanceSchedules.filter(s => s.id !== id);
  res.status(204).send();
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Backend funcionando en http://localhost:${PORT}`);
});
