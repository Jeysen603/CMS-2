import type { Client } from '../types/client';
import type { AuditLog } from '../types/audit';

interface ClientUpdate {
  id: string;
  changes: Partial<Client>;
  updatedBy: string;
}

export class ClientService {
  private static generateAuditLog(update: ClientUpdate): AuditLog {
    return {
      id: Date.now().toString(),
      entityId: update.id,
      entityType: 'client',
      action: 'update',
      changes: update.changes,
      performedBy: update.updatedBy,
      timestamp: new Date().toISOString()
    };
  }

  static async saveClientChanges(update: ClientUpdate): Promise<Client> {
    try {
      // In a real app, this would be a database transaction
      const auditLog = this.generateAuditLog(update);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return updated client data
      return {
        id: update.id,
        ...update.changes
      } as Client;
    } catch (error) {
      console.error('Error saving client changes:', error);
      throw new Error('Failed to save client changes');
    }
  }
}