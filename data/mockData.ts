
import { Technician, MaintenanceTeam, Equipment, MaintenanceRequest } from '../types';

// Technicians
export const initialTechnicians: Technician[] = [
  { id: 'TECH-001', name: 'John Doe', avatarUrl: 'https://i.pravatar.cc/150?u=tech001', teamId: 'TEAM-01' },
  { id: 'TECH-002', name: 'Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?u=tech002', teamId: 'TEAM-01' },
  { id: 'TECH-003', name: 'Peter Jones', avatarUrl: 'https://i.pravatar.cc/150?u=tech003', teamId: 'TEAM-02' },
  { id: 'TECH-004', name: 'Mary Williams', avatarUrl: 'https://i.pravatar.cc/150?u=tech004', teamId: 'TEAM-02' },
  { id: 'TECH-005', name: 'David Brown', avatarUrl: 'https://i.pravatar.cc/150?u=tech005', teamId: 'TEAM-03' },
  { id: 'TECH-006', name: 'Susan Davis', avatarUrl: 'https://i.pravatar.cc/150?u=tech006', teamId: 'TEAM-03' },
];

// Maintenance Teams
export const initialTeams: MaintenanceTeam[] = [
  { id: 'TEAM-01', name: 'Mechanics', memberIds: ['TECH-001', 'TECH-002'] },
  { id: 'TEAM-02', name: 'Electricians', memberIds: ['TECH-003', 'TECH-004'] },
  { id: 'TEAM-03', name: 'IT Support', memberIds: ['TECH-005', 'TECH-006'] },
];

// Equipment
export const initialEquipment: Equipment[] = [
  {
    id: 'EQ-001',
    name: 'CNC Machine X-25',
    category: 'Machinery',
    serialNumber: 'SN-A1B2C3D4',
    purchaseDate: '2022-01-15',
    warrantyInfo: 'Expires 2025-01-14',
    location: 'Workshop A',
    department: 'Production',
    maintenanceTeamId: 'TEAM-01',
    defaultTechnicianId: 'TECH-001',
  },
  {
    id: 'EQ-002',
    name: 'Forklift F-800',
    category: 'Vehicle',
    serialNumber: 'SN-E5F6G7H8',
    purchaseDate: '2021-06-20',
    warrantyInfo: 'Expired',
    location: 'Warehouse',
    department: 'Logistics',
    maintenanceTeamId: 'TEAM-01',
    defaultTechnicianId: 'TECH-002',
  },
  {
    id: 'EQ-003',
    name: 'Main Electrical Panel',
    category: 'Infrastructure',
    serialNumber: 'SN-I9J0K1L2',
    purchaseDate: '2020-03-10',
    warrantyInfo: 'Expires 2030-03-09',
    location: 'Basement',
    department: 'Facilities',
    maintenanceTeamId: 'TEAM-02',
    defaultTechnicianId: 'TECH-003',
  },
  {
    id: 'EQ-004',
    name: 'Dell XPS 15 Laptop',
    category: 'Computer',
    serialNumber: 'SN-M3N4O5P6',
    purchaseDate: '2023-08-01',
    warrantyInfo: 'Expires 2026-07-31',
    location: 'Office 201',
    employeeOwnerId: 'TECH-005',
    maintenanceTeamId: 'TEAM-03',
    defaultTechnicianId: 'TECH-005',
  },
   {
    id: 'EQ-005',
    name: 'Server Rack 1',
    category: 'IT Hardware',
    serialNumber: 'SN-Q7R8S9T0',
    purchaseDate: '2022-11-05',
    warrantyInfo: 'Expires 2025-11-04',
    location: 'Data Center',
    department: 'IT',
    maintenanceTeamId: 'TEAM-03',
    defaultTechnicianId: 'TECH-006',
  }
];

// Maintenance Requests
export const initialRequests: MaintenanceRequest[] = [
  {
    id: 'REQ-001',
    subject: 'Leaking Oil',
    type: 'Corrective',
    equipmentId: 'EQ-001',
    scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
    duration: 4,
    status: 'New',
    assignedTechnicianId: 'TECH-001',
    teamId: 'TEAM-01',
  },
  {
    id: 'REQ-002',
    subject: 'Quarterly Checkup',
    type: 'Preventive',
    equipmentId: 'EQ-002',
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    duration: 2,
    status: 'New',
    assignedTechnicianId: 'TECH-002',
    teamId: 'TEAM-01',
  },
  {
    id: 'REQ-003',
    subject: 'Faulty Circuit Breaker',
    type: 'Corrective',
    equipmentId: 'EQ-003',
    scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // yesterday
    duration: 8,
    status: 'In Progress',
    assignedTechnicianId: 'TECH-003',
    teamId: 'TEAM-02',
  },
  {
    id: 'REQ-004',
    subject: 'Battery Replacement',
    type: 'Corrective',
    equipmentId: 'EQ-004',
    scheduledDate: '2024-04-10',
    duration: 1,
    status: 'Repaired',
    assignedTechnicianId: 'TECH-005',
    teamId: 'TEAM-03',
  },
  {
    id: 'REQ-005',
    subject: 'Annual Inspection',
    type: 'Preventive',
    equipmentId: 'EQ-001',
    scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
    duration: 8,
    status: 'New',
    assignedTechnicianId: 'TECH-001',
    teamId: 'TEAM-01',
  },
  {
    id: 'REQ-006',
    subject: 'Engine Overhaul',
    type: 'Corrective',
    equipmentId: 'EQ-002',
    scheduledDate: '2024-03-01',
    duration: 40,
    status: 'Scrap',
    assignedTechnicianId: 'TECH-002',
    teamId: 'TEAM-01',
  },
    {
    id: 'REQ-007',
    subject: 'Monthly Server Maintenance',
    type: 'Preventive',
    equipmentId: 'EQ-005',
    scheduledDate: new Date().toISOString().split('T')[0], // Today
    duration: 3,
    status: 'In Progress',
    assignedTechnicianId: 'TECH-006',
    teamId: 'TEAM-03',
  },
];
