
import React from 'react';
import { MaintenanceRequest, RequestStatus, Technician, Equipment } from '../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: RequestStatus;
  requests: MaintenanceRequest[];
  techniciansMap: Map<string, Technician>;
  equipmentMap: Map<string, Equipment>;
  onDrop: (requestId: string, newStatus: RequestStatus) => void;
  onEditRequest: (request: MaintenanceRequest) => void;
}

const statusConfig = {
    New: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-500' },
    'In Progress': { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200', border: 'border-yellow-500' },
    Repaired: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200', border: 'border-green-500' },
    Scrap: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', border: 'border-gray-500' },
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, requests, techniciansMap, equipmentMap, onDrop, onEditRequest }) => {
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const requestId = e.dataTransfer.getData('requestId');
    if (requestId) {
      onDrop(requestId, status);
    }
  };
  
  const config = statusConfig[status];

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-lg p-4 transition-colors duration-300 ${isOver ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
    >
      <div className={`flex justify-between items-center mb-4 p-2 rounded-t-lg ${config.bg} border-l-4 ${config.border}`}>
        <h2 className={`font-bold text-lg ${config.text}`}>{status}</h2>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${config.bg} ${config.text}`}>
          {requests.length}
        </span>
      </div>
      <div className="space-y-4 min-h-[500px]">
        {requests.map(request => (
          <KanbanCard 
            key={request.id} 
            request={request}
            technician={techniciansMap.get(request.assignedTechnicianId)}
            equipment={equipmentMap.get(request.equipmentId)}
            onEditRequest={onEditRequest}
            />
        ))}
      </div>
    </div>
  );
};
