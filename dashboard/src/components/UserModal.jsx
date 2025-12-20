import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, User, Mail, Phone, MapPin, Calendar, Shield, Key, Edit2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const UserModal = ({ user, onClose, onUserUpdate }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchUserDetails();
  }, [user.user_id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(
        `http://localhost:8080/api/admin/users/${user.user_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUserDetails(response.data.data);
        setEditForm(response.data.data.user);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.put(
        `http://localhost:8080/api/admin/users/${user.user_id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setEditing(false);
        fetchUserDetails();
        onUserUpdate();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const token = getToken();
      const response = await axios.post(
        `http://localhost:8080/api/admin/users/${user.user_id}/reset-password`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`Password reset! New temporary password: ${response.data.data.temporaryPassword}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  if (loading && !userDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">User Details</h2>
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

        {userDetails && (
          <div className="p-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </h3>
                
                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editForm.fullName || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={editForm.phoneNumber || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{userDetails.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{userDetails.user.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{userDetails.user.location || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Joined {new Date(userDetails.user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Status
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Role:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      userDetails.user.role === 'ADMIN' ? 'bg-red-100 text-red-800 border-red-200' :
                      userDetails.user.role === 'COMPANY' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {userDetails.user.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      userDetails.user.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {userDetails.user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Verified:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                      userDetails.user.isVerified ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {userDetails.user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleResetPassword}
                  className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Reset Password
                </button>
              </div>
            </div>

            {/* Role Specific Information */}
            {userDetails.user.student && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">University</span>
                      <p className="font-medium">{userDetails.user.student.university}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Major</span>
                      <p className="font-medium">{userDetails.user.student.major}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Year</span>
                      <p className="font-medium">{userDetails.user.student.year || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {userDetails.user.company && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Company Name</span>
                      <p className="font-medium">{userDetails.user.company.companyName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Industry</span>
                      <p className="font-medium">{userDetails.user.company.industry || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {(userDetails.recentApplications || userDetails.recentJobs) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {userDetails.recentApplications && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Recent Applications</h4>
                      {userDetails.recentApplications.map((app, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          Applied to "{app.job.title}" at {app.job.company.companyName}
                        </div>
                      ))}
                    </div>
                  )}
                  {userDetails.recentJobs && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Recent Jobs Posted</h4>
                      {userDetails.recentJobs.map((job, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          "{job.title}" - {job.applicationCount} applications
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {editing && (
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditForm(userDetails.user);
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

export default UserModal;