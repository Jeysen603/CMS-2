import { toast } from 'react-hot-toast';
import { saveAs } from 'file-saver';

export async function openDocument(fileUrl: string, fileType: string): Promise<void> {
  try {
    // For PDFs and images, open in new tab
    if (fileType.startsWith('image/') || fileType === 'application/pdf') {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // For other file types, download using file-saver
    await downloadDocument(fileUrl, fileUrl.split('/').pop() || 'document');
  } catch (error) {
    console.error('Error opening document:', error);
    toast.error('Unable to open document. Please try downloading instead.');
  }
}

export async function downloadDocument(fileUrl: string, filename: string): Promise<void> {
  try {
    // For demo purposes, create a mock blob
    // In a real app, this would be a real file URL
    const mockContent = 'Mock file content for demo purposes';
    const blob = new Blob([mockContent], { type: 'text/plain' });
    
    saveAs(blob, filename);
    toast.success('Document downloaded successfully');
  } catch (error) {
    console.error('Download failed:', error);
    toast.error('Failed to download document. Please try again later.');
  }
}