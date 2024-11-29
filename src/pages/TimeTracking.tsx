import { useState } from 'react';
import { Plus, Clock, Filter, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import TimeEntryModal from '../components/timeTracking/TimeEntryModal';
import WeeklyTimesheet from '../components/timeTracking/WeeklyTimesheet';
import TimeTrackingSummary from '../components/timeTracking/TimeTrackingSummary';
import useTimeTrackingStore from '../store/timeTrackingStore';
import useAuthStore from '../store/authStore';
import type { TimeEntry } from '../types/timeTracking';

export default function TimeTracking() {
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useAuthStore();
  const { entries, addEntry, updateEntry, deleteEntry, calculateTotals } = useTimeTrackingStore();

  const handleSaveTimeEntry = (entryData: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entryData,
      id: Date.now().toString(),
      userId: user?.id || '',
    };
    addEntry(newEntry);
    setIsNewEntryModalOpen(false);
  };

  const userEntries = entries.filter(entry => entry.userId === user?.id);
  const totals = calculateTotals(userEntries);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Time Tracking</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsNewEntryModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Time Entry
          </Button>
        </div>
      </div>

      <TimeTrackingSummary totals={totals} />

      <div className="mt-6">
        <WeeklyTimesheet
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          entries={userEntries}
          onEditEntry={updateEntry}
          onDeleteEntry={deleteEntry}
        />
      </div>

      <TimeEntryModal
        isOpen={isNewEntryModalOpen}
        onClose={() => setIsNewEntryModalOpen(false)}
        onSave={handleSaveTimeEntry}
      />
    </div>
  );
}