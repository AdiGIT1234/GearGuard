
import React from 'react';
import { MaintenanceRequest, Technician, Equipment } from '../types';

interface KanbanCardProps {
  request: MaintenanceRequest;
  technician?: Technician;
  equipment?: Equipment;
  onEditRequest: (request: MaintenanceRequest) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ request, technician, equipment, onEditRequest }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('requestId', request.id);
  };

  const isOverdue = new Date(request.scheduledDate) < new Date() && request.status !== 'Repaired' && request.status !== 'Scrap';
  
  const typeColors = {
    Corrective: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
    Preventive: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onEditRequest(request)}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition-shadow duration-200 border-l-4 ${isOverdue ? 'border-red-500' : 'border-transparent'}`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-900 dark:text-white pr-2">{request.subject}</h3>
        {technician && (
            <img 
                src={technician.avatarUrl} 
                alt={technician.name} 
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700"
                title={technician.name}
            />
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{equipment?.name || 'Unknown Equipment'}</p>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${typeColors[request.type]}`}>
                {request.type}
            </span>
            {isOverdue && (
                 <span className="text-xs font-bold text-red-500">OVERDUE</span>
            )}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{new Date(request.scheduledDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
