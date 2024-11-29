import { z } from 'zod';
import { isAfter, isBefore, isValid } from 'date-fns';

const caseSchema = z.object({
  title: z.string().min(1, 'Case title is required'),
  caseNumber: z.string().min(1, 'Case number is required'),
  clientName: z.string().min(1, 'Client name is required'),
  status: z.enum(['active', 'pending', 'closed']),
  priority: z.string().min(1, 'Priority level is required'),
  type: z.string().min(1, 'Case type is required'),
  practiceArea: z.string().min(1, 'Practice area is required'),
  assignedAttorney: z.string().min(1, 'Assigned attorney is required'),
  openDate: z.string().refine(val => {
    const date = new Date(val);
    return isValid(date);
  }, 'Invalid filing date'),
  dueDate: z.string().refine(val => {
    const date = new Date(val);
    return isValid(date);
  }, 'Invalid due date'),
  description: z.string().min(1, 'Description is required')
});

export const validateCaseData = (data: Record<string, any>): Record<string, string> => {
  try {
    caseSchema.parse(data);

    // Additional validation for dates
    const openDate = new Date(data.openDate);
    const dueDate = new Date(data.dueDate);

    if (isAfter(openDate, dueDate)) {
      return { dueDate: 'Due date must be after filing date' };
    }

    if (isBefore(dueDate, new Date())) {
      return { dueDate: 'Due date cannot be in the past' };
    }

    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.reduce((acc, err) => ({
        ...acc,
        [err.path[0]]: err.message
      }), {});
    }
    return { form: 'Invalid form data' };
  }
};