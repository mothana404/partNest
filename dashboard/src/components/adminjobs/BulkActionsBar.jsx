import { Trash2, Play, Pause, CheckCircle, X } from 'lucide-react';

const BulkActionsBar = ({ selectedCount, onBulkAction, selectedJobs, onClearSelection }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-blue-700">
            {selectedCount} job{selectedCount === 1 ? '' : 's'} selected
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkAction('status', selectedJobs, { status: 'ACTIVE' })}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              Activate
            </button>
            
            <button
              onClick={() => onBulkAction('status', selectedJobs, { status: 'PAUSED' })}
              className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center gap-1"
            >
              <Pause className="w-3 h-3" />
              Pause
            </button>

            <button
              onClick={() => onBulkAction('approve', selectedJobs)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3" />
              Approve
            </button>
            
            <button
              onClick={() => onBulkAction('status', selectedJobs, { status: 'CLOSED' })}
              className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Close
            </button>
            
            <button
              onClick={() => onBulkAction('delete', selectedJobs)}
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