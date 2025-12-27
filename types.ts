
export type RequestStatus = 'New' | 'In Progress' | 'Repaired' | 'Scrap';
export type RequestType = 'Corrective' | 'Preventive';
export type ViewType = 'kanban' | 'calendar' | 'reports';

export interface Technician {
  id: string;
  name: string;
  avatarUrl: string;
  teamId: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  memberIds: string[];
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyInfo: string;
  location: string;
  department?: string;
  employeeOwnerId?: string;
  maintenanceTeamId: string;
  defaultTechnicianId: string;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  type: RequestType;
  equipmentId: string;
  scheduledDate: string;
  duration: number; // in hours
  status: RequestStatus;
  assignedTechnicianId: string;
  teamId: string;
}

export type MaintenanceRequestInput = Omit<MaintenanceRequest, 'id' | 'status'>;
