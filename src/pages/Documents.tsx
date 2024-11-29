import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DocumentMenu } from '../components/documents/DocumentMenu';
import NewDocumentModal from '../components/documents/NewDocumentModal';
import DocumentPreviewModal from '../components/documents/DocumentPreviewModal';
import useDocumentStore from '../store/documentStore';
import { useSearch } from '../hooks/useSearch';
import { toast } from 'react-hot-toast';
import type { Document } from '../types/document';

export default function Documents() {
  const [isNewDocumentModalOpen, setIsNewDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { documents, addDocument, updateDocument, deleteDocument } = useDocumentStore();
  
  const { searchQuery, filteredItems: filteredDocuments, handleSearch } = useSearch({
    items: documents,
    searchFields: ['title', 'description', 'tags']
  });

  const handleEditDocument = (document: Document) => {
    toast.error('Edit functionality not yet implemented');
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(documentId);
        toast.success('Document deleted successfully');
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleSaveNewDocument = async (documentData: Omit<Document, 'id'>) => {
    try {
      const newDocument: Document = {
        ...documentData,
        id: Date.now().toString(),
      };
      await addDocument(newDocument);
      setIsNewDocumentModalOpen(false);
      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
        <Button onClick={() => setIsNewDocumentModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modified
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDocument(document)}
                      className="flex items-center text-left hover:text-indigo-600"
                    >
                      <span className="font-medium">{document.title}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {document.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatFileSize(document.size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(document.lastModified).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <DocumentMenu
                      document={document}
                      onEdit={handleEditDocument}
                      onDelete={handleDeleteDocument}
                      onView={handleViewDocument}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewDocumentModal
        isOpen={isNewDocumentModalOpen}
        onClose={() => setIsNewDocumentModalOpen(false)}
        onSave={handleSaveNewDocument}
      />

      {selectedDocument && (
        <DocumentPreviewModal
          isOpen={true}
          onClose={() => setSelectedDocument(null)}
          document={selectedDocument}
        />
      )}
    </div>
  );
}