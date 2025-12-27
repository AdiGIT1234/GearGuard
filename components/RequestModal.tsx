
import React, { useState, useEffect } from 'react';
import { MaintenanceRequest, MaintenanceRequestInput, RequestType, Equipment, MaintenanceTeam, Technician } from '../types';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (requestData: MaintenanceRequestInput) => void;
  request: MaintenanceRequest | null;
  equipmentList: Equipment[];
  teamList: MaintenanceTeam[];
  technicianList: Technician[];
  defaultDate?: Date;
}

const InputField: React.FC<{label: string, id: string, children: React.ReactNode}> = ({label, id, children}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="mt-1">
            {children}
        </div>
    </div>
);

const baseInputClasses = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";


export const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose, onSave, request, equipmentList, teamList, technicianList, defaultDate }) => {
  const [formData, setFormData] = useState<MaintenanceRequestInput>({
    subject: '',
    type: 'Corrective',
    equipmentId: '',
    scheduledDate: defaultDate ? defaultDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    duration: 1,
    assignedTechnicianId: '',
    teamId: '',
  });

  const [availableTechnicians, setAvailableTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    if (request) {
      setFormData({
        subject: request.subject,
        type: request.type,
        equipmentId: request.equipmentId,
        scheduledDate: request.scheduledDate,
        duration: request.duration,
        assignedTechnicianId: request.assignedTechnicianId,
        teamId: request.teamId,
      });
    } else {
        const initialDate = defaultDate ? defaultDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        setFormData({
            subject: '', type: 'Corrective', equipmentId: '', 
            scheduledDate: initialDate, duration: 1, assignedTechnicianId: '', teamId: ''
        });
    }
  }, [request, isOpen, defaultDate]);

  useEffect(() => {
    if (formData.teamId) {
      const selectedTeam = teamList.find(t => t.id === formData.teamId);
      if (selectedTeam) {
        setAvailableTechnicians(technicianList.filter(tech => selectedTeam.memberIds.includes(tech.id)));
      }
    } else {
      setAvailableTechnicians([]);
    }
    // Don't auto-clear technician if they are still in the newly selected team
    if (!availableTechnicians.find(tech => tech.id === formData.assignedTechnicianId)) {
        setFormData(prev => ({...prev, assignedTechnicianId: ''}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.teamId, teamList, technicianList]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'duration' ? Number(value) : value }));

    if (name === 'equipmentId') {
        const selectedEquipment = equipmentList.find(eq => eq.id === value);
        if (selectedEquipment) {
            setFormData(prev => ({ 
                ...prev, 
                teamId: selectedEquipment.maintenanceTeamId,
                assignedTechnicianId: selectedEquipment.defaultTechnicianId
            }));
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {request ? 'Edit Maintenance Request' : 'New Maintenance Request'}
            </h2>
            <div className="space-y-4">
              <InputField label="Subject" id="subject">
                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} className={baseInputClasses} required />
              </InputField>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Equipment" id="equipmentId">
                    <select name="equipmentId" id="equipmentId" value={formData.equipmentId} onChange={handleChange} className={baseInputClasses} required>
                      <option value="">Select Equipment</option>
                      {equipmentList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </InputField>
                  <InputField label="Request Type" id="type">
                    <select name="type" id="type" value={formData.type} onChange={handleChange} className={baseInputClasses} required>
                      <option value="Corrective">Corrective</option>
                      <option value="Preventive">Preventive</option>
                    </select>
                  </InputField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <InputField label="Maintenance Team" id="teamId">
                    <select name="teamId" id="teamId" value={formData.teamId} onChange={handleChange} className={baseInputClasses} required disabled={!formData.equipmentId}>
                      <option value="">Select Team</option>
                      {teamList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </InputField>
                  <InputField label="Assigned Technician" id="assignedTechnicianId">
                    <select name="assignedTechnicianId" id="assignedTechnicianId" value={formData.assignedTechnicianId} onChange={handleChange} className={baseInputClasses} required disabled={!formData.teamId}>
                      <option value="">Select Technician</option>
                      {availableTechnicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </InputField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Scheduled Date" id="scheduledDate">
                    <input type="date" name="scheduledDate" id="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className={baseInputClasses} required />
                  </InputField>
                  <InputField label="Duration (hours)" id="duration">
                    <input type="number" name="duration" id="duration" value={formData.duration} onChange={handleChange} min="1" className={baseInputClasses} required />
                  </InputField>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 px-6 py-3 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition">
              Cancel
            </button>
            <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
