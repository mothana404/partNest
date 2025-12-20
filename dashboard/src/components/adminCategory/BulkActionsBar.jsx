import { Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';

const BulkActionsBar = ({ selectedCount, onBulkAction, selectedCategories, onClearSelection }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-blue-700">
            {selectedCount} categor{selectedCount === 1 ? 'y' : 'ies'} selected
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkAction('status', selectedCategories, { isActive: true })}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <ToggleRight className="w-3 h-3" />
              Activate
            </button>
            
            <button
              onClick={() => onBulkAction('status', selectedCategories, { isActive: false })}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
            >
              <ToggleLeft className="w-3 h-3" />
              Deactivate
            </button>
            
            <button
              onClick={() => onBulkAction('delete', selectedCategories)}
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