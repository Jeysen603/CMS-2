import { useState } from 'react';
import { X, Calendar, Users, FileText, Clock, DollarSign, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import CaseDocumentUpload from './CaseDocumentUpload';
import type { Case } from '../../types/case';

interface CaseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: Case;
  onCreateInvoice: (caseItem: Case) => void;
}

export default function CaseDetailsModal({
  isOpen,
  onClose,
  caseItem,
  onCreateInvoice,
}: CaseDetailsModalProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6">
        {showUploadModal ? (
          <CaseDocumentUpload
            caseData={caseItem}
            onUploadComplete={() => setShowUploadModal(false)}
            onClose={() => setShowUploadModal(false)}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{caseItem.title}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Existing case details content */}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUploadModal(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => onCreateInvoice(caseItem)}>
                <DollarSign className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}