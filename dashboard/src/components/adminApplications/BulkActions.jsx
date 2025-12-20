import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

const BulkActions = ({ 
  selectedCount, 
  onBulkStatusUpdate, 
  onClearSelection 
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleBulkUpdate = () => {
    if (!selectedStatus) return;

    const additionalData = {};
    if (feedback) additionalData.feedback = feedback;
    if (rejectionReason) additionalData.rejectionReason = rejectionReason;

    onBulkStatusUpdate(selectedStatus, additionalData);
    setShowDialog(false);
    setSelectedStatus('');
    setFeedback('');
    setRejectionReason('');
  };

  const Button = ({ children, variant = 'primary', onClick, disabled = false, size = 'md', className = '' }) => {
    const baseStyles = 'inline-flex items-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm'
    };
    
    const variantStyles = {
      primary: 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
    };

    return (
      <button
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };

  const Select = ({ value, onValueChange, children, className = '' }) => {
    const handleChange = (e) => {
      onValueChange(e.target.value);
    };

    return (
      <select
        value={value}
        onChange={handleChange}
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      >
        {children}
      </select>
    );
  };

  const Textarea = ({ value, onChange, placeholder, rows = 3, className = '' }) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );

  const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => onOpenChange(false)} />
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedCount} application{selectedCount !== 1 ? 's' : ''} selected
          </span>
          
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            className="w-[200px]"
          >
            <option value="">Update status to...</option>
            <option value="REVIEWED">Mark as Reviewed</option>
            <option value="INTERVIEW_SCHEDULED">Schedule Interview</option>
            <option value="ACCEPTED">Accept</option>
            <option value="REJECTED">Reject</option>
          </Select>

          <Button
            onClick={() => setShowDialog(true)}
            disabled={!selectedStatus}
            size="sm"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Apply Changes
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
        >
          <X className="w-4 h-4 mr-2" />
          Clear Selection
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Bulk Update Applications
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                You are about to update {selectedCount} applications to "{selectedStatus}".
                {(selectedStatus === 'REJECTED' || selectedStatus === 'ACCEPTED') && 
                  ' You can provide additional feedback below.'}
              </p>

              <div className="space-y-4">
                {selectedStatus === 'REJECTED' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rejection Reason
                    </label>
                    <Select
                      value={rejectionReason}
                      onValueChange={setRejectionReason}
                    >
                      <option value="">Select rejection reason...</option>
                      <option value="Qualifications not met">Qualifications not met</option>
                      <option value="Position filled">Position filled</option>
                      <option value="Experience insufficient">Experience insufficient</option>
                      <option value="Not a cultural fit">Not a cultural fit</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Feedback (Optional)
                  </label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide additional feedback for applicants..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
          <Button onClick={handleBulkUpdate} className="w-full sm:w-auto sm:ml-3">
            Update {selectedCount} Application{selectedCount !== 1 ? 's' : ''}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDialog(false)}
            className="mt-3 w-full sm:mt-0 sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default BulkActions;