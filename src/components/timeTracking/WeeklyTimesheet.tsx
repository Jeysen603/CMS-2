import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import type { TimeEntry } from '../../types/timeTracking';

interface WeeklyTimesheetProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  entries: TimeEntry[];
  onEditEntry: (entry: TimeEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export default function WeeklyTimesheet({
  selectedDate,
  onDateChange,
  entries,
  onEditEntry,
  onDeleteEntry
}: WeeklyTimesheetProps) {
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEntriesForDate = (date: Date) => {
    return entries.filter(entry => entry.date === format(date, 'yyyy-MM-dd'));
  };

  const handlePreviousWeek = () => {
    onDateChange(addDays(weekStart, -7));
  };

  const handleNextWeek = () => {
    onDateChange(addDays(weekStart, 7));
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </span>
          <Button variant="outline" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map((date) => (
          <div key={date.toISOString()} className="bg-white">
            <div className="p-2 text-center border-b">
              <div className="text-sm font-medium text-gray-900">
                {format(date, 'EEE')}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {format(date, 'd')}
              </div>
            </div>
            <div className="p-2 min-h-[150px]">
              {getEntriesForDate(date).map((entry) => (
                <div
                  key={entry.id}
                  className={`mb-2 p-2 rounded text-sm cursor-pointer hover:opacity-75 ${
                    entry.billable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  onClick={() => onEditEntry(entry)}
                >
                  <div className="font-medium">{entry.description}</div>
                  <div className="text-xs flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {entry.startTime} - {entry.endTime}
                  </div>
                  {entry.caseId && (
                    <div className="text-xs mt-1">Case: {entry.caseId}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}