import { useState, useCallback, useMemo } from 'react';

export const useCompanies = () => {
  const [allCompanies, setAllCompanies] = useState([]); // Store all companies
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    // Check if toast already exists to prevent duplicates
    const existingToast = document.getElementById('custom-toast');
    if (existingToast) {
      document.body.removeChild(existingToast);
    }

    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white shadow-lg transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, 3000);
  }, []);

  // Fetch ALL companies (for client-side filtering)
  const fetchAllCompanies = useCallback(async (serverFilters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Only send server-side filters (not search, not pagination for full list)
      const { isVerified, isActive, industry } = serverFilters;
      
      if (isVerified !== '' && isVerified !== undefined) {
        queryParams.append('isVerified', isVerified);
      }
      if (isActive !== '' && isActive !== undefined) {
        queryParams.append('isActive', isActive);
      }
      if (industry !== '' && industry !== undefined) {
        queryParams.append('industry', industry);
      }
      
      // Request a large limit to get all companies for client-side filtering
      queryParams.append('limit', '1000');
      queryParams.append('page', '1');

      const url = `${API_BASE_URL}/adminCompany/getAll?${queryParams}`;

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setAllCompanies(data.data.companies || []);
        return data.data.companies || [];
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      showToast(`Failed to fetch companies: ${error.message}`, 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders, showToast]);

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
  }, [API_BASE_URL, getAuthHeaders]);

  const verifyCompany = useCallback(async (companyId, isVerified) => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminCompany/${companyId}/verify`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isVerified }),
      });

      if (response.ok) {
        // Update local state immediately
        setAllCompanies(prev => 
          prev.map(company => 
            company._id === companyId 
              ? { ...company, isVerified } 
              : company
          )
        );
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
  }, [API_BASE_URL, getAuthHeaders, showToast]);

  const toggleCompanyStatus = useCallback(async (companyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminCompany/${companyId}/toggle-status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state immediately
        setAllCompanies(prev => 
          prev.map(company => 
            company._id === companyId 
              ? { ...company, isActive: data.data.isActive } 
              : company
          )
        );
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
  }, [API_BASE_URL, getAuthHeaders, showToast]);

  const deleteCompany = useCallback(async (companyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/adminCompany/${companyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        // Remove from local state immediately
        setAllCompanies(prev => prev.filter(company => company._id !== companyId));
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
  }, [API_BASE_URL, getAuthHeaders, showToast]);

  return {
    allCompanies,
    loading,
    stats,
    fetchAllCompanies,
    fetchStats,
    verifyCompany,
    toggleCompanyStatus,
    deleteCompany,
  };
};