const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Equipment endpoints
  async getEquipment() {
    return this.request('/equipment');
  }

  async createEquipment(data: any) {
    return this.request('/equipment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Teams endpoints
  async getTeams() {
    return this.request('/teams');
  }

  async createTeam(data: any) {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Requests endpoints
  async getRequests(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/requests${query}`);
  }

  async createRequest(data: any) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRequestStatus(id: string, status: string) {
    return this.request(`/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Kanban endpoints
  async getKanbanCards(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/kanban${query}`);
  }

  async moveKanbanCard(id: string, status: string) {
    return this.request(`/kanban/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getOverdueCards() {
    return this.request('/kanban/overdue');
  }

  // Calendar endpoints
  async getCalendarEvents() {
    return this.request('/calendar');
  }

  async getPreventiveCalendar() {
    return this.request('/requests/calendar/preventive');
  }
}

export const apiClient = new ApiClient(API_URL);