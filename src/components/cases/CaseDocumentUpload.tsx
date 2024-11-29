import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useDocumentUpload } from '../../hooks/useDocumentUpload';
import useAuthStore from '../../store/authStore';
import type { Case } from '../../types/case';

interface CaseDocumentUploadProps {
  caseData: Case;
  onUploadComplete: () => void;
  onClose: () => void;
}

export default function CaseDocumentUpload({
  caseData,
  onUploadComplete,
  onClose
}: CaseDocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('pleading');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuthStore();
  const { uploadDocument, isUploading } = useDocumentUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    try {
      await uploadDocument(
        selectedFile,
        {
          title,
          description,
          type,
          tags: [caseData.practiceArea]
        },
        {
          caseId: caseData.id,
          clientId: caseData.clientName,
          userId: user.id
        }
      );
      
      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Upload className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold">Upload Case Document</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

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
        </div>

        {selectedFile && (
          <>
            <Input
              label="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                required
              >
                <option value="pleading">Pleading</option>
                <option value="contract">Contract</option>
                <option value="correspondence">Correspondence</option>
                <option value="evidence">Evidence</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
  );
}