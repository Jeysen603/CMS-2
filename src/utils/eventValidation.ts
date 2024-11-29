import { isWithinInterval, areIntervalsOverlapping } from 'date-fns';
import type { CalendarEvent } from '../types/calendar';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateEventTimes = (start: Date, end: Date): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (isNaN(start.getTime())) {
    errors.push({ field: 'start', message: 'Invalid start date' });
  }

  if (isNaN(end.getTime())) {
    errors.push({ field: 'end', message: 'Invalid end date' });
  }

  if (start >= end) {
    errors.push({ field: 'end', message: 'End time must be after start time' });
  }

  return errors;
};

export const checkEventConflicts = (
  newEvent: Omit<CalendarEvent, 'id'>,
  existingEvents: CalendarEvent[],
  excludeEventId?: string
): CalendarEvent[] => {
  const newInterval = {
    start: new Date(newEvent.start),
    end: new Date(newEvent.end),
  };

  return existingEvents.filter((event) => {
    if (event.id === excludeEventId) return false;

    return areIntervalsOverlapping(
      newInterval,
      {
        start: new Date(event.start),
        end: new Date(event.end),
      }
    );
  });
};

export const validateEventData = (
  eventData: Partial<CalendarEvent>,
  existingEvents: CalendarEvent[] = [],
  excludeEventId?: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!eventData.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  if (!eventData.start) {
    errors.push({ field: 'start', message: 'Start time is required' });
  }

  if (!eventData.end) {
    errors.push({ field: 'end', message: 'End time is required' });
  }

  if (!eventData.type) {
    errors.push({ field: 'type', message: 'Event type is required' });
  }

  // Time validation
  if (eventData.start && eventData.end) {
    const timeErrors = validateEventTimes(
      new Date(eventData.start),
      new Date(eventData.end)
    );
    errors.push(...timeErrors);
  }

  // Check for conflicts
  if (eventData.start && eventData.end && errors.length === 0) {
    const conflicts = checkEventConflicts(
      eventData as Omit<CalendarEvent, 'id'>,
      existingEvents,
      excludeEventId
    );

    if (conflicts.length > 0) {
      errors.push({
        field: 'time',
        message: `Event conflicts with ${conflicts.length} existing event(s)`,
      });
    }
  }

  return errors;
};