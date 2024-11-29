import { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Invoice, InvoiceItem } from '../../types/billing';
import type { Case } from '../../types/case';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Omit<Invoice, 'id'>) => void;
  caseData?: Case;
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  onSave,
  caseData
}: CreateInvoiceModalProps) {
  const [formData, setFormData] = useState({
    caseId: caseData?.id || '',
    clientId: '',
    amount: 0,
    status: 'draft' as const,
    dueDate: '',
    issueDate: new Date().toISOString().split('T')[0],
    items: [] as Omit<InvoiceItem, 'id'>[]
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: '',
          hours: 0,
          rate: 350,
          amount: 0
        }
      ]
    });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Recalculate amount if hours or rate changes
    if (field === 'hours' || field === 'rate') {
      newItems[index].amount = newItems[index].hours * newItems[index].rate;
    }

    // Update total amount
    const totalAmount = newItems.reduce((sum, item) => sum + item.amount, 0);

    setFormData({
      ...formData,
      items: newItems,
      amount: totalAmount
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + item.amount, 0);

    setFormData({
      ...formData,
      items: newItems,
      amount: totalAmount
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Case Information */}
          {caseData && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Case Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500">Case Title</label>
                  <div className="text-sm font-medium">{caseData.title}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Case Number</label>
                  <div className="text-sm font-medium">{caseData.caseNumber}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Client</label>
                  <div className="text-sm font-medium">{caseData.clientName}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Attorney</label>
                  <div className="text-sm font-medium">{caseData.assignedAttorney}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Issue Date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              required
            />

            <Input
              type="date"
              label="Due Date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button type="button" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Input
                      label="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      label="Hours"
                      type="number"
                      step="0.25"
                      min="0"
                      value={item.hours}
                      onChange={(e) => updateItem(index, 'hours', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      label="Rate ($/hr)"
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <div className="px-3 py-2 bg-gray-100 rounded-md">
                      ${item.amount.toFixed(2)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-8 p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-semibold">
              Total Amount: ${formData.amount.toFixed(2)}
            </div>
            <div className="space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Create Invoice
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}