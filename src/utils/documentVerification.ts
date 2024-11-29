import { toast } from 'react-hot-toast';
import type { Document } from '../types/document';

interface VerificationResult {
  isValid: boolean;
  timestamp: string;
  hashValue?: string;
  signatureValid?: boolean;
  fileSize: number;
  fileType: string;
  secureConnection: boolean;
  sourceDomain: string;
  errors: string[];
}

export async function verifyDocument(document: Document): Promise<VerificationResult> {
  const errors: string[] = [];
  const result: VerificationResult = {
    isValid: false,
    timestamp: new Date().toISOString(),
    fileSize: document.size,
    fileType: document.fileType,
    secureConnection: window.location.protocol === 'https:',
    sourceDomain: new URL(document.fileUrl).hostname,
    errors
  };

  try {
    // Verify file size
    if (document.size <= 0) {
      errors.push('Invalid file size');
    }

    // Verify file type hasn't been altered
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(document.fileType)) {
      errors.push('Invalid file type');
    }

    // Verify secure connection
    if (!result.secureConnection) {
      errors.push('Insecure connection detected');
    }

    // Verify source domain
    const trustedDomains = ['lawfirm.com', 'documents.lawfirm.com'];
    if (!trustedDomains.includes(result.sourceDomain)) {
      errors.push('Untrusted source domain');
    }

    // Mock hash verification (in a real app, this would verify against stored hash)
    result.hashValue = await calculateHash(document);
    
    // Set final validation result
    result.isValid = errors.length === 0;

    // Log verification results
    logVerificationResult(result);

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Document verification failed';
    errors.push(message);
    result.isValid = false;
    return result;
  }
}

async function calculateHash(document: Document): Promise<string> {
  try {
    // In a real app, this would calculate actual SHA-256 hash
    // For demo purposes, return a mock hash
    return 'sha256-' + Math.random().toString(36).substring(2);
  } catch (error) {
    throw new Error('Failed to calculate document hash');
  }
}

function logVerificationResult(result: VerificationResult): void {
  console.info('Document Verification Result:', {
    timestamp: result.timestamp,
    isValid: result.isValid,
    hashValue: result.hashValue,
    fileSize: result.fileSize,
    fileType: result.fileType,
    secureConnection: result.secureConnection,
    sourceDomain: result.sourceDomain,
    errors: result.errors
  });
}