// components/profile/PreferencesSection.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { Settings, Save, Edit3, MapPin, Briefcase, DollarSign, Clock } from "lucide-react";

const PreferencesSection = ({ preferences, onUpdate }) => {
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    preferredJobTypes: preferences.preferredJobTypes || [],
    preferredLocations: preferences.preferredLocations || [],
    expectedSalaryMin: preferences.expectedSalaryMin || "",
    expectedSalaryMax: preferences.expectedSalaryMax || "",
    availability: preferences.availability ?? true
  });

  const jobTypes = [
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "FREELANCE", label: "Freelance" },
    { value: "REMOTE", label: "Remote" }
  ];

  const commonLocations = [
    "Remote",
    "New York, NY",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
    "Denver, CO",
    "Miami, FL",
    "Atlanta, GA",
    "Philadelphia, PA"
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      await axios.put(
        "http://localhost:8080/api/student/profile/preferences",
        editData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      preferredJobTypes: preferences.preferredJobTypes || [],
      preferredLocations: preferences.preferredLocations || [],
      expectedSalaryMin: preferences.expectedSalaryMin || "",
      expectedSalaryMax: preferences.expectedSalaryMax || "",
      availability: preferences.availability ?? true
    });
    setIsEditing(false);
  };

  const toggleJobType = (jobType) => {
    setEditData(prev => ({
      ...prev,
      preferredJobTypes: prev.preferredJobTypes.includes(jobType)
        ? prev.preferredJobTypes.filter(type => type !== jobType)
        : [...prev.preferredJobTypes, jobType]
    }));
  };

  const addLocation = (location) => {
    if (!editData.preferredLocations.includes(location)) {
      setEditData(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, location]
      }));
    }
  };

  const removeLocation = (location) => {
    setEditData(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(loc => loc !== location)
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-600" />
          Job Preferences
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Preferences
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Availability Status */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Availability</h3>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  checked={editData.availability === true}
                  onChange={() => setEditData(prev => ({ ...prev, availability: true }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">
                  <span className="font-medium">Available for work</span>
                  <span className="block text-gray-500">I'm actively looking for opportunities</span>
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  checked={editData.availability === false}
                  onChange={() => setEditData(prev => ({ ...prev, availability: false }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">
                  <span className="font-medium">Not available</span>
                  <span className="block text-gray-500">I'm not looking for opportunities right now</span>
                </span>
              </label>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${preferences.availability ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-gray-700">
                {preferences.availability ? 'Available for work' : 'Not available'}
              </span>
            </div>
          )}
        </div>

        {/* Preferred Job Types */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Preferred Job Types</h3>
          </div>
          
          {isEditing ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {jobTypes.map((jobType) => (
                <label
                  key={jobType.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    editData.preferredJobTypes.includes(jobType.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={editData.preferredJobTypes.includes(jobType.value)}
                    onChange={() => toggleJobType(jobType.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {jobType.label}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {preferences.preferredJobTypes?.length > 0 ? (
                preferences.preferredJobTypes.map((type) => {
                  const jobType = jobTypes.find(jt => jt.value === type);
                  return (
                    <span
                      key={type}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {jobType ? jobType.label : type}
                    </span>
                  );
                })
              ) : (
                <p className="text-gray-500">No job type preferences set</p>
              )}
            </div>
          )}
        </div>

        {/* Preferred Locations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Preferred Locations</h3>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              {/* Current Locations */}
              <div className="flex flex-wrap gap-2">
                {editData.preferredLocations.map((location) => (
                  <span
                    key={location}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                  >
                    {location}
                    <button
                      onClick={() => removeLocation(location)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              {/* Add Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Location
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {commonLocations
                    .filter(location => !editData.preferredLocations.includes(location))
                    .map((location) => (
                      <button
                        key={location}
                        onClick={() => addLocation(location)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                      >
                        {location}
                      </button>
                    ))}
                </div>
                
                {/* Custom Location Input */}
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Or type a custom location..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        addLocation(e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {preferences.preferredLocations?.length > 0 ? (
                preferences.preferredLocations.map((location) => (
                  <span
                    key={location}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                  >
                    {location}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No location preferences set</p>
              )}
            </div>
          )}
        </div>

        {/* Expected Salary */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Expected Salary Range</h3>
          </div>
          
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary (USD)
                </label>
                <input
                  type="number"
                  value={editData.expectedSalaryMin}
                  onChange={(e) => setEditData(prev => ({ ...prev, expectedSalaryMin: parseInt(e.target.value) || "" }))}
                  placeholder="e.g., 50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary (USD)
                </label>
                <input
                  type="number"
                  value={editData.expectedSalaryMax}
                  onChange={(e) => setEditData(prev => ({ ...prev, expectedSalaryMax: parseInt(e.target.value) || "" }))}
                  placeholder="e.g., 80000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <div>
              {preferences.expectedSalaryMin || preferences.expectedSalaryMax ? (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">
                    ${preferences.expectedSalaryMin?.toLocaleString() || '0'} - ${preferences.expectedSalaryMax?.toLocaleString() || '∞'}
                  </span>
                  <span className="text-gray-500">per year</span>
                </div>
              ) : (
                <p className="text-gray-500">No salary range specified</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;