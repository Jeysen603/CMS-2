import { create } from 'zustand';
import type { TimeEntry, TimeSheet } from '../types/timeTracking';

interface TimeTrackingState {
  entries: TimeEntry[];
  timeSheets: TimeSheet[];
  addEntry: (entry: TimeEntry) => void;
  updateEntry: (entry: TimeEntry) => void;
  deleteEntry: (id: string) => void;
  submitTimeSheet: (timeSheet: TimeSheet) => void;
  approveTimeSheet: (id: string, approverId: string) => void;
  rejectTimeSheet: (id: string, reason: string) => void;
  getWeeklyTimeSheet: (userId: string, weekStartDate: string) => TimeSheet | undefined;
  calculateTotals: (entries: TimeEntry[]) => {
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
  };
}

const useTimeTrackingStore = create<TimeTrackingState>((set, get) => ({
  entries: [],
  timeSheets: [],

  addEntry: (entry) => {
    set((state) => ({
      entries: [...state.entries, entry]
    }));
  },

  updateEntry: (entry) => {
    set((state) => ({
      entries: state.entries.map((e) => (e.id === entry.id ? entry : e))
    }));
  },

  deleteEntry: (id) => {
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id)
    }));
  },

  submitTimeSheet: (timeSheet) => {
    set((state) => ({
      timeSheets: [...state.timeSheets, {
        ...timeSheet,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      }]
    }));
  },

  approveTimeSheet: (id, approverId) => {
    set((state) => ({
      timeSheets: state.timeSheets.map((ts) =>
        ts.id === id
          ? {
              ...ts,
              status: 'approved',
              approvedAt: new Date().toISOString(),
              approvedBy: approverId
            }
          : ts
      )
    }));
  },

  rejectTimeSheet: (id, reason) => {
    set((state) => ({
      timeSheets: state.timeSheets.map((ts) =>
        ts.id === id
          ? {
              ...ts,
              status: 'rejected',
              comments: reason
            }
          : ts
      )
    }));
  },

  getWeeklyTimeSheet: (userId, weekStartDate) => {
    return get().timeSheets.find(
      (ts) => ts.userId === userId && ts.weekStartDate === weekStartDate
    );
  },

  calculateTotals: (entries) => {
    return entries.reduce(
      (acc, entry) => {
        const hours = entry.duration / 60;
        return {
          totalHours: acc.totalHours + hours,
          billableHours: acc.billableHours + (entry.billable ? hours : 0),
          nonBillableHours: acc.nonBillableHours + (!entry.billable ? hours : 0)
        };
      },
      { totalHours: 0, billableHours: 0, nonBillableHours: 0 }
    );
  }
}));

export default useTimeTrackingStore;