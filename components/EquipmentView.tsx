
import React from 'react';
import { Equipment, MaintenanceTeam, MaintenanceRequest } from '../types';

interface EquipmentViewProps {
  equipment: Equipment[];
  teams: MaintenanceTeam[];
  requests: MaintenanceRequest[];
  onViewRequests: (equipmentId: string) => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({ equipment, teams, requests, onViewRequests }) => {
  const teamsMap = new Map(teams.map(t => [t.id, t.name]));

  const getRequestCount = (equipmentId: string) => {
    return requests.filter(r => r.equipmentId === equipmentId && r.status !== 'Repaired' && r.status !== 'Scrap').length;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Equipment Name</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Maintenance Team</th>
              <th scope="col" className="px-6 py-3">Warranty</th>
              <th scope="col" className="px-6 py-3 text-center">Maintenance</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map(item => {
              const requestCount = getRequestCount(item.id);
              const isScrapped = item.isScrapped;

              return (
                <tr key={item.id} className={`border-b dark:border-gray-700 transition-colors ${isScrapped ? 'bg-gray-100 dark:bg-gray-900 opacity-60' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.name}
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-mono">{item.serialNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                      {isScrapped ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Scrapped
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Operational
                        </span>
                      )}
                  </td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4">{teamsMap.get(item.maintenanceTeamId) || 'Unknown'}</td>
                  <td className="px-6 py-4">
                      {item.warrantyInfo}
                      <span className="block text-xs text-gray-500 dark:text-gray-400">Purchased: {new Date(item.purchaseDate).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                        onClick={() => onViewRequests(item.id)}
                        className="relative bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-xs transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={isScrapped}
                    >
                        Requests
                        {requestCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">
                                  {requestCount}
                                </span>
                            </span>
                        )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
