import { z } from 'zod';

export interface TimeEntry {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  projectId?: string;
  caseId?: string;
  clientId?: string;
  description: string;
  billable: boolean;
  rate: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  category: 'billable' | 'non-billable' | 'administrative';
  activityCode: string;
  breaks: Break[];
}

export interface Break {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
}

export interface TimeSheet {
  id: string;
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  entries: TimeEntry[];
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  comments?: string;
}

export const activityCodes = [
  { code: 'MEET', description: 'Client Meetings' },
  { code: 'RESEARCH', description: 'Legal Research' },
  { code: 'DOC', description: 'Document Preparation' },
  { code: 'COURT', description: 'Court Appearances' },
  { code: 'ADMIN', description: 'Administrative Tasks' },
  { code: 'CONSULT', description: 'Client Consultation' },
  { code: 'REVIEW', description: 'Document Review' },
  { code: 'DRAFT', description: 'Draft Legal Documents' },
  { code: 'NEGOT', description: 'Negotiations' },
  { code: 'TRAVEL', description: 'Travel Time' }
] as const;

export const timeEntrySchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().min(1, 'Description is required'),
  billable: z.boolean(),
  category: z.enum(['billable', 'non-billable', 'administrative']),
  activityCode: z.string(),
  projectId: z.string().optional(),
  caseId: z.string().optional(),
  clientId: z.string().optional(),
  rate: z.number().min(0)
});