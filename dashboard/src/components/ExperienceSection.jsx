// components/profile/ExperienceSection.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { Plus, Edit3, Trash2, Save, X, Briefcase, MapPin, Calendar, Building2 } from "lucide-react";

const ExperienceSection = ({ experiences, onUpdate }) => {
  const { getToken } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newExperience, setNewExperience] = useState({
    title: "",
    companyName: "",
    description: "",
    location: "",
    employmentType: "FULL_TIME",
    startDate: "",
    endDate: "",
    isCurrent: false
  });

  const employmentTypes = [
    { value: "FULL_TIME", label: "Full-time" },
    { value: "PART_TIME", label: "Part-time" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "FREELANCE", label: "Freelance" },
    { value: "CONTRACT", label: "Contract" },
    { value: "VOLUNTEER", label: "Volunteer" }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const calculateDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (months < 1) return "Less than a month";
    if (months === 1) return "1 month";
    if (months < 12) return `${months} months`;
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return years === 1 ? "1 year" : `${years} years`;
    }
    
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  };

  const handleAdd = async () => {
    if (!newExperience.title.trim() || !newExperience.startDate) return;

    try {
      const token = getToken();
      await axios.post(
        "http://localhost:8080/api/student/profile/experience",
        newExperience,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNewExperience({
        title: "",
        companyName: "",
        description: "",
        location: "",
        employmentType: "FULL_TIME",
        startDate: "",
        endDate: "",
        isCurrent: false
      });
      setIsAdding(false);
      onUpdate();
    } catch (error) {
      console.error("Error adding experience:", error);
    }
  };

  const handleEdit = async (expId, updatedData) => {
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:8080/api/student/profile/experience/${expId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error("Error updating experience:", error);
    }
  };

  const handleDelete = async (expId) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;

    try {
      const token = getToken();
      await axios.delete(
        `http://localhost:8080/api/student/profile/experience/${expId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      onUpdate();
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          Work Experience
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* Add New Experience Form */}
      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Experience</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Software Engineer Intern"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newExperience.companyName}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="e.g., Tech Company Inc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  value={newExperience.employmentType}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, employmentType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {employmentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newExperience.location}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., New York, NY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newExperience.startDate}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
                            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={newExperience.endDate}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, endDate: e.target.value }))}
                  disabled={newExperience.isCurrent}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <div className="mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newExperience.isCurrent}
                      onChange={(e) => setNewExperience(prev => ({ 
                        ...prev, 
                        isCurrent: e.target.checked,
                        endDate: e.target.checked ? "" : prev.endDate
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">I currently work here</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={newExperience.description}
                onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your responsibilities and achievements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Experience
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Experience List */}
      {experiences.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No work experience added yet</p>
          <p className="text-sm text-gray-400">
            Add your work experience to showcase your professional background.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                isEditing={editingId === experience.id}
                onEdit={() => setEditingId(experience.id)}
                onSave={(data) => handleEdit(experience.id, data)}
                onCancel={() => setEditingId(null)}
                onDelete={() => handleDelete(experience.id)}
                employmentTypes={employmentTypes}
                formatDate={formatDate}
                calculateDuration={calculateDuration}
              />
            ))}
        </div>
      )}
    </div>
  );
};

// Individual Experience Card Component
const ExperienceCard = ({ 
  experience, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  employmentTypes,
  formatDate,
  calculateDuration
}) => {
  const [editData, setEditData] = useState({
    title: experience.title,
    companyName: experience.companyName || "",
    description: experience.description || "",
    location: experience.location || "",
    employmentType: experience.employmentType || "FULL_TIME",
    startDate: experience.startDate ? experience.startDate.split('T')[0] : "",
    endDate: experience.endDate ? experience.endDate.split('T')[0] : "",
    isCurrent: experience.isCurrent
  });

  const getEmploymentTypeLabel = (type) => {
    const empType = employmentTypes.find(et => et.value === type);
    return empType ? empType.label : type;
  };

  if (isEditing) {
    return (
      <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Experience</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={editData.companyName}
                onChange={(e) => setEditData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <select
                value={editData.employmentType}
                onChange={(e) => setEditData(prev => ({ ...prev, employmentType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {employmentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={editData.location}
                onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={editData.startDate}
                onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={editData.endDate}
                onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))}
                disabled={editData.isCurrent}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editData.isCurrent}
                    onChange={(e) => setEditData(prev => ({ 
                      ...prev, 
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? "" : prev.endDate
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">I currently work here</span>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => onSave(editData)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group border-l-4 border-blue-200 pl-6 relative">
      <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{experience.title}</h3>
            {experience.isCurrent && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Current
              </span>
            )}
          </div>
          
          {experience.companyName && (
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{experience.companyName}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{getEmploymentTypeLabel(experience.employmentType)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(experience.startDate)} - {experience.isCurrent ? 'Present' : formatDate(experience.endDate)}
              </span>
            </div>
            
            <span>•</span>
            
            <span>
              {calculateDuration(experience.startDate, experience.endDate, experience.isCurrent)}
            </span>
            
            {experience.location && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{experience.location}</span>
                </div>
              </>
            )}
          </div>
          
          {experience.description && (
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {experience.description}
            </p>
          )}
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 ml-4 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection;