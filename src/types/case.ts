export interface Case {
  id: string;
  title: string;
  caseNumber: string;
  clientName: string;
  status: 'active' | 'pending' | 'closed';
  practiceArea: string;
  assignedAttorney: string;
  openDate: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
  type?: string;
}