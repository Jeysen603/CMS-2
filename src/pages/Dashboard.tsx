import { BarChart, Users, Briefcase, DollarSign } from 'lucide-react';

const stats = [
  { name: 'Active Cases', value: '24', icon: Briefcase, change: '+4.75%' },
  { name: 'Total Clients', value: '42', icon: Users, change: '+10.2%' },
  { name: 'Revenue (MTD)', value: '$24,500', icon: DollarSign, change: '+28.4%' },
  { name: 'Billable Hours', value: '156', icon: BarChart, change: '+3.2%' },
];

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500"> from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Cases</h2>
          {/* Add recent cases list component here */}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
          {/* Add deadlines component here */}
        </div>
      </div>
    </div>
  );
}