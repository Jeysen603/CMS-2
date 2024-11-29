export interface Document {
  id: string;
  title: string;
  type: 'contract' | 'pleading' | 'correspondence' | 'evidence' | 'other';
  caseId?: string;
  clientId?: string;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  size: number;
  status: 'draft' | 'final' | 'archived';
  tags: string[];
  description?: string;
  version: number;
  fileType: string;
  fileUrl: string;
}

export interface DocumentValidation {
  maxSize: number; // in bytes
  allowedTypes: string[];
}

export interface DocumentAudit {
  id: string;
  documentId: string;
  action: 'upload' | 'modify' | 'delete' | 'download' | 'view';
  performedBy: string;
  timestamp: string;
  details: string;
}