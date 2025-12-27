import React from 'react';
import { MaintenanceTeam, Technician } from '../types';

interface TeamsViewProps {
  teams: MaintenanceTeam[];
  technicians: Technician[];
}

export const TeamsView: React.FC<TeamsViewProps> = ({ teams, technicians }) => {
  const techniciansMap = new Map(technicians.map(t => [t.id, t]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map(team => (
        <div key={team.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">{team.name}</h2>
          <div className="space-y-4">
            {team.memberIds.map(memberId => {
              const member = techniciansMap.get(memberId);
              if (!member) return null;
              return (
                <div key={member.id} className="flex items-center space-x-4">
                  <img src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.id}</p>
                  </div>
                </div>
              );
            })}
             {team.memberIds.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No members assigned to this team.</p>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};
