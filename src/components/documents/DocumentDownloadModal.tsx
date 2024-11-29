import { useState } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import type { Document } from '../../types/document';

interface DocumentDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
}

export default function DocumentDownloadModal({
  isOpen,
  onClose,
  document
}: DocumentDownloadModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Create download link
      const link = window.document.createElement('a');
      link.href = document.fileUrl;
      link.download = document.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Document downloaded successfully');
      onClose();
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download document');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Download Document</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">{document.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Size: {(document.size / 1024).toFixed(2)} KB
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isDownloading}>
              Cancel
            </Button>
            <Button onClick={handleDownload} disabled={isDownloading}>
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}