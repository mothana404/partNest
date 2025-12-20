import { Trash2, UserCheck, UserX, Shield, X } from 'lucide-react';

const BulkActionsBar = ({ selectedCount, onBulkAction, selectedUsers, onClearSelection }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-blue-700">
            {selectedCount} user(s) selected
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkAction('status', selectedUsers, { isActive: true })}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" />
              Activate
            </button>
            
            <button
              onClick={() => onBulkAction('status', selectedUsers, { isActive: false })}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
            >
              <UserX className="w-3 h-3" />
              Deactivate
            </button>
            
            <button
              onClick={() => onBulkAction('verify', selectedUsers, { isVerified: true })}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Verify
            </button>
            
            <button
              onClick={() => onBulkAction('delete', selectedUsers)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </div>
        </div>
        
        <button
          onClick={onClearSelection}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;