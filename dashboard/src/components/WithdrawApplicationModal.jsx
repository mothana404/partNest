// components/WithdrawApplicationModal.jsx
import { X, AlertTriangle } from "lucide-react";

const WithdrawApplicationModal = ({ application, onClose, onConfirm }) => {
  if (!application) return null;

  const job = application.job || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Withdraw Application</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to withdraw your application for{" "}
            <span className="font-semibold">{job.title}</span>
            {job.company?.companyName && (
              <>
                {" "}at <span className="font-semibold">{job.company.companyName}</span>
              </>
            )}
            ?
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Warning:</span> This action cannot be undone. 
              You will not be able to reapply for this position through the same application.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Yes, Withdraw Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawApplicationModal;