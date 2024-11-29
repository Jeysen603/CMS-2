export interface AuditLog {
  id: string;
  entityId: string;
  entityType: 'client' | 'case' | 'document';
  action: 'create' | 'update' | 'delete';
  changes: Record<string, any>;
  performedBy: string;
  timestamp: string;
}