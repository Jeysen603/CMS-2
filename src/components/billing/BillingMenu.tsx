import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash, FileText, Send, Download, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Invoice } from '../../types/billing';

interface BillingMenuProps {
  invoice: Invoice;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  onViewDetails: (invoice: Invoice) => void;
  onSend: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  onMarkAsPaid: (invoice: Invoice) => void;
}

export function BillingMenu({
  invoice,
  onEdit,
  onDelete,
  onViewDetails,
  onSend,
  onDownload,
  onMarkAsPaid,
}: BillingMenuProps) {
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
                onViewDetails(invoice);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Details
            </button>
            <button
              onClick={() => {
                onEdit(invoice);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => {
                onDownload(invoice);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
            {invoice.status === 'draft' && (
              <button
                onClick={() => {
                  onSend(invoice);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Client
              </button>
            )}
            {invoice.status === 'sent' && (
              <button
                onClick={() => {
                  onMarkAsPaid(invoice);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Mark as Paid
              </button>
            )}
            <button
              onClick={() => {
                onDelete(invoice.id);
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