import { useState } from "react";
import { 
  X, Share2, Copy, Check, Facebook, Twitter, Linkedin, 
  Mail, MessageCircle, Link2 
} from "lucide-react";

const ShareJobModal = ({ job, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState(null);

  if (!job) {
    return null;
  }

  const jobUrl = `${window.location.origin}/jobs/${job.id}`;
  const jobTitle = `Check out this job: ${job.title || 'Job Opportunity'} at ${job.company?.companyName || 'a great company'}`;
  const encodedJobTitle = encodeURIComponent(jobTitle);
  const encodedJobUrl = encodeURIComponent(jobUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);
      
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
      
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      setCopyTimeout(timeout);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = jobUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      color: copied ? "bg-green-100 hover:bg-green-200 text-green-700" : "bg-gray-100 hover:bg-gray-200 text-gray-700",
      action: handleCopyLink,
      description: "Copy job link to clipboard"
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-blue-100 hover:bg-blue-200 text-blue-700",
      action: () => {
        window.open(`mailto:?subject=${encodedJobTitle}&body=I found this job opportunity that might interest you: ${encodedJobUrl}`);
      },
      description: "Share via email"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-100 hover:bg-green-200 text-green-700",
      action: () => {
        window.open(`https://wa.me/?text=${encodedJobTitle} ${encodedJobUrl}`, '_blank');
      },
      description: "Share on WhatsApp"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-100 hover:bg-blue-200 text-blue-800",
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedJobUrl}`, '_blank');
      },
      description: "Share on LinkedIn"
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-100 hover:bg-sky-200 text-sky-700",
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodedJobTitle}&url=${encodedJobUrl}`, '_blank');
      },
      description: "Share on Twitter"
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-100 hover:bg-blue-200 text-blue-600",
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedJobUrl}`, '_blank');
      },
      description: "Share on Facebook"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Share Job</h2>
                <p className="text-sm text-gray-500">Spread the word about this opportunity</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Job Preview */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
              {job.company?.user?.image ? (
                <img 
                  src={job.company.user.image} 
                  alt={job.company?.companyName || 'Company'}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <span className="text-blue-600 font-semibold text-lg">
                  {job.company?.companyName?.charAt(0) || 'C'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 break-words">
                {job.title || 'Job Title'}
              </h3>
              <p className="text-sm text-gray-600">
                {job.company?.companyName || 'Company'}
              </p>
              <p className="text-sm text-gray-500">
                {job.location || 'Remote'} • {job.jobType?.replace('_', ' ') || 'Job Type'}
              </p>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose how to share</h3>
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={index}
                  onClick={option.action}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${option.color}`}
                  title={option.description}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              );
            })}
          </div>

          {/* Direct Link Section */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Direct Link</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={jobUrl}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 truncate"
                />
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 text-sm border rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                  copied 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareJobModal;