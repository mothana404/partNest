import { useState, useCallback } from 'react';

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const fetchCompanies = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const url = `${API_BASE_URL}/adminCompany/getAll?${queryParams}`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setCompanies(data.data.companies);
        setPagination(data.data.pagination);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      showToast(`Failed to fetch companies: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminCompany/stats/overview`, {
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

  const verifyCompany = useCallback(async (companyId, isVerified) => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminCompany/${companyId}/verify`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isVerified }),
      });

      if (response.ok) {
        showToast(`Company ${isVerified ? 'verified' : 'unverified'} successfully`);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error verifying company:', error);
      showToast(`Failed to update verification: ${error.message}`, 'error');
      return false;
    }
  }, [API_BASE_URL]);

  const toggleCompanyStatus = useCallback(async (companyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminCompany/${companyId}/toggle-status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        showToast(`Company ${data.data.isActive ? 'activated' : 'deactivated'} successfully`);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error toggling company status:', error);
      showToast(`Failed to update status: ${error.message}`, 'error');
      return false;
    }
  }, [API_BASE_URL]);

  const deleteCompany = useCallback(async (companyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminCompany/${companyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        showToast('Company deleted successfully');
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      showToast(`Failed to delete company: ${error.message}`, 'error');
      return false;
    }
  }, [API_BASE_URL]);

  return {
    companies,
    loading,
    pagination,
    stats,
    fetchCompanies,
    fetchStats,
    verifyCompany,
    toggleCompanyStatus,
    deleteCompany,
  };
};