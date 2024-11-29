import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash, FileText, FileSignature, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Case } from '../../types/case';

interface CaseMenuProps {
  case: Case;
  onEdit: (caseItem: Case) => void;
  onDelete: (caseId: string) => void;
  onViewDetails: (caseItem: Case) => void;
  onCreateInvoice: (caseItem: Case) => void;
  onUpdateStatus: (caseItem: Case) => void;
}

export function CaseMenu({ 
  case: caseItem, 
  onEdit, 
  onDelete, 
  onViewDetails,
  onCreateInvoice,
  onUpdateStatus 
}: CaseMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => {
                onViewDetails(caseItem);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Details
            </button>
            <button
              onClick={() => {
                onEdit(caseItem);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => {
                onUpdateStatus(caseItem);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileSignature className="h-4 w-4 mr-2" />
              Update Status
            </button>
            <button
              onClick={() => {
                onCreateInvoice(caseItem);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Create Invoice
            </button>
            <button
              onClick={() => {
                onDelete(caseItem.id);
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