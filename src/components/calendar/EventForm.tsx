import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { CalendarEvent } from '../../types/calendar';
import type { ValidationError } from '../../utils/eventValidation';

interface EventFormProps {
  event?: CalendarEvent;
  validationErrors?: ValidationError[];
  onSubmit: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onCancel: () => void;
}

export default function EventForm({
  event,
  validationErrors = [],
  onSubmit,
  onCancel
}: EventFormProps) {
  const [formData, setFormData] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    description: '',
    start: '',
    end: '',
    type: 'meeting',
    location: '',
    attendees: [],
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        start: event.start,
        end: event.end,
        type: event.type,
        location: event.location || '',
        attendees: event.attendees,
      });
    }
  }, [event]);

  const getFieldError = (fieldName: string) => {
    return validationErrors.find(error => error.field === fieldName)?.message;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Event Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        error={getFieldError('title')}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="datetime-local"
          label="Start Time"
          value={formData.start}
          onChange={(e) => setFormData({ ...formData, start: e.target.value })}
          error={getFieldError('start')}
          required
        />

        <Input
          type="datetime-local"
          label="End Time"
          value={formData.end}
          onChange={(e) => setFormData({ ...formData, end: e.target.value })}
          error={getFieldError('end')}
          required
        />
      </div>

      {getFieldError('time') && (
        <div className="text-sm text-red-600">
          {getFieldError('time')}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as CalendarEvent['type'] })}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
          required
        >
          <option value="meeting">Meeting</option>
          <option value="court">Court Hearing</option>
          <option value="deadline">Deadline</option>
          <option value="other">Other</option>
        </select>
        {getFieldError('type') && (
          <div className="text-sm text-red-600 mt-1">
            {getFieldError('type')}
          </div>
        )}
      </div>

      <Input
        label="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="Add location (optional)"
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {event ? 'Update Event' : 'Add Event'}
        </Button>
      </div>
    </form>
  );
}