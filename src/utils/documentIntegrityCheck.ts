import { toast } from 'react-hot-toast';
import type { Document } from '../types/document';

interface IntegrityCheckResult {
  isValid: boolean;
  timestamp: string;
  localSize: number;
  cloudSize: number;
  localHash: string;
  cloudHash: string;
  fileType: string;
  lastModified: string;
  discrepancies: string[];
}

export async function verifyDocumentIntegrity(
  document: Document,
  localFile: File
): Promise<IntegrityCheckResult> {
  const discrepancies: string[] = [];
  const result: IntegrityCheckResult = {
    isValid: false,
    timestamp: new Date().toISOString(),
    localSize: localFile.size,
    cloudSize: document.size,
    localHash: '',
    cloudHash: '',
    fileType: localFile.type,
    lastModified: new Date(localFile.lastModified).toISOString(),
    discrepancies
  };

  try {
    // Verify file size
    if (localFile.size !== document.size) {
      discrepancies.push(
        `File size mismatch: Local (${formatSize(localFile.size)}) vs Cloud (${formatSize(document.size)})`
      );
    }

    // Verify file type
    if (localFile.type !== document.fileType) {
      discrepancies.push(
        `File type mismatch: Local (${localFile.type}) vs Cloud (${document.fileType})`
      );
    }

    // Calculate and verify hashes
    result.localHash = await calculateFileHash(localFile);
    result.cloudHash = document.hash || await fetchCloudHash(document);

    if (result.localHash !== result.cloudHash) {
      discrepancies.push('File content hash mismatch - possible file corruption or tampering');
    }

    // Verify last modified timestamp
    const modifiedDiff = Math.abs(
      new Date(localFile.lastModified).getTime() - new Date(document.lastModified).getTime()
    );
    
    if (modifiedDiff > 1000) { // Allow 1 second difference
      discrepancies.push('Last modified timestamp mismatch');
    }

    // Set final validation result
    result.isValid = discrepancies.length === 0;

    // Log verification results
    logVerificationResult(result);

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Integrity check failed';
    discrepancies.push(message);
    result.isValid = false;
    return result;
  }
}

async function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if (!e.target?.result) throw new Error('Failed to read file');
        
        const arrayBuffer = e.target.result as ArrayBuffer;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

async function fetchCloudHash(document: Document): Promise<string> {
  try {
    const response = await fetch(document.fileUrl);
    const blob = await response.blob();
    return calculateFileHash(new File([blob], document.title, { type: document.fileType }));
  } catch (error) {
    throw new Error('Failed to fetch cloud file hash');
  }
}

function formatSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function logVerificationResult(result: IntegrityCheckResult): void {
  console.info('Document Integrity Check Result:', {
    timestamp: result.timestamp,
    isValid: result.isValid,
    localSize: formatSize(result.localSize),
    cloudSize: formatSize(result.cloudSize),
    localHash: result.localHash,
    cloudHash: result.cloudHash,
    fileType: result.fileType,
    lastModified: result.lastModified,
    discrepancies: result.discrepancies
  });

  if (!result.isValid) {
    toast.error('Document integrity check failed', {
      duration: 5000,
      position: 'top-right'
    });
  }
}