import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useDocumentStore from '../store/documentStore';
import type { Document } from '../types/document';

interface UploadOptions {
  caseId?: string;
  clientId?: string;
  userId: string;
}

export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { validateDocument, addDocument } = useDocumentStore();

  const uploadDocument = async (
    file: File,
    metadata: Partial<Document>,
    options: UploadOptions
  ) => {
    try {
      setIsUploading(true);

      // Validate file
      await validateDocument(file);

      // In a real app, this would upload to a storage service
      const fileUrl = URL.createObjectURL(file);

      const document: Document = {
        id: Date.now().toString(),
        title: metadata.title || file.name,
        type: metadata.type || 'other',
        caseId: options.caseId,
        clientId: options.clientId,
        uploadedBy: options.userId,
        uploadedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        size: file.size,
        status: metadata.status || 'draft',
        tags: metadata.tags || [],
        description: metadata.description || '',
        version: 1,
        fileType: file.type,
        fileUrl
      };

      await addDocument(document);
      toast.success('Document uploaded successfully');
      return document;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload document';
      toast.error(message);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadDocument,
    isUploading
  };
};