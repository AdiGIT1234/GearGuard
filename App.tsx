
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { CalendarView } from './components/CalendarView';
import { ReportsView } from './components/ReportsView';
import { RequestModal } from './components/RequestModal';
import { MaintenanceRequest, RequestStatus, ViewType, MaintenanceRequestInput } from './types';
import { initialRequests, initialTeams, initialEquipment, initialTechnicians } from './data/mockData';

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

  const handleStatusChange = useCallback((requestId: string, newStatus: RequestStatus) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  }, []);

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
      // Update existing request
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === editingRequest.id ? { ...editingRequest, ...requestData } : req
        )
      );
    } else {
      // Create new request
      const newRequest: MaintenanceRequest = {
        id: `REQ-${Date.now()}`,
        status: 'New',
        ...requestData,
      };
      setRequests(prevRequests => [...prevRequests, newRequest]);
    }
    closeModal();
  };


  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading data from server...</div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Connection Error
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <div className="space-y-3">
              <button 
                onClick={loadData}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                🔄 Retry Connection
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Make sure the backend server is running on port 5001
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'kanban':
        return <KanbanBoard 
                  requests={requests} 
                  teams={teams} 
                  technicians={technicians} 
                  equipment={equipment}
                  onStatusChange={handleStatusChange} 
                  onEditRequest={openModalForEdit}
                />;
      case 'calendar':
        return <CalendarView requests={requests.filter(r => r.type === 'Preventive')} onAddRequest={openModalForNew} />;
      case 'reports':
        return <ReportsView requests={requests} teams={teams} equipment={equipment} />;
      default:
        return <KanbanBoard 
                  requests={requests} 
                  teams={teams} 
                  technicians={technicians}
                  equipment={equipment}
                  onStatusChange={handleStatusChange} 
                  onEditRequest={openModalForEdit}
                />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <Header currentView={view} setView={setView} onNewRequestClick={() => openModalForNew()} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
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