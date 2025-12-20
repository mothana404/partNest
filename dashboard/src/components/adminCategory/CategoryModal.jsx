import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Tag, Edit2, Save, Briefcase, Users, Calendar } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';

const CategoryModal = ({ category, onClose, onCategoryUpdate }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: category.name,
    isActive: category.isActive
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategoryDetails();
  }, [category.id]);

  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8080/api/admin/categories/${category.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCategoryDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching category details:', error);
      setError('Failed to load category details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onCategoryUpdate(editForm);
    } catch (error) {
      setError('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !categoryDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Category Details
          </h2>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {categoryDetails && (
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="editActive"
                        checked={editForm.isActive}
                        onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="editActive" className="text-sm text-gray-700">
                        Category is active
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Name</span>
                      <p className="font-medium text-lg">{categoryDetails.category.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status</span>
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                          categoryDetails.category.isActive 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {categoryDetails.category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Created {new Date(categoryDetails.category.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Briefcase className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-blue-600">
                      {categoryDetails.category.jobCount || 0}
                    </div>
                    <div className="text-sm text-blue-700">Total Jobs</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {categoryDetails.category.activeJobCount || 0} active
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-green-600">
                      {categoryDetails.category.totalApplications || 0}
                    </div>
                    <div className="text-sm text-green-700">Applications</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Type Distribution */}
            {categoryDetails.jobTypeDistribution && categoryDetails.jobTypeDistribution.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Type Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {categoryDetails.jobTypeDistribution.map((type, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="font-medium text-gray-900">{type.count}</div>
                      <div className="text-sm text-gray-600">{type.jobType}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Jobs */}
            {categoryDetails.recentJobs && categoryDetails.recentJobs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {categoryDetails.recentJobs.map((job, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <div className="font-medium text-sm">{job.title}</div>
                          <div className="text-xs text-gray-500">
                            {job.company.companyName} • {job.jobType}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs px-2 py-1 rounded ${
                            job.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {job.applicationCount} applications
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {editing && (
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditForm({
                      name: category.name,
                      isActive: category.isActive
                    });
                    setError('');
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryModal;