import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { CalendarEvent } from '../types/calendar';
import useCalendarStore from '../store/calendarStore';
import { validateEventData, ValidationError } from '../utils/eventValidation';

export const useCalendarEvents = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarStore();

  const handleAddEvent = useCallback(() => {
    setSelectedEvent(undefined);
    setValidationErrors([]);
    setIsEventModalOpen(true);
  }, []);

  const handleEditEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setValidationErrors([]);
    setIsEventModalOpen(true);
  }, []);

  const handleSaveEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      const errors = validateEventData(
        eventData,
        events,
        selectedEvent?.id
      );

      if (errors.length > 0) {
        setValidationErrors(errors);
        errors.forEach(error => toast.error(error.message));
        return;
      }

      if (selectedEvent) {
        await updateEvent({ ...eventData, id: selectedEvent.id });
        toast.success('Event updated successfully');
      } else {
        const newEvent = {
          ...eventData,
          id: Date.now().toString(),
        };
        await addEvent(newEvent);
        toast.success('Event added successfully');
      }

      setIsEventModalOpen(false);
      setSelectedEvent(undefined);
      setValidationErrors([]);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  }, [events, selectedEvent, addEvent, updateEvent]);

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      setIsEventModalOpen(false);
      setSelectedEvent(undefined);
      setValidationErrors([]);
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  }, [deleteEvent]);

  return {
    isEventModalOpen,
    selectedEvent,
    events,
    validationErrors,
    handleAddEvent,
    handleEditEvent,
    handleSaveEvent,
    handleDeleteEvent,
    setIsEventModalOpen,
  };
};