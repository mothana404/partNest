// components/profile/LinksSection.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { 
  Plus, Edit3, Trash2, Save, X, Link, ExternalLink, 
  Github, Linkedin, Globe, Twitter, Instagram, Facebook 
} from "lucide-react";

const LinksSection = ({ links, onUpdate }) => {
  const { getToken } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newLink, setNewLink] = useState({
    type: "WEBSITE",
    url: "",
    label: ""
  });

  const linkTypes = [
    { value: "WEBSITE", label: "Website", icon: Globe, color: "bg-gray-100 text-gray-800" },
    { value: "LINKEDIN", label: "LinkedIn", icon: Linkedin, color: "bg-blue-100 text-blue-800" },
    { value: "GITHUB", label: "GitHub", icon: Github, color: "bg-gray-100 text-gray-800" },
    { value: "TWITTER", label: "Twitter", icon: Twitter, color: "bg-sky-100 text-sky-800" },
    { value: "INSTAGRAM", label: "Instagram", icon: Instagram, color: "bg-pink-100 text-pink-800" },
    { value: "FACEBOOK", label: "Facebook", icon: Facebook, color: "bg-blue-100 text-blue-800" },
    { value: "PORTFOLIO", label: "Portfolio", icon: Globe, color: "bg-purple-100 text-purple-800" },
    { value: "OTHER", label: "Other", icon: Link, color: "bg-gray-100 text-gray-800" }
  ];

  const getLinkTypeConfig = (type) => {
    return linkTypes.find(lt => lt.value === type) || linkTypes[linkTypes.length - 1];
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const formatUrl = (url) => {
    if (!url) return "";
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const handleAdd = async () => {
    if (!newLink.url.trim()) return;
    
    const formattedUrl = formatUrl(newLink.url);
    if (!validateUrl(formattedUrl)) {
      alert("Please enter a valid URL");
      return;
    }

    try {
      const token = getToken();
      await axios.post(
        "http://localhost:8080/api/student/profile/links",
        {
          ...newLink,
          url: formattedUrl,
          label: newLink.label || getLinkTypeConfig(newLink.type).label
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNewLink({ type: "WEBSITE", url: "", label: "" });
      setIsAdding(false);
      onUpdate();
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const handleEdit = async (linkId, updatedData) => {
    const formattedUrl = formatUrl(updatedData.url);
    if (!validateUrl(formattedUrl)) {
      alert("Please enter a valid URL");
      return;
    }

    try {
      const token = getToken();
      await axios.put(
        `http://localhost:8080/api/student/profile/links/${linkId}`,
        {
          ...updatedData,
          url: formattedUrl
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setEditingId(null);
      onUpdate();
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleDelete = async (linkId) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      const token = getToken();
      await axios.delete(
        `http://localhost:8080/api/student/profile/links/${linkId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      onUpdate();
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Link className="w-6 h-6 text-green-600" />
          Links & Social Media
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      {/* Add New Link Form */}
      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Link</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={newLink.type}
                onChange={(e) => setNewLink(prev => ({ 
                  ...prev, 
                  type: e.target.value,
                  label: e.target.value === prev.type ? prev.label : ""
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {linkTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL *
              </label>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label
              </label>
              <input
                type="text"
                value={newLink.label}
                onChange={(e) => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                placeholder={getLinkTypeConfig(newLink.type).label}
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
              Save Link
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

      {/* Links Grid */}
      {links.length === 0 ? (
        <div className="text-center py-8">
          <Link className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No links added yet</p>
          <p className="text-sm text-gray-400">
            Add your social media profiles, portfolio, or website links.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              isEditing={editingId === link.id}
              onEdit={() => setEditingId(link.id)}
              onSave={(data) => handleEdit(link.id, data)}
              onCancel={() => setEditingId(null)}
              onDelete={() => handleDelete(link.id)}
              linkTypes={linkTypes}
              getLinkTypeConfig={getLinkTypeConfig}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Individual Link Card Component
const LinkCard = ({ 
  link, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  linkTypes, 
  getLinkTypeConfig 
}) => {
  const [editData, setEditData] = useState({
    type: link.type,
    url: link.url,
    label: link.label || ""
  });

  const typeConfig = getLinkTypeConfig(link.type);
  const IconComponent = typeConfig.icon;

  if (isEditing) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="space-y-3">
          <select
            value={editData.type}
            onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {linkTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <input
            type="url"
            value={editData.url}
            onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <input
            type="text"
            value={editData.label}
            onChange={(e) => setEditData(prev => ({ ...prev, label: e.target.value }))}
            placeholder="Label"
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeConfig.color}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{link.label || typeConfig.label}</h3>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">
              {link.url.replace(/^https?:\/\//, '')}
            </p>
          </div>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
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
    </div>
  );
};

export default LinksSection;