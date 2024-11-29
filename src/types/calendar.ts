export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  type: 'court' | 'meeting' | 'deadline' | 'other';
  caseId?: string;
  clientId?: string;
  attendees: string[];
  location?: string;
}