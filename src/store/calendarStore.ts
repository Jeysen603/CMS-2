import { create } from 'zustand';
import type { CalendarEvent } from '../types/calendar';

interface CalendarState {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Court Hearing - Smith v. Johnson',
    description: 'Initial hearing for contract dispute case',
    start: '2024-03-20T09:00:00',
    end: '2024-03-20T11:00:00',
    type: 'court',
    caseId: '1',
    clientId: '1',
    attendees: ['1', '2'],
    location: 'County Courthouse, Room 304'
  },
  {
    id: '2',
    title: 'Client Meeting - Estate Planning',
    description: 'Review and finalize will documents',
    start: '2024-03-21T14:00:00',
    end: '2024-03-21T15:00:00',
    type: 'meeting',
    caseId: '2',
    clientId: '2',
    attendees: ['2'],
    location: 'Office - Conference Room A'
  }
];

const useCalendarStore = create<CalendarState>((set) => ({
  events: mockEvents,
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (event) => set((state) => ({
    events: state.events.map((e) => e.id === event.id ? event : e)
  })),
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((event) => event.id !== id)
  }))
}));

export default useCalendarStore;