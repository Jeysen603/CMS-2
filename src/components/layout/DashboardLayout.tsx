import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  FolderOpen,
  Clock,
  Scale,
  Bell
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Cases', href: '/dashboard/cases', icon: Briefcase },
  { name: 'Documents', href: '/dashboard/documents', icon: FolderOpen },
  { name: 'Billing', href: '/dashboard/billing', icon: FileText },
  { name: 'Time Tracking', href: '/dashboard/time-tracking', icon: Clock },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, pendingUsers } = useAuthStore();

  const isAdmin = user?.role === 'admin';
  const pendingCount = pendingUsers.filter(u => u.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Scale className="h-8 w-8 text-indigo-600 ml-3" />
          </div>
          
          {/* Mobile header actions */}
          <div className="flex items-center space-x-4">
            {isAdmin && pendingCount > 0 && (
              <Link
                to="/dashboard/settings"
                className="relative text-gray-500 hover:text-gray-700"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              </Link>
            )}
            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4 bg-indigo-600">
              <Scale className="h-8 w-8 text-white" />
              <h1 className="ml-2 text-xl font-bold text-white">Law Firm CMS</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                // Only show Settings to admin users
                if (item.name === 'Settings' && !isAdmin) {
                  return null;
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span>{item.name}</span>
                    {item.name === 'Settings' && isAdmin && pendingCount > 0 && (
                      <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Admin-only Time Tracking Administration */}
              {isAdmin && (
                <Link
                  to="/dashboard/admin-time-tracking"
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/dashboard/admin-time-tracking'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Clock className="mr-3 h-5 w-5" />
                  Time Administration
                </Link>
              )}
            </nav>
          </div>

          {/* User profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="ml-auto text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Desktop header */}
        <header className="hidden lg:flex h-16 bg-white shadow-sm items-center justify-end px-8">
          {isAdmin && pendingCount > 0 && (
            <Link
              to="/dashboard/settings"
              className="relative text-gray-500 hover:text-gray-700 mr-4"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingCount}
              </span>
            </Link>
          )}
        </header>

        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 mt-16 lg:mt-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}