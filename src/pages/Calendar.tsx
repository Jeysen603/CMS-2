import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { Button } from '../components/ui/Button';
import EventModal from '../components/calendar/EventModal';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { Toaster } from 'react-hot-toast';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {
    isEventModalOpen,
    selectedEvent,
    events,
    validationErrors,
    handleAddEvent,
    handleEditEvent,
    handleSaveEvent,
    handleDeleteEvent,
    setIsEventModalOpen
  } = useCalendarEvents();

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDays = getWeekDays();

  const getEventsByDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start), date)
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'court': return 'bg-red-100 text-red-800';
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'deadline': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePreviousWeek = () => {
    setSelectedDate(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(addWeeks(selectedDate, 1));
  };

  return (
    <div>
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium">
              {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
            </span>
            <Button variant="outline" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={handleAddEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-px border-b">
          {weekDays.map((date) => (
            <div key={date.toString()} className="p-4 text-center">
              <div className="text-sm font-semibold text-gray-900">
                {format(date, 'EEE')}
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {format(date, 'd')}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map((date) => {
            const dayEvents = getEventsByDate(date);
            return (
              <div
                key={date.toString()}
                className="min-h-[200px] bg-white p-2"
              >
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEditEvent(event)}
                    className={`mb-2 p-2 rounded text-sm cursor-pointer hover:opacity-75 ${getEventTypeColor(event.type)}`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs">
                      {format(new Date(event.start), 'h:mm a')}
                    </div>
                    {event.location && (
                      <div className="text-xs mt-1 truncate">
                        📍 {event.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
      />
    </div>
  );
}