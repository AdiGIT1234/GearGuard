
import React from 'react';
import { MaintenanceRequest, RequestStatus, MaintenanceTeam, Technician, Equipment } from '../types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  requests: MaintenanceRequest[];
  teams: MaintenanceTeam[];
  technicians: Technician[];
  equipment: Equipment[];
  onStatusChange: (requestId: string, newStatus: RequestStatus) => void;
  onEditRequest: (request: MaintenanceRequest) => void;
}

const STATUSES: RequestStatus[] = ['New', 'In Progress', 'Repaired', 'Scrap'];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ requests, teams, technicians, equipment, onStatusChange, onEditRequest }) => {
  const handleDrop = (requestId: string, newStatus: RequestStatus) => {
    onStatusChange(requestId, newStatus);
  };
  
  const techniciansMap = new Map(technicians.map(t => [t.id, t]));
  const equipmentMap = new Map(equipment.map(e => [e.id, e]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATUSES.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          requests={requests.filter(req => req.status === status)}
          techniciansMap={techniciansMap}
          equipmentMap={equipmentMap}
          onDrop={handleDrop}
          onEditRequest={onEditRequest}
        />
      ))}
    </div>
  );
};
