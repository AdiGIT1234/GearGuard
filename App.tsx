import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { CalendarView } from './components/CalendarView';
import { ReportsView } from './components/ReportsView';
import { RequestModal } from './components/RequestModal';
import { MaintenanceRequest, RequestStatus, ViewType, MaintenanceRequestInput } from './types';
import { apiClient } from "@/api/client"


const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('kanban');
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [modalDate, setModalDate] = useState<Date | undefined>(undefined);

  // Load initial data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🌐 Loading data from API...');

      const [requestsRes, teamsRes, equipmentRes] = await Promise.all([
        apiClient.getRequests(),
        apiClient.getTeams(),
        apiClient.getEquipment(),
      ]);

      if (requestsRes.error || teamsRes.error || equipmentRes.error) {
        throw new Error('Failed to load data from API');
      }

      // Transform backend data to frontend format
      const transformedRequests = (requestsRes.data || []).map(transformRequest);
      const transformedTeams = (teamsRes.data || []).map(transformTeam);
      const transformedEquipment = (equipmentRes.data || []).map(transformEquipment);
      
      // Extract technicians from teams
      const allTechnicians = transformedTeams.flatMap(team => 
        (team.members || []).map((member: any) => ({
          id: member.user.id,
          name: member.user.fullName,
          avatarUrl: `https://i.pravatar.cc/150?u=${member.user.id}`,
          teamId: team.id
        }))
      );

      setRequests(transformedRequests);
      setTeams(transformedTeams);
      setEquipment(transformedEquipment);
      setTechnicians(allTechnicians);

      console.log('✅ Data loaded successfully:', {
        requests: transformedRequests.length,
        teams: transformedTeams.length,
        equipment: transformedEquipment.length,
        technicians: allTechnicians.length
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('❌ Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Transform backend request to frontend format
  const transformRequest = (backendRequest: any): MaintenanceRequest => {
    return {
      id: backendRequest.id,
      subject: backendRequest.subject,
      type: backendRequest.requestType === 'CORRECTIVE' ? 'Corrective' : 'Preventive',
      equipmentId: backendRequest.equipmentId,
      scheduledDate: backendRequest.scheduledDate 
        ? new Date(backendRequest.scheduledDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      duration: backendRequest.durationMinutes ? backendRequest.durationMinutes / 60 : 1,
      status: transformStatus(backendRequest.status),
      assignedTechnicianId: backendRequest.assignedTechnicianId || '',
      teamId: backendRequest.maintenanceTeamId,
    };
  };

  const transformStatus = (backendStatus: string): RequestStatus => {
    const statusMap: Record<string, RequestStatus> = {
      'NEW': 'New',
      'IN_PROGRESS': 'In Progress',
      'REPAIRED': 'Repaired',
      'SCRAP': 'Scrap'
    };
    return statusMap[backendStatus] || 'New';
  };

  const transformTeam = (backendTeam: any) => ({
    id: backendTeam.id,
    name: backendTeam.name,
    memberIds: (backendTeam.members || []).map((m: any) => m.userId),
    members: backendTeam.members || []
  });

  const transformEquipment = (backendEquipment: any) => ({
    id: backendEquipment.id,
    name: backendEquipment.name,
    category: backendEquipment.category,
    serialNumber: backendEquipment.serialNumber,
    purchaseDate: backendEquipment.purchaseDate,
    warrantyInfo: backendEquipment.warrantyExpiry 
      ? `Expires ${new Date(backendEquipment.warrantyExpiry).toLocaleDateString()}`
      : 'No warranty',
    location: backendEquipment.location || 'Unknown',
    department: backendEquipment.department?.name,
    maintenanceTeamId: backendEquipment.maintenanceTeamId || '',
    defaultTechnicianId: backendEquipment.assignedEmployeeId || '',
  });

  const handleStatusChange = useCallback(async (requestId: string, newStatus: RequestStatus) => {
    try {
      // Convert frontend status to backend format
      const backendStatus = newStatus.toUpperCase().replace(' ', '_');
      
      console.log(`📝 Updating request ${requestId} to ${backendStatus}`);
      
      const result = await apiClient.updateRequestStatus(requestId, backendStatus);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Update local state
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );

      console.log('✅ Status updated successfully');
    } catch (err) {
      console.error('❌ Error updating status:', err);
      alert('Failed to update request status. Please try again.');
    }
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

  const handleSaveRequest = async (requestData: MaintenanceRequestInput) => {
    try {
      console.log('💾 Saving request:', requestData);

      // Transform to backend format
      const backendData = {
        subject: requestData.subject,
        requestType: requestData.type.toUpperCase(),
        equipmentId: requestData.equipmentId,
        maintenanceTeamId: requestData.teamId,
        assignedTechnicianId: requestData.assignedTechnicianId,
        scheduledDate: new Date(requestData.scheduledDate).toISOString(),
        durationMinutes: requestData.duration * 60,
        priority: 'MEDIUM',
        status: 'NEW'
      };

      if (editingRequest) {
        // Update existing request
        alert('Update functionality requires additional backend endpoint');
        closeModal();
      } else {
        // Create new request
        const result = await apiClient.createRequest(backendData);
        
        if (result.error) {
          throw new Error(result.error);
        }

        console.log('✅ Request created successfully');
        
        // Reload all data to get the new request
        await loadData();
      }
      
      closeModal();
    } catch (err) {
      console.error('❌ Error saving request:', err);
      alert('Failed to save request. Please try again.');
    }
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
      case 'reports':
        return (
          <ReportsView 
            requests={requests} 
            teams={teams} 
            equipment={equipment} 
          />
        );
      default:
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
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <Header 
        currentView={view} 
        setView={setView} 
        onNewRequestClick={() => openModalForNew()} 
      />
      
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