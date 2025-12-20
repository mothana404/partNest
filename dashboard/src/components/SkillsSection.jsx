// components/profile/SkillsSection.jsx
import { useState } from "react";
import axios from "axios";
import { Plus, Edit3, Trash2, Save, X, Star } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const SkillsSection = ({ skills, onUpdate }) => {
  const { getToken } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "BEGINNER",
    yearsOfExp: 0
  });

  const skillLevels = [
    { value: "BEGINNER", label: "Beginner", color: "bg-gray-100 text-gray-800" },
    { value: "INTERMEDIATE", label: "Intermediate", color: "bg-blue-100 text-blue-800" },
    { value: "ADVANCED", label: "Advanced", color: "bg-green-100 text-green-800" },
    { value: "EXPERT", label: "Expert", color: "bg-purple-100 text-purple-800" }
  ];

  const getSkillLevelConfig = (level) => {
    return skillLevels.find(sl => sl.value === level) || skillLevels[0];
  };

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return;

    try {
      const token = getToken();
      await axios.post(
        "http://localhost:8080/api/student/profile/skills",
        newSkill,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNewSkill({ name: "", level: "BEGINNER", yearsOfExp: 0 });
      setIsAdding(false);
      onUpdate();
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleEdit = async (skillId, updatedData) => {
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:8080/api/student/profile/skills/${skillId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  const handleDelete = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      const token = getToken();
      await axios.delete(
        `http://localhost:8080/api/student/profile/skills/${skillId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      onUpdate();
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          Skills & Expertise
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Add New Skill Form */}
      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Skill</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Name
              </label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., JavaScript, Python, Design..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proficiency Level
              </label>
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {skillLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={newSkill.yearsOfExp}
                onChange={(e) => setNewSkill(prev => ({ ...prev, yearsOfExp: parseInt(e.target.value) || 0 }))}
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
              Save Skill
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

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No skills added yet</p>
          <p className="text-sm text-gray-400">
            Add your skills to showcase your expertise to potential employers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              isEditing={editingId === skill.id}
              onEdit={() => setEditingId(skill.id)}
              onSave={(data) => handleEdit(skill.id, data)}
              onCancel={() => setEditingId(null)}
              onDelete={() => handleDelete(skill.id)}
              skillLevels={skillLevels}
              getSkillLevelConfig={getSkillLevelConfig}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Individual Skill Card Component
const SkillCard = ({ 
  skill, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  skillLevels, 
  getSkillLevelConfig 
}) => {
  const [editData, setEditData] = useState({
    name: skill.name,
    level: skill.level,
    yearsOfExp: skill.yearsOfExp
  });

  const levelConfig = getSkillLevelConfig(skill.level);

  if (isEditing) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <select
            value={editData.level}
            onChange={(e) => setEditData(prev => ({ ...prev, level: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {skillLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            min="0"
            max="50"
            value={editData.yearsOfExp}
            onChange={(e) => setEditData(prev => ({ ...prev, yearsOfExp: parseInt(e.target.value) || 0 }))}
            placeholder="Years"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onSave(editData)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 bg-white">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900">{skill.name}</h3>
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${levelConfig.color} mb-2`}>
        {levelConfig.label}
      </div>
      
      {skill.yearsOfExp > 0 && (
        <p className="text-xs text-gray-500">
          {skill.yearsOfExp} year{skill.yearsOfExp !== 1 ? 's' : ''} experience
        </p>
      )}
    </div>
  );
};

export default SkillsSection;