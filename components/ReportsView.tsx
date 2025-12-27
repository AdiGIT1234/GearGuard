
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { MaintenanceRequest, MaintenanceTeam, Equipment } from '../types';

interface ReportsViewProps {
  requests: MaintenanceRequest[];
  teams: MaintenanceTeam[];
  equipment: Equipment[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ requests, teams, equipment }) => {
    
  const requestsPerTeam = teams.map(team => ({
    name: team.name,
    requests: requests.filter(req => req.teamId === team.id).length,
  }));

  const equipmentCategories = [...new Set(equipment.map(e => e.category))];
  const requestsPerCategory = equipmentCategories.map(category => ({
      name: category,
      requests: requests.filter(req => {
          const reqEquipment = equipment.find(e => e.id === req.equipmentId);
          return reqEquipment?.category === category;
      }).length,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
          <p className="font-bold">{label}</p>
          <p className="text-blue-500">{`Requests: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Requests per Team</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={requestsPerTeam} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} />
            <Legend />
            <Bar dataKey="requests" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Requests per Equipment Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={requestsPerCategory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)"/>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(236, 252, 241, 0.5)'}} />
            <Legend />
            <Bar dataKey="requests" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
