import { useState, useCallback } from 'react';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const showToast = (message, type = 'success') => {
    // Simple toast implementation - you can replace with your preferred toast library
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const fetchApplications = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/adminApplications/allApplications?${queryParams}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.data.applications);
        setPagination(data.data.pagination);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      showToast('Failed to fetch applications', 'error');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminApplications/stats/overview`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [API_BASE_URL]);

  const fetchTrends = useCallback(async (period = 'week') => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminApplications/analytics/trends?period=${period}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setTrends(data.data);
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  }, [API_BASE_URL]);

  const updateApplicationStatus = useCallback(async (applicationId, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminApplications/${applicationId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        showToast('Application status updated successfully');
        return true;
      } else {
        throw new Error('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      showToast('Failed to update application status', 'error');
      return false;
    }
  }, [API_BASE_URL]);

  const deleteApplication = useCallback(async (applicationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminApplications/${applicationId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        showToast('Application deleted successfully');
        return true;
      } else {
        throw new Error('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      showToast('Failed to delete application', 'error');
      return false;
    }
  }, [API_BASE_URL]);

  const bulkUpdateStatus = useCallback(async (applicationIds, status, additionalData = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminApplications/bulk/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          applicationIds,
          status,
          ...additionalData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showToast(`${data.data.updatedCount} applications updated successfully`);
        return true;
      } else {
        throw new Error('Failed to bulk update applications');
      }
    } catch (error) {
      console.error('Error bulk updating applications:', error);
      showToast('Failed to bulk update applications', 'error');
      return false;
    }
  }, [API_BASE_URL]);

  return {
    applications,
    loading,
    pagination,
    stats,
    trends,
    fetchApplications,
    fetchStats,
    fetchTrends,
    updateApplicationStatus,
    deleteApplication,
    bulkUpdateStatus,
  };
};