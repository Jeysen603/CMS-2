import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { Document } from '../types/document';

interface DocumentState {
  documents: Document[];
  addDocument: (document: Document) => void;
  updateDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  validateDocument: (file: File) => Promise<boolean>;
}

const useDocumentStore = create<DocumentState>((set) => ({
  documents: [
    {
      id: '1',
      title: 'Sample Document.pdf',
      type: 'contract',
      uploadedBy: 'admin',
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      size: 1024 * 1024, // 1MB
      status: 'final',
      tags: ['contract', 'sample'],
      version: 1,
      fileType: 'application/pdf',
      fileUrl: '/sample.pdf'
    }
  ],

  addDocument: (document) => {
    set((state) => ({
      documents: [...state.documents, document]
    }));
    toast.success('Document added successfully');
  },

  updateDocument: (document) => {
    set((state) => ({
      documents: state.documents.map((d) => 
        d.id === document.id ? document : d
      )
    }));
    toast.success('Document updated successfully');
  },

  deleteDocument: (id) => {
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id)
    }));
    toast.success('Document deleted successfully');
  },

  validateDocument: async (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (file.size > maxSize) {
      toast.error('File size exceeds 100MB limit');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not supported');
      return false;
    }

    return true;
  }
}));

export default useDocumentStore;