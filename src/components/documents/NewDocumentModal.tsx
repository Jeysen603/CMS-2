import { useState, useRef } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import useDocumentStore from '../../store/documentStore';
import type { Document } from '../../types/document';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (documentData: Omit<Document, 'id'>) => void;
}

export default function NewDocumentModal({
  isOpen,
  onClose,
  onSave,
}: NewDocumentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'contract' as Document['type'],
    caseId: '',
    clientId: '',
    uploadedBy: 'Current User',
    uploadedAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    size: 0,
    status: 'draft' as Document['status'],
    tags: [] as string[],
    description: '',
    version: 1,
    fileType: '',
    fileUrl: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateDocument } = useDocumentStore();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      await validateDocument(file);
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        title: file.name,
        size: file.size,
        fileType: file.type
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error validating file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    try {
      setIsUploading(true);
      // In a real app, upload file to storage and get URL
      const fakeFileUrl = `https://storage.example.com/${selectedFile.name}`;
      
      onSave({
        ...formData,
        fileUrl: fakeFileUrl
      });
      
      onClose();
    } catch (err) {
      setError('Error uploading document');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Upload className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Upload Document</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum file size: 100MB. Supported formats: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>

          {selectedFile && (
            <>
              <Input
                label="Document Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Document['type'] })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                  required
                >
                  <option value="contract">Contract</option>
                  <option value="pleading">Pleading</option>
                  <option value="correspondence">Correspondence</option>
                  <option value="evidence">Evidence</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Case ID"
                  value={formData.caseId}
                  onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                />

                <Input
                  label="Client ID"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isUploading}>
                  Upload Document
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}