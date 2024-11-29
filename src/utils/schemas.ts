import { z } from 'zod';

export const clientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format: (XXX) XXX-XXXX'),
  address: z.string().min(1, 'Address is required'),
  status: z.enum(['active', 'inactive'])
});

export const caseSchema = z.object({
  title: z.string().min(1, 'Case title is required'),
  caseNumber: z.string().min(1, 'Case number is required'),
  clientName: z.string().min(1, 'Client name is required'),
  status: z.enum(['active', 'pending', 'closed']),
  priority: z.enum(['high', 'medium', 'low']),
  type: z.string().min(1, 'Case type is required'),
  practiceArea: z.string().min(1, 'Practice area is required'),
  assignedAttorney: z.string().min(1, 'Assigned attorney is required'),
  openDate: z.string(),
  dueDate: z.string().optional(),
  description: z.string().min(1, 'Description is required')
});

export const eventSchema = z.object({
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional(),
  start: z.string(),
  end: z.string(),
  type: z.enum(['court', 'meeting', 'deadline', 'other']),
  location: z.string().optional(),
  attendees: z.array(z.string())
});