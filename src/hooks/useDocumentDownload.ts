import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import { verifyDocumentIntegrity } from '../utils/documentIntegrityCheck';
import type { Document } from '../types/document';

interface DownloadProgress {
  loaded: number;
  total: number;
}

export const useDocumentDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);

  const downloadDocument = async (document: Document) => {
    try {
      setIsDownloading(true);
      setProgress({ loaded: 0, total: document.size });

      // Download file
      const response = await fetch(document.fileUrl);
      const blob = await response.blob();
      const file = new File([blob], document.title, { type: document.fileType });

      // Update progress
      setProgress({ loaded: document.size, total: document.size });

      // Verify integrity
      const verificationResult = await verifyDocumentIntegrity(document, file);
      
      if (!verificationResult.isValid) {
        const errors = verificationResult.discrepancies.join('\n');
        toast.error(`Document verification failed:\n${errors}`, {
          duration: 5000,
          position: 'top-right'
        });
        return;
      }

      // Save file
      saveAs(blob, document.title);
      toast.success('Document downloaded and verified successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download document';
      toast.error(message);
      throw error;
    } finally {
      setIsDownloading(false);
      setProgress(null);
    }
  };

  return {
    downloadDocument,
    isDownloading,
    progress
  };
};