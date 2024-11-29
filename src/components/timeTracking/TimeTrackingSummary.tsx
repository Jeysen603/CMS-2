import { Clock, DollarSign, Briefcase } from 'lucide-react';

interface TimeTrackingSummaryProps {
  totals: {
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
  };
}

export default function TimeTrackingSummary({ totals }: TimeTrackingSummaryProps) {
  const stats = [
    {
      name: 'Total Hours',
      value: totals.totalHours.toFixed(2),
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      name: 'Billable Hours',
      value: totals.billableHours.toFixed(2),
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      name: 'Non-Billable Hours',
      value: totals.nonBillableHours.toFixed(2),
      icon: Briefcase,
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}