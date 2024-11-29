import { useState } from 'react';
import { MoreVertical, Edit, Trash, Eye, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDocumentDownload } from '../../hooks/useDocumentDownload';
import type { Document } from '../../types/document';

interface DocumentMenuProps {
  document: Document;
  onEdit: (document: Document) => void;
  onDelete: (documentId: string) => void;
  onView: (document: Document) => void;
}

export function DocumentMenu({
  document,
  onEdit,
  onDelete,
  onView,
}: DocumentMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { downloadDocument, isDownloading } = useDocumentDownload();

  const handleDownload = async () => {
    try {
      await downloadDocument(document);
      setIsOpen(false);
    } catch (error) {
      // Error is handled in downloadDocument
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => {
                onView(document);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Document
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
            <button
              onClick={() => {
                onEdit(document);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(document.id);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}