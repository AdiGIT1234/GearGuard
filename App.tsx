import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { CalendarView } from './components/CalendarView';
import { ReportsView } from './components/ReportsView';
import { RequestModal } from './components/RequestModal';
import { EquipmentView } from './components/EquipmentView';
import { TeamsView } from './components/TeamsView';

import {
  MaintenanceRequest,
  RequestStatus,
  ViewType,
  MaintenanceRequestInput,
} from './types';

import {
  initialRequests,
  initialTeams,
  initialEquipment,
  initialTechnicians,
} from './data/mockData';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('kanban');
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);

  const [teams] = useState(initialTeams);
  const [equipment] = useState(initialEquipment);
  const [technicians] = useState(initialTechnicians);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] =
    useState<MaintenanceRequest | null>(null);
  const [modalDate, setModalDate] = useState<Date | undefined>(undefined);

  const handleStatusChange = useCallback(
    (requestId: string, newStatus: RequestStatus) => {
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    },
    []
  );

  const openModalForNew = (date?: Date) => {
    setEditingRequest(null);
    setModalDate(date);
    setIsModalOpen(true);
  };

  const openModalForEdit = (request: MaintenanceRequest) => {
    setEditingRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRequest(null);
    setModalDate(undefined);
  };

  const handleSaveRequest = (requestData: MaintenanceRequestInput) => {
    if (editingRequest) {
      setRequests(prev =>
        prev.map(req =>
          req.id === editingRequest.id
            ? { ...editingRequest, ...requestData }
            : req
        )
      );
    } else {
      const newRequest: MaintenanceRequest = {
        id: `REQ-${Date.now()}`,
        status: 'New',
        ...requestData,
      };
      setRequests(prev => [...prev, newRequest]);
    }
    closeModal();
  };

  const renderView = () => {
    switch (view) {
      case 'kanban':
        return (
          <KanbanBoard
            requests={requests}
            teams={teams}
            technicians={technicians}
            equipment={equipment}
            onStatusChange={handleStatusChange}
            onEditRequest={openModalForEdit}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            requests={requests.filter(r => r.type === 'Preventive')}
            onAddRequest={openModalForNew}
          />
        );

      case 'equipment':
        return (
          <EquipmentView
            equipment={equipment}
            requests={requests}
            onEditRequest={openModalForEdit}
          />
        );

      case 'teams':
        return <TeamsView teams={teams} requests={requests} />;

      case 'reports':
        return (
          <ReportsView
            requests={requests}
            teams={teams}
            equipment={equipment}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <Header
        currentView={view}
        setView={setView}
        onNewRequestClick={openModalForNew}
      />

      <main className="p-4 sm:p-6 lg:p-8">{renderView()}</main>

      {isModalOpen && (
        <RequestModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveRequest}
          request={editingRequest}
          equipmentList={equipment}
          teamList={teams}
          technicianList={technicians}
          defaultDate={modalDate}
        />
      )}
    </div>
  );
};

export default App;
